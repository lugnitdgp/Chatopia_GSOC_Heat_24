"use client" ;

import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'

export const Toggle = () => {
    const {isDark ,setIsDark} = useContext(ThemeContext);

    const toggleDarkMode = (checked: boolean) => {
    setIsDark(checked);
  };

  return (
    <DarkModeSwitch
      style={{ marginBottom: '2rem' }}
      checked={isDark}
      onChange={toggleDarkMode}
      size={20}
    />
  );
};