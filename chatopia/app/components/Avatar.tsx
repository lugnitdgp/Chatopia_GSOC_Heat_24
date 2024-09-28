'use client';

import Image from "next/image";
import { User } from "@prisma/client";
import styles from "./Avatar.module.css";
import { FullConversationType } from "@/app/types";
import { useEffect, useState } from "react";
import {socket} from "@/socket"

interface AvatarProps {
  user?: User;
  group?: FullConversationType;
  isActive?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  user , group , isActive
}) => {

    const activeStatus = isActive ? true : false;
    return ( 
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Image
                alt="Avatar"
                src={user?.image || group?.image || '/logo.png'}
                fill
                />
            </div>
            {activeStatus && <span className={styles.activeStatus}/>}
        </div>
    );
}
 
export default Avatar;