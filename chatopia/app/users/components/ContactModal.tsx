"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import MessageInput from "@/app/conversations/[conversationId]/components/MessageInput";
import axios from "axios";
import styles from "./ContactModal.module.css";
import { 
    FieldValues, 
    SubmitHandler, 
    useForm
  } from "react-hook-form";
import toast from "react-hot-toast";
import { socket } from "@/socket";
import { useSession } from "next-auth/react";


interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;

}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const { data: session, status } = useSession();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
          errors,
        }
      } = useForm<FieldValues>({
        defaultValues: {
          email: ''
        }
      });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('email', '');
        axios.post('/api/request', data)
        .then(res => socket.emit("send_friend_request", res.data))
        .catch(e => toast.error(e.response.data || "Something went wrong!"));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.container}>
                <h2>Add Contact</h2>
                <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
                >
                  <MessageInput 
                      type="email"
                      id = "email"
                      placeholder="Enter email of new contact"
                      register={register}
                      errors={errors}
                      required
                  />
                  <button
                        type="submit"
                        className={styles.send}
                        disabled={status === "loading"}
                    >
                        Add Contact
                  </button>
                </form>
            </div>
        </Modal>
    );
}

export default ContactModal;