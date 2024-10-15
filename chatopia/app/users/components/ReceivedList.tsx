"use client" ;

import styles from './ReceivedList.module.css';
import { User } from "@prisma/client";
import ReceivedRequestBox from './ReceivedRequestBox';
import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';

interface ReceivedListProps {
    data: User[]
}

export default function ReceivedList({data}: ReceivedListProps) {
    const { data: session, status } = useSession({ required: true });
    const [users, setUsers] = useState<User[]>(data);

    useEffect(() => {
        if(data) setUsers(data);
    }, [data])
    
    useEffect(() => {
        const receivedFriendRequestHandler = (data: any) => {           
            if (data.receiver.email === session?.user?.email) {
                setUsers(users => [...users, data.sender]);
            }
        };

        const cancelledFriendRequestHandler = (data: any) => {
            console.log("received cancel", data, session);
            if (data.receiver.email === session?.user?.email) {
                setUsers(users => users.filter(u => u.id !== data.sender.id));
            }
        };

        socket.on("new_friend_request", receivedFriendRequestHandler);
        socket.on("cancelled_friend_request", cancelledFriendRequestHandler);

        return () => {
            socket.off("new_friend_request", receivedFriendRequestHandler);
            socket.off("cancelled_friend_request", cancelledFriendRequestHandler);
        };
    }, [session])

    return (
        <div className={styles.container}>
            <h3>Received</h3>
            {users.map((user) => (
                <ReceivedRequestBox key={user.id} data={user} setData={setUsers} />
            ))}
        </div>
    )
}
