'use client'

<<<<<<< HEAD
import { WiDaySunny } from 'react-icons/wi';
import { IoMdMoon } from 'react-icons/io';
import { useState } from 'react';

export default function ThemeToggleComponent() {
  const [theme, setTheme] = useState('light');

  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  console.log('Current theme:', theme);

  return (
    <button
      onClick={toggleTheme}
      className='h-8 w-8 bg-black dark:bg-white rounded-full relative cursor-pointer flex items-center justify-center'
    >
      {theme === 'dark' ? (
        <WiDaySunny style={{ color: '#FFFFFF', fontSize: '22px' }} />
      ) : (
        <IoMdMoon style={{ color: '#FFFF01', fontSize: '22px' }} />
      )}
    </button>
  );
}
=======
import { WiDaySunny } from "react-icons/wi";
import { IoMdMoon } from "react-icons/io";
import { useTheme } from "@context/ThemeContext";

export default function ThemeToggleComponent() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="h-8 w-8 bg-black dark:border-[#EDEDED] dark:border rounded-full relative cursor-pointer flex items-center justify-center"
        >
            {theme === "dark" ? (
                <WiDaySunny
                    style={{ color: "#FFFFFF", fontSize: "22px" }}
                />
            ) : (
                <IoMdMoon
                    style={{ color: "#FFFF01", fontSize: "22px" }}
                />
            )}
        </button>
    );
}
>>>>>>> a5fbf99c19b12c81eefcebe4da1a838a4172af71
