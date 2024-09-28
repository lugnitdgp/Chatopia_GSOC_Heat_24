import styles from './EmptyState.module.css';

export default function EmptyState (){
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h3>
                Select a chat or start a new conversation
                </h3>
            </div>
        </div>
    );
}
