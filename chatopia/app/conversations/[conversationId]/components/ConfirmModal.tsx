"use client";

import useConversation from "@/app/hooks/useConversation";
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import { Dialog , DialogTitle} from "@headlessui/react";
import styles from "./ConfirmModal.module.css";
import { FiAlertTriangle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {socket} from "@/socket";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onClose}) => {

    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);
    
        axios.delete(`/api/conversations/${conversationId}`)
        .then(() => {
          onClose();
          router.push('/conversations');
          router.refresh();
          socket.emit('delete_conversation', conversationId);
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
      }, [conversationId, router, onClose]);
    
    return(
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.alert}>
          <FiAlertTriangle className={styles.alertIcon}/>
        </div>
        <div
          className={styles.delete}
        >
          <DialogTitle
            as="h3"
            className={styles.delete}
          >
            Delete conversation
          </DialogTitle>

          <div style={{marginTop: '0.5rem'}}>
            <p className={styles.confirmText}>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button
          disabled={isLoading}
          danger
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          disabled={isLoading}
          secondary
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
    );
}

export default ConfirmModal;