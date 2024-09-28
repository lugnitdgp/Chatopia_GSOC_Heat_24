"use client"

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";
import ImageModal from "./ImageModal";
import clsx from "clsx";
import styles from "./MessageBox.module.css"

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
  }

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session?.data?.user?.email === data?.sender?.email;
    const seenList = (data.userSeenMessages || [])
    .filter((userSeenMessage) => userSeenMessage.user.email !== data?.sender?.email)
    .map((userSeenMessage) => userSeenMessage.user.name)
    .join(", ");

    

    return (
        <div className={clsx(
            styles.container,
            isOwn && styles.ownContainer ,
        )}>
            <div className={clsx(
            isOwn && styles.ownAvatar ,
            )}>
                <Avatar user={data.sender} />
            </div>
            
            <div className={clsx(
                styles.msgBody,
                isOwn && styles.ownMsgBody,
            )}>
                <div className={styles.msgInfo}>
                    <div className={styles.msgSender}>
                        {data.sender.name}
                    </div>
                    <div className={styles.msgTime}>
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={clsx(
                    styles.msg,
                    isOwn && styles.ownMsg,
                    data.image ? styles.imageMsg : styles.textMsg,
                )}>
                    <ImageModal
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />

                    {data.image ? (
                        <Image
                        onClick={() => setImageModalOpen(true)}
                        alt="Image"
                        height="288"
                        width="288"
                        src={data.image}
                        className={styles.img}
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                <div className={styles.seenStaus}>
                    {`Seen by ${seenList}`}
                </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox;