"use client"

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Avatar from "@/app/components/Avatar";
import styles from './UserBox.module.css';
import LoadingModal from "@/app/components/LoadingModal";
import {socket} from "@/socket";

interface UserBoxProps {
    data: User
}

const UserBox: React.FC<UserBoxProps> = ({data}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // ON CLICK - Fetch the conversation id of conversation with clicked user and redirect to the conversation page
    const handleClick = useCallback(() => {
        setIsLoading(true);
    
        axios.post('/api/conversations', { 
          userId: data.id
        })
        .then((res) => {
          if(res.data.type === 'new'){
            socket.emit('new_conversation', res.data.conversation);
          }
          router.push(`/conversations/${res.data.conversation.id}`);
        })
        .finally(() => setIsLoading(false));
      }, [data, router]);
    

    return (
    <>
        {isLoading && (<LoadingModal />)}
        <div className={styles.container} onClick={handleClick}>
          <Avatar user={data} />
          <div className={styles.userInfo}>
            <div className={styles.info}>
              <div>
                <p>
                  {data.name}
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
    );
}

export default UserBox;