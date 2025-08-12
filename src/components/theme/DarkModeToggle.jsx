import { useTheme } from './theme-provider';
import { BsSun, BsMoon } from "react-icons/bs";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 mx-1 bg-gray-600 dark:bg-gray-800 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 transition"
    >
      {theme === "dark" ?
        <BsSun className="text-yellow-400" size={20} />
        :
        <BsMoon className="text-gray-300" size={20} />}
    </button>
  );
} 