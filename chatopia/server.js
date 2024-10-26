import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// const io = null;
let onlineUsers = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with allowed origin
    methods: ["GET", "POST"]
  }
});

  io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    // add new user
    socket.on("new-user-add", (newUserEmail) => {
      if (!onlineUsers.some((user) => user.userEmail === newUserEmail)) {  
        // if user is not added before
        onlineUsers.push({ userEmail: newUserEmail, socketId: socket.id });
        console.log("new user is here!", onlineUsers);
      }
      // send all active users to new user
      io.emit("get-users", onlineUsers);
    });

    socket.on('join_room',(conversationId) => {
        console.log(`User joined room ${conversationId}`);
        socket.join(conversationId); // Join the user to a socket room
    });

    socket.on('leave_room',(conversationId) => {
        console.log(`User left room ${conversationId}`);
        socket.leave(conversationId); // Leave the user from a socket room
    });

    socket.on("send_friend_request", (data) => {
        console.log(`Friend request from ${data.sender.email} to ${data.receiver.email}`);
        
        if (data.status === 'pending') {
            io.emit("new_friend_request", data);
        }
        else if (data.status === "accepted") io.emit("new_user", data);
    });

    socket.on('accept_friend_request', (data) => {
        console.log(`${data.receiver.email} accepted ${data.sender.email}'s request.`);
        io.emit("new_user", data); //meant for the sender
    });

    socket.on('reject_friend_request', (data) => {
        console.log(`${data.receiver.email} received ${data.sender.email}'s request.`);
        io.emit("rejected_friend_request", data);
    });

    socket.on('cancel_friend_request', (data) => {
        console.log(`${data.sender.email} cancelled request to ${data.receiver.email}`);
        io.emit("cancelled_friend_request", data);
    });

    socket.on('send_message', (message) => {
        // console.log(`Message sent to room ${message.conversationId}`);
        io.to(message.conversationId).emit('receive_message', message);
    });

    socket.on('message_seen', (message) => {
        // console.log(`Message seen in room ${message.conversationId}`);
        io.to(message.conversationId).emit('update_message', message);
    })

    // Creates a new conversation in Conversation List
    socket.on("new_conversation", (conversation) => {
      // console.log(`New conversation created ${conversation.id}`);
      io.emit("recv_new_conversation", conversation);
    })

    // Adds a new message to the conversation in Conversation List
    socket.on("update_conversation", (message) => {
      // console.log(`Conversation updated ${message.conversationId}`);
      io.emit("recv_updated_conversation", message);
    })

    // Deletes the conversation from Conversation List as well as body
    socket.on("delete_conversation", (conversationId) => {
      console.log(`Conversation deleted ${conversationId}`);
      io.emit("recv_deleted_conversation", conversationId);
      io.emit("delete_messages", conversationId);
    })

  
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
      console.log("user disconnected", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });

    socket.on("offline", () => {
      // remove user from active users
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
      console.log("user is offline", onlineUsers);
      // send all online users to all users
      io.emit("get-users", onlineUsers);
    });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

