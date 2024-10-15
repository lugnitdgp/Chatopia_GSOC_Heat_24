"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useContext , useEffect, useState } from 'react'
import { ThemeContext } from '@/app//context/ThemeContext'
import { MdAddCircle } from "react-icons/md";
import styles from './UserList.module.css';
import GroupChatModal from "./ContactModal";
import ContactModal from "./ContactModal";
import { socket } from "@/socket";

interface UserListProps {
  items: User[],
  currentUserId: string
};

const UserList: React.FC<UserListProps> = ({items, currentUserId}) => {
    const {isDark ,setIsDark} = useContext(ThemeContext);
    const [users, setUsers] = useState<User[]>(items);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    useEffect(() => {
        const newUserHandler = (data: any) => {
            if (data.sender.id === currentUserId) {
                setUsers(users => [...users, data.receiver]);
            } else if (data.receiver.id === currentUserId) {
                setUsers(users => [...users, data.sender]);
            }
        };

        socket.on("new_user", newUserHandler);

        return () => {
            socket.off("new_user", newUserHandler);
        };
    }, []);

    return (
        <>
        <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        />
        <aside className={styles.wrapper} data-theme={isDark ? "dark" : "light"}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>People</div>
                </div>
                <div className={styles.addMsgIcon}
                    onClick={()=> setIsModalOpen(true)}
                    >
                        <MdAddCircle size={20} />
                </div>
            </div>
                {users.map((user) => (
                    <UserBox isSelf={currentUserId === user.id} key={user.id} data={user}/>
                ))}
            
        </aside>
        </>
    );
}

export default UserList;