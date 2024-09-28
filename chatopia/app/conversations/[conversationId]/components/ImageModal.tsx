"use client";

import Modal from "@/app/components/Modal";
import Image from "next/image";
import styles from "./ImageModal.module.css";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src
}) => {
  if (!src) {
    return null;
  }

  return ( 
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <Image
          alt="Image"
          className={styles.img}
          fill
          src={src}
        />
      </div>
    </Modal>
  );
}
 
export default ImageModal;