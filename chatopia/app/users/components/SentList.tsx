"use client" ;

import styles from './SentList.module.css';
import { User } from "@prisma/client";
import SentRequestBox from './SentRequestBox';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { socket } from '@/socket';
import toast from 'react-hot-toast';

interface ReceivedListProps {
    data: User[]
}

export default function ReceivedList({data}: ReceivedListProps) {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState<User[]>(data);

    useEffect(() => {
        if(data) setUsers(data);
    }, [data])

    
    useEffect(() => {
        const sentFriendRequestHandler = (data: any) => {           
            if (data.sender.email === session?.user?.email) {
                setUsers(users => [...users, data.receiver]);
            }
        };

        const acceptedFriendRequestHandler = (data: any) => {
            if (data.sender.email === session?.user?.email) {
                setUsers(users => users.filter(u => u.id !== data.receiver.id));
                toast.success(`${data.receiver.email} accepted your request`);
            }
        };

        const rejectedFriendRequestHandler = (data: any) => {
            if (data.sender.email === session?.user?.email) {
                setUsers(users => users.filter(u => u.id !== data.receiver.id));
                toast.error(`${data.receiver.email} rejected your request`);
            }
        };

        const cancelledFriendRequestHandler = (data: any) => {
            if (data.sender.email === session?.user?.email) {
                setUsers(users => users.filter(u => u.id !== data.receiver.id));
            }
        };

        socket.on("new_friend_request", sentFriendRequestHandler);
        socket.on("new_user", acceptedFriendRequestHandler);
        socket.on("rejected_friend_request", rejectedFriendRequestHandler);
        socket.on("cancelled_friend_request", cancelledFriendRequestHandler);

        return () => {
            socket.off("new_friend_request", sentFriendRequestHandler);
            socket.off("new_user", acceptedFriendRequestHandler);
            socket.off("rejected_friend_request", rejectedFriendRequestHandler);
            socket.off("cancelled_friend_request", cancelledFriendRequestHandler);
        };
    }, [session])

    return (
        <div className={styles.container}>
            <h3>Sent</h3>
            {users.map((user) => (
                <SentRequestBox key={user.id} data={user} setData={setUsers}/>
            ))}
        </div>
    )
}