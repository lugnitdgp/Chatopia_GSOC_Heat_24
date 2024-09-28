"use client";

import Link from "next/link";
import clsx from "clsx";
import styles from "./MobileItem.module.css";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  }

  return ( 
    <Link 
      onClick={onClick}
      href={href}
      className={clsx(
        styles.link,
        active && styles.active
      )}
    >
      <Icon className={styles.icon} />
    </Link>
   );
}
 
export default MobileItem;