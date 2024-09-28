import { Conversation, Message, User } from "@prisma/client";

export type userConversation = {
    userId : string,
    conversationId : string,
    user : User
};

export type userSeenMessage = {
    // userId : string,
    // messageId : string,
    user : User
};

export type FullMessageType = Message &{
    sender: User ,
    userSeenMessages : userSeenMessage[]
};

export type FullConversationType = Conversation &{
    userConversations: userConversation[],
    messages: FullMessageType[]
};