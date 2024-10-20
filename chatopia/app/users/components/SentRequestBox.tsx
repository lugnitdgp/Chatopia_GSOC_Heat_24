"use client";

import axios from "axios";
import { User } from "@prisma/client";
import Avatar from "@/app/components/Avatar";
import styles from './RequestBox.module.css';
import { socket } from "@/socket";

interface SentRequestBoxProps {
    data: User
    setData:any
}

const RequestBox: React.FC<SentRequestBoxProps> = ({data ,  setData}) => {
    const handleCancel = () => {
        axios.post('/api/request/cancel', { 
            userId: data.id,
            userEmail: data.email
        }).then(res => {
            socket.emit("cancel_friend_request", res.data)
        });

        setData((prev: User[]) => prev.filter((user) => user.id !== data.id));
    }

    return (
        <div className={styles.container}>
            <Avatar user={data} />
            <div className={styles.userInfo}>
                <div className={styles.info}>
                    <div>
                        <p style={{fontWeight:'bold' , fontSize:'1.2rem'}}>
                            {data.name}
                        </p>
                        <p>
                            {data.email}
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestBox;