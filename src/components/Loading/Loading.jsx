import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "./loading-cat.json"; // Replace with your Lottie animation file

function Loading({ message = "Loading..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center h-full w-full bg-white dark:bg-gray-800 overflow-hidden relative"
    >
      {/* Floating Lottie Animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }} // Gentle floating effect
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-32 h-32 sm:w-48 sm:h-48" // Responsive sizing
      >
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
      </motion.div>

      {/* Wave Effect for Text */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="font-medium text-xl sm:text-2xl mt-4 text-amber-500 dark:text-amber-400 flex space-x-1"
      >
        {message.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }} // Wave effect
            transition={{
              duration: 1.5,
              delay: index * 0.1, // Staggered delay
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Gradient Pulse Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }} // Subtle pulse effect
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-amber-100/50 via-transparent to-amber-100/50 dark:from-amber-900/10 dark:via-transparent dark:to-amber-900/10" />
      </motion.div>
    </motion.div>
  );
}

export default Loading;