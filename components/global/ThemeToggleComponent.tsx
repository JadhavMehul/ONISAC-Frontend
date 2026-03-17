'use client';

import { WiDaySunny } from "react-icons/wi";
import { IoMdMoon } from "react-icons/io";
import { useTheme } from "next-themes";

export default function ThemeToggleComponent() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="h-8 w-8 bg-black dark:bg-white rounded-full relative cursor-pointer flex items-center justify-center"
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