import { useEffect, useState } from "react";

export default function useTheme() {
  // Get theme from localStorage or system preference
  const getInitialTheme = () => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark"); // Add dark mode class
      localStorage.setItem("theme", "dark"); // Store in localStorage
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark mode class
      localStorage.setItem("theme", "light"); // Store in localStorage
    }
  }, [theme]);

  return { theme, setTheme };
}
