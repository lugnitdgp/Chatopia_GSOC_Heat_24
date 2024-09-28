"use client"

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { userConversation } from "@/app/types";
import { Fragment, useMemo, useState } from "react";

import Avatar from "@/app/components/Avatar";
// import Modal from "@/app/components/Modal";
import { format } from "date-fns";
import { IoClose, IoTrash } from "react-icons/io5";
import { 
    Dialog, Transition , 
    TransitionChild , DialogPanel
} from "@headlessui/react";
import ConfirmModal from "./ConfirmModal";

import styles from "./ProfileDrawer.module.css"

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    data: Conversation & {
      userConversations: userConversation[],
    }
  }

const ProfileDrawer: React.FC<ProfileDrawerProps> =({isOpen, onClose, data})=>{
    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);

    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP');
      }, [otherUser.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser.name;
      }, [data.name, otherUser.name]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
          return `${data.userConversations.length} members`;
        }
        return 'Active';
    } , []);

    

    return (
        <>
        <ConfirmModal isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        />
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" style={{
              position: 'relative',
              zIndex: 50,
            }} onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter={styles.enterOne}
                    enterFrom={styles.enterFromOne}
                    enterTo={styles.enterToOne}
                    leave={styles.leaveOne}
                    leaveFrom={styles.leaveFromOne}
                    leaveTo={styles.leaveToOne}
                >
                    <div className={styles.containerOne}/>
                </TransitionChild>

                <div className={styles.containerTwo}>
                    <div className={styles.containerThree}>
                        <div className={styles.containerFour}>
                        <TransitionChild
                            as={Fragment}
                            enter={styles.enterTwo}
                            enterFrom={styles.enterFromTwo}
                            enterTo={styles.enterToTwo}
                            leave={styles.leaveTwo}
                            leaveTo={styles.leaveToTwo}
                        >
                            <DialogPanel
                                className={styles.panel}
                            >
                                <div className={styles.cont}>
                                    <div className={styles.contOne}>
                                        <div className={styles.contTwo}>
                                            <div className={styles.contThree}>
                                                <button 
                                                    className={styles.closeBtn}
                                                    onClick={onClose}
                                                    type="button"
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <IoClose size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                      <div className={styles.contFour}>
                                        <div className={styles.contFive}>

                                            <div className={styles.avatar}>
                                                <Avatar user={otherUser} />
                                            </div>

                                            <div>
                                                {title}
                                            </div>

                                            <div className={styles.status}>
                                                {statusText}
                                            </div>

                                            <div className={styles.deleteWrapper}>
                                                <div onClick={() => setConfirmOpen(true)}>
                                                    <div className={styles.deleteBtn}>
                                                        <IoTrash size={20} />
                                                    </div>
                                                    <div className={styles.deleteText}>
                                                        Delete
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.userWrapper}>
                                              <dl className={styles.dl}>
                                                {data.isGroup && (
                                                  <div>
                                                    <dt className={styles.dtOne}>
                                                      Users
                                                    </dt>
                                                    <dd className={styles.ddOne}>
                                                      {data.userConversations.map((userConversation) => userConversation.user.name).join(', ')}
                                                    </dd>
                                                  </div>
                                                )}

                                                {!data.isGroup && (
                                                  <div>
                                                    <dt className={styles.dtOne}>
                                                      Email
                                                    </dt>
                                                    <dd className={styles.ddOne}>
                                                      {otherUser.email}
                                                    </dd>
                                                  </div>
                                                )}

                                                {!data.isGroup && (
                                                  <>
                                                    <hr />
                                                    <div>
                                                      <dt className={styles.dtOne}>
                                                        Joined
                                                      </dt>
                                                      <dd
                                                        className={styles.ddOne}>
                                                        <time dateTime={joinedDate}>
                                                          {joinedDate}
                                                        </time>
                                                      </dd>
                                                    </div>
                                                  </>
                                                )}
                                              </dl>
                                            </div>
                                        </div>
                                      </div>
                                  </div>
                            </DialogPanel>
                        </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
      </>
    );
}

export default ProfileDrawer;