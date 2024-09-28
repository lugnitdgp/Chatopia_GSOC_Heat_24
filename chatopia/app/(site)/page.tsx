import Image from "next/image";
import styles from "./Home.module.css";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className={styles.authContainer}>
      <div>
        <Image
          alt="Logo"
          height="48"
          width="48"
          className={styles.logoImage}
          src="/logo.png"
        />
        <h2 className={styles.authTitle}>
          Start Chatting in Real Time now
        </h2>
      </div>
      <AuthForm />
    </div>
  )
}