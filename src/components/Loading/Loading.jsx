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
      {/* Animated Loading Circle */}
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer Circle */}
        <motion.div
          className="absolute w-full h-full border-4 border-amber-500/20 rounded-full"
        ></motion.div>

        {/* Inner Circle with Gradient */}
        <motion.div
          className="absolute w-full h-full border-4 border-amber-500 rounded-full border-t-transparent"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </motion.div>

      {/* Loading Message */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-medium text-xl mt-4 text-amber-500"
      >
        {message}
      </motion.h1>
    </motion.div>
  );
}

export default Loading;