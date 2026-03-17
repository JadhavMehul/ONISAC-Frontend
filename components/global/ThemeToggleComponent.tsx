'use client'

import { WiDaySunny } from "react-icons/wi";
import { IoMdMoon } from "react-icons/io";
import { useTheme } from "@context/ThemeContext";

export default function ThemeToggleComponent() {
    const { theme, toggleTheme } = useTheme();

    return (
        // <button
        //     onClick={toggleTheme}
        //     className="h-8 w-8 bg-black dark:bg-white rounded-full relative cursor-pointer flex items-center justify-center"
        // >
        //     {theme === "dark" ? (
        //         <WiDaySunny
        //             style={{ color: "#FFFFFF", fontSize: "22px" }}
        //         />
        //     ) : (
        //         <IoMdMoon
        //             style={{ color: "#FFFF01", fontSize: "22px" }}
        //         />
        //     )}
        // </button>
        <button 
            onClick={toggleTheme}
            className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
            >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
    );
}