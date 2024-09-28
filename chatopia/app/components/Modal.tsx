"use client";

import { Dialog , DialogPanel, Transition , TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen,onClose,children}) => {
  return ( 
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="div"
        style={{position: 'relative', zIndex: 51}}
        onClose={onClose}
      >

        <TransitionChild
          as={Fragment}
          enter={styles.enterBg}
          enterFrom={styles.enterBgFrom}
          enterTo={styles.enterBgTo}
          leave={styles.leaveBg}
          leaveFrom={styles.leaveBgFrom}
          leaveTo={styles.leaveBgTo}
        >
          <div className={styles.bg}/>
        </TransitionChild>

        <div className={styles.wrapper}>
          <div
            className={styles.container}
          >
            <TransitionChild
              as={Fragment}
              enter={styles.enterModal}
              enterFrom={styles.enterModalFrom}
              enterTo={styles.enterModalTo}
              leave={styles.leaveModal}
              leaveFrom={styles.leaveModalFrom}
              leaveTo={styles.leaveModalTo}
            >
              <DialogPanel className={styles.dialogPanel}>
                <div className={styles.close}>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                  >
                    <span className={styles.closeText}>Close</span>
                    <IoClose className={styles.closeIcon}/>
                  </button>
                </div>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
   );
}
 
export default Modal;