'use client'
import { useState } from "react";
import { User } from "@prisma/client";

import useRoutes from "@/app/hooks/useRoutes"

import styles from "./DesktopSidebar.module.css";

import Avatar from "../Avatar";
import DesktopItem from "./DesktopItem";
import SettingsModal from "./SettingsModal"
import { ThemeContext } from '@/app/context/ThemeContext'
import { useContext } from 'react'
import { Toggle } from "@/app/components/Toggle"


interface DesktopSidebarProps {
    currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
    currentUser
}) => {
    const routes = useRoutes();
    const [isOpen , setIsOpen] = useState(false);
    const {isDark ,setIsDark} = useContext(ThemeContext);

    // console.log({ currentUser })

    return (
        <>
        <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        />
        <div className={styles.wrapper} data-theme={isDark ? "dark" : "light"}>
            <nav className={styles.navbar}>
                <ul role="list" className={styles.list}>
                {routes.map((item) => (
                    <DesktopItem
                        key={item.label}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={item.active}
                        onClick={item.onClick}
                    />
                ))}
                </ul>
            </nav>
            
            <nav className={styles.accountNavbar}>
            <Toggle />
            <div onClick={() => setIsOpen(true)} className={styles.avatarContainer}>
                <Avatar user={currentUser} />
            </div>
            </nav>
        </div>
        </>
    )
}

export default DesktopSidebar;