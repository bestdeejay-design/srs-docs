"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";
type propType = {
  nextStep: (s: number) => void;
};
const Welcome = ({ nextStep }: propType) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 right-20 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-300 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        className="flex items-center gap-3 mb-4 relative z-10"
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShoppingBasket className="w-14 h-14 text-green-600 drop-shadow-lg" />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          snapCart
        </h1>
      </motion.div>
      <motion.p
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed px-4 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Your one-stop destination for <span className="font-bold text-green-600">fresh groceries</span>, organic produce, and
        daily essentials delivered right to your doorstep. 🛒✨
      </motion.p>
      <motion.div
        className="flex items-center justify-center gap-10 mt-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-green-600 drop-shadow-md" />
        <Bike className="w-24 h-24 md:w-32 md:h-32 text-orange-600 drop-shadow-md" />
      </motion.div>
      <motion.button
        onClick={() => nextStep(2)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl shadow-green-500/50 transition-all duration-200 mt-10 relative z-10"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default Welcome;
