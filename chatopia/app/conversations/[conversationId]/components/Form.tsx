"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { 
    FieldValues, 
    SubmitHandler, 
    useForm
  } from "react-hook-form";
import { HiPaperAirplane, HiPhoto, HiFaceSmile , HiLink ,HiPlusCircle , HiXCircle} from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import MessageInput from "./MessageInput";
import styles from "./Form.module.css"
import Picker from '@emoji-mart/react'
import d from '@emoji-mart/data'
import React, { useState , useRef, useEffect } from "react";
import Modal from "@/app/components/Modal";
import {socket} from "@/socket";

import { FileUpload } from 'primereact/fileupload';

const Form = () => {
    const { conversationId } = useConversation();
    const [isEmojiVisible, setIsEmojiVisible] = useState(false);
    const [isAttachmentVisible , setIsAttachmentVisible] = useState(false);

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
          message: '',
          image: ''
        }
      });

    const watchMsg = watch('message');

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        // Custom submit handler for adding messages to database

      setValue('message', '', { shouldValidate: true });
      axios.post('/api/messages', {
        ...data,
        conversationId
      })
      .then((response) => {
        socket.emit('send_message', response.data);
        socket.emit('update_conversation', response.data);
      });
    };

    const handleUpload = (result: any) => {
        axios.post('/api/messages', {
          image: result?.info?.secure_url,
          conversationId
        })
        
    };

    const handleEmojiSelect = (emoji: any) => {
        const new_message = watchMsg + emoji.native;
        setValue('message', new_message);
    }
    

    return (
        <div className={styles.wrapper}>
            <Modal isOpen={isAttachmentVisible} onClose={()=>setIsAttachmentVisible(false)}>
              <CldUploadButton
              className={styles.uploadContainer}
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}
                uploadPreset="wuuk33fv"
              >
                <HiPhoto size={30} className={styles.photoIcon} />
                <span style={{display:"flex", justifyContent:"center" , alignItems:"center"}}> Image </span>
              </CldUploadButton>

                {/* <button>
                  <HiPlusCircle size={30} className={styles.photoIcon} />
                  <FileUpload name="attachment" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
                </button>
                
                <HiXCircle size={30} className={styles.photoIcon} /> */}
              {/* <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
                >
                  <input type="file" name="image" />
                    <MessageInput
                        id="caption"
                        register={register}
                        errors={errors}
                        required 
                        placeholder="Write a caption"
                    />
                    <button
                        type="submit"
                        className={styles.send}
                    >
                        <HiPaperAirplane
                            size={18}
                            className={styles.sendIcon}
                        />
                    </button>

              </form> */}
            </Modal>

            

            <button className={styles.emoji} onClick={()=>setIsAttachmentVisible(true)}>
                <HiLink size={24} />
            </button>

            <Modal isOpen={isEmojiVisible} onClose={()=>setIsEmojiVisible(false)}>
                <Picker data={d} onEmojiSelect={handleEmojiSelect} />
            </Modal>
            
            <button className={styles.emoji} onClick={()=>setIsEmojiVisible(true)}>
                <HiFaceSmile size={24} />
            </button>

            <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Write a message"
                />
                <button
                    type="submit"
                    className={styles.send}
                >
                    <HiPaperAirplane
                        size={18}
                        className={styles.sendIcon}
                    />
                </button>

            </form>
        </div>
    )
}

export default Form;