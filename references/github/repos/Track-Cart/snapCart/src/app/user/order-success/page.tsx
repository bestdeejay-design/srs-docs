"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const floating = {
  animate: {
    y: [0, -12, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0, 0.4],
  },
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeOut",
  },
};

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Floating blobs */}
      <motion.div
        {...floating}
        className="absolute w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-30 -top-10 -left-10"
      />
      <motion.div
        {...floating}
        transition={{ ...floating.transition, delay: 1 }}
        className="absolute w-80 h-80 bg-emerald-300 rounded-full blur-3xl opacity-20 top-1/2 -right-10"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center z-10 border border-white/50"
      >
        {/* Check Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <CheckCircle className="text-white w-16 h-16" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
          Order Placed Successfully! 🎉
        </h1>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Thank you for your order! Your groceries will be delivered soon.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/my-order")}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-green-500/30"
          >
            View My Orders
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="w-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 py-4 rounded-2xl transition font-semibold text-gray-700"
          >
            Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
