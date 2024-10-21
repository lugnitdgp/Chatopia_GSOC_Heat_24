import Button from "@/app/components/Button";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/Modal";
import { FullConversationType, FullMessageType } from "@/app/types";
import { socket } from "@/socket";
import { Conversation } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ForwardModalProps {
    data: FullMessageType,
    isOpen: boolean,
    setIsOpen: (status: boolean) => void
};

const ForwardModal: React.FC<ForwardModalProps> = ({
    data: { file, fileType, body, id }, isOpen, setIsOpen
}) => {
    const { data: session, status } = useSession();
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
        if (!session?.user) {
            setConversations([]);
            return;
        }
        
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
    }, [session]);

    return (
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
            <br/>
            <Button onClick={handleForward} disabled={!to.length || isLoading}>
                Forward
            </Button>
        </Modal>
    );
};

export default ForwardModal;