"use client";

import React, { Fragment } from "react";
import { 
    Dialog , DialogPanel , 
    Transition , TransitionChild
} from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import styles from "./LoadingModal.module.css";

const LoadingModal = () => {
  return (
    <Transition show as={Fragment}>
      <Dialog 
        as="div" 
        style={{ position : "relative" , zIndex : 50 }}
        onClose={() => {}}
      >
        <TransitionChild
          as={Fragment}
          enter={styles.enterBg}
          enterFrom={styles.enterFromBg}
          enterTo={styles.enterToBg}
          leave={styles.leaveBg}
          leaveFrom={styles.leaveFromBg}
          leaveTo={styles.leaveToBg}
        >
          <div className={styles.bg}/>
        </TransitionChild>

        <div className={styles.wrapper}>
          <div className={styles.container}>
            <DialogPanel>
              <ClipLoader size={40} color="#0284c7" />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default LoadingModal;