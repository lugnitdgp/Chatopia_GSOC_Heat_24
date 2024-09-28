"use client";

import clsx from "clsx";

import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";
import styles from "./Conversations.module.css"

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx(
        styles.wrapper,
        isOpen ? styles.open : styles.closed
      )}
    >
      <EmptyState />
    </div>
  )
};

export default Home;