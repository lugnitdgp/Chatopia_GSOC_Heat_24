"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import styles from "./GroupChatModal.module.css";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { socket } from "@/socket";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen, onClose, users
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,handleSubmit,setValue,watch,
    formState: {errors}
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      image : '/logo.png',
      members: []
    }
  });

  const members = watch('members');

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
    .then(response => {
      if (response.data.isGroup) { 
        alert(response.data.id);
        socket.emit('new_conversation', response.data);
      }

      router.refresh();
      onClose();
    })
    .catch(e => toast.error(e.response.data || 'Something went wrong'))
    .finally(() => setIsLoading(false))
  }

  return ( 
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <h2> Create a group chat </h2>
            <p> Create a chat with more than 2 people. </p>
            <div
              className={styles.inputs}>
              <Input
                register={register}
                label="Name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
              />

              <div className={styles.imgUploader}>
                  <Image
                    width="48"
                    height="48"
                    style={{ borderRadius: '50%' }}
                    src={ '/logo.png'}
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="wuuk33fv"
                    className={styles.uploadBtn}
                  >
                    <Button
                      disabled={isLoading}
                      secondary
                      type="button"
                    >
                      Change
                    </Button>
                  </CldUploadButton>
              </div>

              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true
                })}
                value={members}
              />
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
   );
}
 
export default GroupChatModal;