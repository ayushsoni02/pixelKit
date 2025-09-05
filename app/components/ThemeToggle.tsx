"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";


export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="relative inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-inner">
      <button
        onClick={() => setTheme("light")}
        className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          theme === "light"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => setTheme("system")}
        className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          theme === "system"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        <Monitor className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          theme === "dark"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
