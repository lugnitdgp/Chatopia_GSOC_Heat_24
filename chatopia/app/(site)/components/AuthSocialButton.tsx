import { IconType } from 'react-icons';
import styles from './AuthSocialButton.module.css';

interface AuthSocialButtonProps {
  icon: IconType,
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick
}) => {
  return ( 
    <button
      type="button"
      onClick={onClick}
      className={styles.btn}
    >
      <Icon />
    </button>
   );
}
 
export default AuthSocialButton;