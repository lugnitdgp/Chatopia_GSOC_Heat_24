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
import { IoDocument, IoImage } from "react-icons/io5";
import Link from "next/link";

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState<boolean>(false);

    const isOwn = session?.data?.user?.email === data?.sender?.email;
    const seenList = (data.userSeenMessages || [])
        .filter((userSeenMessage) => userSeenMessage.user.email !== data?.sender?.email)
        .map((userSeenMessage) => userSeenMessage.user.name)
        .join(", ");

    return (
        <div className={clsx(
            styles.container,
            isOwn && styles.ownContainer,
        )}>
            <div className={clsx(
                isOwn && styles.ownAvatar,
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
                    styles.textMsg,
                )}>
                    {data.body}
                    {data.file && data.fileType && (
                        data.fileType == "image" ? (
                            <button className={clsx(styles.fileMsg, styles.imgMsgBtn)} onClick={() => setImageOpen(true)}>
                                <span>
                                    <IoImage size={30} />
                                </span>
                                <span className="">
                                    {data.file?.split("/").pop()}
                                </span>
                                <ImageModal isOpen={imageOpen} onClose={() => setImageOpen(false)} src={data.file} />
                            </button>
                        ) : (
                            <Link className={clsx(styles.fileMsg)} href={data.file} target="_blank">
                                <span>
                                    <IoDocument size={30} />
                                </span>
                                <span className="">
                                    {data.file?.split("/").pop()}
                                </span>
                            </Link>
                        )
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