"use client" ;
import { createContext } from "react";
import useLocalStorage from "use-local-storage";



export const ThemeContext = createContext() ;

export function ThemeProvider({children}){
    const [isDark, setIsDark] = useLocalStorage("isDark" , true);
    return(
        <ThemeContext.Provider value={{isDark,setIsDark}}>
            {children}
        </ThemeContext.Provider>
    );
}