"use client";

import axios from "axios";
import { User } from "@prisma/client";
import Avatar from "@/app/components/Avatar";
import styles from './RequestBox.module.css';
import { socket } from "@/socket";

interface RecievedRequestBoxProps {
    data: User
    setData:any
}

const RequestBox: React.FC<RecievedRequestBoxProps> = ({data , setData}) => {
    const handleAccept = () => {
        axios.post('/api/request/accept', { 
            userId: data.id,
            userEmail: data.email
        }).then(res => {
            socket.emit("accept_friend_request", res.data);
        });
        
        setData((prev: User[]) => prev.filter((user) => user.id !== data.id));
    }

    const handleDecline = () => {
        axios.post('/api/request/decline', { 
            userId: data.id,
            userEmail: data.email
        }).then(res => {
            socket.emit("reject_friend_request", res.data);
        });
        
        setData((prev: User[]) => prev.filter((user) => user.id !== data.id));
    }

    return (
        <div className={styles.container}>
            <Avatar user={data} />
            <div className={styles.userInfo}>
                <div className={styles.info}>
                    <div className={styles.details}>
                        <p style={{fontWeight:'bold' , fontSize:'1.2rem'}}>
                            {data.name}
                        </p>
                        <p>
                            {data.email}
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={handleAccept}>Accept</button>
                        <button onClick={handleDecline}>Decline</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestBox;