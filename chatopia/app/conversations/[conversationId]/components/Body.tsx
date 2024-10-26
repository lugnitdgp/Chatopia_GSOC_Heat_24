"use client"

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useRouter } from "next/navigation";
import MessageBox from "./MessageBox";
import styles from "./Body.module.css"

// import prisma from "@/app/libs/prismadb"
// import getCurrentUser from "@/app/actions/getCurrentUser";
import { socket } from "@/socket";
import { find, update } from "lodash";
import { abort } from "process";

interface BodyProps {
    initialMessages: FullMessageType[],
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {

    const router = useRouter();

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null); //to scroll to bottom of latest messages

    const { conversationId } = useConversation();

    // Body component will listen for new messages and update the state whenever a new message is received through the socket

    useEffect(() => {
      //getting the notification permission
      Notification.requestPermission();
      // Update the message receive in the current message
      const updateMessageHandler = (newMessage: FullMessageType) => {
        // Update the message in the state only if the message belongs to the current conversation
        if(newMessage.conversationId === conversationId){
          setMessages((current) => current.map((currentMessage) => {
            if (currentMessage.id === newMessage.id) {
              return newMessage;
            }

            return currentMessage;
          }));
        }
        socket.emit('update_conversation', newMessage);
      }

      const messageHandler = (message: FullMessageType) => {
        // Mark message received as seen , and update sidebar
        axios
        .post(`/api/conversations/${conversationId}/seen`)
        .then((res) => {
          if(res.data.type === "message"){
            const updatedMessage = res.data.message;
            socket.emit('message_seen', updatedMessage);
            // console.log("Message Seen")
            socket.emit('update_conversation', updatedMessage);
          }
          
        });

        // Render received message from server only if it belongs to the current conversation
        if(message.conversationId === conversationId){
          // Add the new message to the state
          console.log(Notification.permission);
          if (document.visibilityState === 'hidden') {
            new Notification(`${message.sender.name} sent a msg`);
          }
          setMessages((current) =>{ 
            if(find(current, {id: message.id})){
              return current;
            }
            return [...current, message]}
          );
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      };

      const deleteMsgHandler = (convId: string) => {
        // Deletes all messages from the current conversation, if its ID matches the conversation ID received from the server
        if(conversationId === convId){
          router.push('/conversations');
          router.refresh();
        }
      }

      // Mark current conversation as seen
      axios.post(`/api/conversations/${conversationId}/seen`)
      .then((res) => {
        console.log(res.data);
        if(res.data.type === "message"){
          const updatedMessage = res.data.message;
          socket.emit('message_seen', updatedMessage);
        }
      });


      socket.on('receive_message', messageHandler);
      socket.on('update_message', updateMessageHandler);
      socket.on('delete_messages' , deleteMsgHandler);

      return () => {
        socket.off('receive_message', messageHandler);
        socket.off('update_message', updateMessageHandler);
        socket.off('delete_messages', deleteMsgHandler)
      }
        
      }, [conversationId]);

    return (
        <div className={styles.wrapper}>
            {messages.map((message, i) => (
                <MessageBox
                isLast={i === messages.length - 1}
                key={message.id}
                data={message}
                />
            ))}
            <div ref={bottomRef} className={styles.scrollBtn} />
        </div>
    )
}

export default Body;