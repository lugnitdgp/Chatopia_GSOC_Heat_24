"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns"
import { useSession } from "next-auth/react";
import clsx from "clsx";


import { FullConversationType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import styles from "./ConversationBox.module.css";
import useOtherUser from "@/app/hooks/useOtherUser";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean;
    activeList: string [];
  }


  
const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  activeList
}) => {
      const otherUser = useOtherUser(data)
      const session = useSession();
      const router = useRouter();

      const handleClick = useCallback(() => {
          // Redirecting to the corresponding conversation page
          router.push(`/conversations/${data.id}`);
      }, [data.id, router]);
    
      const lastMessage = useMemo(() => {
        // Extracting all messages from the conversation
        const messages = data.messages || [];
    
        // Returning the last message
        return messages[messages.length - 1];
      }, [data.messages]);

      const userEmail = useMemo(() => {
        // Extracting the email of the current logged in user
        return session.data?.user?.email;
      }, [session.data?.user?.email]);
    
      // If user has not seen the last message return false
      const hasSeen = useMemo(() => {
        // If there is no last message return false
        if (!lastMessage) {
          return false;
        }
        
        // Extracting the userSeenMessages array from the last message
        const userSeenMessagesArray = lastMessage.userSeenMessages || [];
    
        // If there is no current user email return false
        if (!userEmail) {
          return false;
        }

        // Extracting the users who have seen the last message
        const seenArray = userSeenMessagesArray.map((userSeenMessage) => userSeenMessage.user);

        // Checking if the current user has seen the last message
        return seenArray.filter((user : User) => 
          user.email === userEmail).length !== 0;
      }, [userEmail, lastMessage]);
    
      const lastMessageText = useMemo(() => {
        return (lastMessage?.body) || (lastMessage?.file ? "Sent a file" : "Started a conversation");
      }, [lastMessage]);

      console.log("active list:", activeList);
      // const activeEmails = activeList.map((activeUser)=>activeUser.email );
      // console.log("active emails:" , activeEmails);
      const isActive = activeList.includes(otherUser.email!);

    return (
        <div 
          onClick={handleClick}
          className={clsx(
            styles.wrapper,
            selected ? styles.selected : styles.unselected
        )}
        >
            {data.isGroup ? 
            (
            <Avatar group={data} />
            )
            :(
            <Avatar user={otherUser} isActive = {isActive}/>
            )}
            <div className={styles.container}>
              <div>
                <div className={styles.conversation}>
                  <p className={styles.name}>
                    {data.name || otherUser.name}
                    {data.isSelf && " (You)"}
                  </p>
                  {lastMessage?.createdAt && (
                    <p className={styles.dateTime}>
                      {format(new Date(lastMessage.createdAt), 'p')}
                    </p>
                  )}
                </div>
                <p
                  className={clsx(
                    styles.msg,
                    hasSeen ? styles.hasSeen : styles.hasNotSeen
                  )}
                >
                  {lastMessageText}
                </p>
              </div>
            </div>
        </div>
    );


}

export default ConversationBox;
