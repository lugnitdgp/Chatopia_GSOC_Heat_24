'use client';

import clsx from 'clsx';
import {
  FieldErrors,
  FieldValues,
  UseFormRegister
} from 'react-hook-form';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled
}) => {
  return ( 
    <div>
      <label 
        className={styles.inputLabel}
        htmlFor={id}
      >
        {label}
      </label>

      <div className={styles.container}>
        <input
            id={id}
            type={type}
            autoComplete={id}
            disabled={disabled}
            {...register(id, { required })}
            className={`${styles.formInput} 
            ${errors[id] ? styles.error : ""} 
            ${disabled ? styles.disabled : ""}`}
        />
      </div>
    </div>
   );
}
 
export default Input;