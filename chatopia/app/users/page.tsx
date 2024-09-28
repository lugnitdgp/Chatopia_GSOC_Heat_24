'use client'
// import { signOut } from "next-auth/react"
import styles from './Users.module.css'
import EmptyState from '../components/EmptyState'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import RequestList from './components/RequestList'


export default function Users(){
    const {isDark ,setIsDark} = useContext(ThemeContext);

    return (
        <div className={styles.container} data-theme={isDark ? "dark" : "light"}>
            {/* <EmptyState /> */}
        </div>
    )
}