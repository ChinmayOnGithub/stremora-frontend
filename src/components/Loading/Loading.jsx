import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

function Loading({ message = "Loading..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center h-full text-gray-900 dark:text-white text-lg space-y-4"
    >
      {/* Animated Loading Box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="rounded-lg px-16 py-8 bg-black/10 dark:bg-white/10 flex flex-col justify-center items-center shadow-lg"
      >
        {/* Spinner with Bounce Effect */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="w-12 h-12 text-amber-500" />
        </motion.div>

        {/* Loading Message */}
        <motion.h1
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="font-medium text-xl mt-4"
        >
          {message}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
}

export default Loading;
