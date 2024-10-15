"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useContext , useState } from 'react'
import { ThemeContext } from '@/app//context/ThemeContext'
import { MdAddCircle } from "react-icons/md";
import styles from './UserList.module.css';
import GroupChatModal from "./ContactModal";
import ContactModal from "./ContactModal";

interface UserListProps {
  items: User[],
  currentUserId: string
};

const UserList: React.FC<UserListProps> = ({items, currentUserId}) => {
    const {isDark ,setIsDark} = useContext(ThemeContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
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
                {items.map((item) => (
                    <UserBox isSelf={currentUserId === item.id} key={item.id} data={item}/>
                ))}
            
        </aside>
        </>
    );
}

export default UserList;