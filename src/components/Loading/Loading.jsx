import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "./funny-animation.json"; // Replace with your Lottie animation file

function Loading({ message = "Loading..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center items-center h-full text-gray-900 dark:text-white text-lg space-y-4"
    >
      {/* Lottie Animation */}
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-50 h-50"
      />

      {/* Loading Message */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-medium text-xl sm:text-2xl mt-2 text-amber-500"
      >
        {message}
      </motion.h1>
    </motion.div>
  );
}

export default Loading;