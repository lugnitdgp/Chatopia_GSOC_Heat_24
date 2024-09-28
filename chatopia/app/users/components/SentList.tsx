"use client" ;

import styles from './SentList.module.css';
import { User } from "@prisma/client";
import SentRequestBox from './SentRequestBox';
import { useEffect, useState } from 'react';

interface ReceivedListProps {
    data: User[]
}

export default function ReceivedList({data}: ReceivedListProps) {
    const [users, setUsers] = useState<User[]>(data);

    useEffect(() => {
        if(data) setUsers(data);
    }, [data])

    return (
        <div className={styles.container}>
            <h3>Sent</h3>
            {users.map((user) => (
                <SentRequestBox key={user.id} data={user} setData={setUsers}/>
            ))}
        </div>
    )
}