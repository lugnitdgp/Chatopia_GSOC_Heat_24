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


interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;

}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {

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
                    >
                        Add Contact
                  </button>
                </form>
            </div>
        </Modal>
    );
}

export default ContactModal;