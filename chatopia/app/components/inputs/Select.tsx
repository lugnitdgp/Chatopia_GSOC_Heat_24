"use client";

import ReactSelect from "react-select";
import styles from "./Select.module.css";

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
  isMulti?: boolean;
}

const Select: React.FC<SelectProps> = ({
    label,value,onChange,options,disabled,isMulti
}) => {
  return ( 
  <div className={styles.wrapper}>

    <label className={styles.label}>
      {label}
    </label>

    <div style={{marginTop:'0.5rem'}}>
        <ReactSelect
        isDisabled={disabled}
        value={value}
        onChange={onChange}
        isMulti={isMulti || true}
        options={options}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        classNames={{
          control: () => "text-sm",
        }}
        />
    </div>
  </div>
   );
}
 
export default Select;