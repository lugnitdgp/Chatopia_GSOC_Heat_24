"use client"

import Avatar from "@/app/components/Avatar";
import { FullConversationType, FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import ImageModal from "./ImageModal";
import clsx from "clsx";
import styles from "./MessageBox.module.css"
import { IoDocument, IoImage } from "react-icons/io5";
import Link from "next/link";
import axios from "axios";
import Modal from "@/app/components/Modal";
import Select from "@/app/components/inputs/Select";
import { Conversation } from "@prisma/client";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import { socket } from "@/socket";

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const ForwardModal: React.FC<{
    data: FullMessageType
}> = ({
    data: { file, fileType, body, id }
}) => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [to, setTo] = useState<string[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const handleForward = async () => {
        if (to.length === 0) {
            toast.error("Please select atleast one conversation");
            return;
        }

        setIsLoading(true);

        await Promise.all(to.map(conversationId => {
            return new Promise(resolve => {
                axios.post("/api/messages", {
                    message: body,
                    conversationId,
                    isForwarded: true,
                    file,
                    fileType
                })
                .then(response => {
                    socket.emit('send_message', response.data);
                    socket.emit('update_conversation', response.data);
                })
                .catch(error => {
                    console.error(error);
                    toast.error("Failed to forward");
                })
                .finally((() => resolve(1)));
            });
        }));

        toast.success("Forwarded");
        setIsLoading(false);
        setTo([]);
        setIsOpen(false);
    };
    
    useEffect(() => {
        axios.get("/api/conversations")
            .then(res => {
                const conversations = res.data;
                
                const mapped = conversations.map((c: FullConversationType) => {
                    if (c.isGroup) {
                        return {
                            label: c.name,
                            value: c.id
                        };
                    } else {
                        const otherUserConversation = c.userConversations.find((uc:any) => uc.user.email !== session?.user?.email);

                        if (!otherUserConversation) return {
                            label: c.userConversations[0]?.user?.name || c.id,
                            value: c.id
                        };

                        return {
                            label: otherUserConversation.user.name,
                            value: c.id
                        };
                    }
                });

                setConversations(mapped);
            })
            .catch(error => {
                console.error(error);
                toast.error("Something went wrong");
            });
    }, []);

    return (
        <div className={styles.fwdBox}>
            <button className={clsx(styles.fwdBtn)} disabled={status !== "authenticated"} onClick={() => setIsOpen(true)}>
                Forward
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <p>
                    {body?.slice(0,50)}
                    {file?.split("/").pop()}
                </p>
                <br/>
                <Select
                    options={conversations}
                    label="Forward to"
                    onChange={(records: any) => setTo(records.map((r: any) => r.value))}
                />
                <Button onClick={handleForward} disabled={!to.length || isLoading}>
                    Forward
                </Button>
            </Modal>
        </div>
    );
};

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const session = useSession();
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
                     
                    <ForwardModal data={data} />
                </div>

                {data.isForwarded && (
                    <div className={clsx(styles.fwdMsg)}>
                        <span>forwarded</span>
                    </div>
                )}
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