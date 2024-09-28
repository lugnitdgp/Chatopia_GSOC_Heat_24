"use client" ;

import styles from './ReceivedList.module.css';
import { User } from "@prisma/client";
import ReceivedRequestBox from './ReceivedRequestBox';
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
            <h3>Received</h3>
            {users.map((user) => (
                <ReceivedRequestBox key={user.id} data={user} setData={setUsers} />
            ))}
        </div>
    )
}
