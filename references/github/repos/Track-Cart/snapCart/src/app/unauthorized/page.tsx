"use client";
import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-red-300 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-white/50 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/50"
        >
          <ShieldAlert className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          You do not have permission to access this page. This area is restricted to authorized users only.
        </p>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/30 transition-all"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
