import { FaSpinner } from "react-icons/fa";

function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center h-full text-gray-900 dark:text-white text-lg space-y-4">
      {/* Animated Spinner */}
      <FaSpinner className="w-10 h-10 text-orange-500 animate-spin" />

      {/* Loading Message */}
      <h1 className="font-semibold text-xl">{message}</h1>
      {/* <img src="/loader.svg" alt="loader animation" className="" /> */}
    </div>
  );
}

export default Loading;
