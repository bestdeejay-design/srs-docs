"use client";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import googleImage from "@/assesst/google.png";
import Image from "next/image";

import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type propType = {
  nextStep: (s: number) => void;
};

const RegisterFrom = ({ nextStep }: propType) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) return;

    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formValidation = name && email && password;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-green-300 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"
      />

      <motion.div
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition cursor-pointer z-20 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-lg"
        onClick={() => nextStep(1)}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft />
        <span className="font-medium">Back</span>
      </motion.div>

      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Create Account
        </motion.h1>

        <p className="text-gray-700 text-lg font-medium flex items-center justify-center gap-2">
          Join <span className="text-green-600 font-bold">snapCart</span> today
          <Leaf className="w-5 h-5 text-green-600" />
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-5 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10"
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Name */}
        <div className="relative">
          <User className="absolute left-4 top-4 w-5 h-5 text-green-600" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border-2 border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 backdrop-blur"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-4 w-5 h-5 text-green-600" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border-2 border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 backdrop-blur"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-4 w-5 h-5 text-green-600" />
          <input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border-2 border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 backdrop-blur"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {show ? (
            <EyeOff
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 w-5 h-5 cursor-pointer text-gray-500 hover:text-green-600 transition"
            />
          ) : (
            <Eye
              onClick={() => setShow(true)}
              className="absolute right-4 top-4 w-5 h-5 cursor-pointer text-gray-500 hover:text-green-600 transition"
            />
          )}
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Button */}
        <motion.button
          disabled={!formValidation || loading}
          whileHover={{ scale: formValidation ? 1.02 : 1 }}
          whileTap={{ scale: formValidation ? 0.98 : 1 }}
          className={`w-full font-bold py-4 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg ${formValidation
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/50"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200" />
          OR
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In */}
        <motion.button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3.5 rounded-2xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-md font-semibold"
        >
          <Image src={googleImage} width={22} height={22} alt="google" />
          Continue with Google
        </motion.button>

        {/* Login Redirect */}
        <p className="text-gray-600 mt-6 text-sm flex items-center justify-center gap-1">
          Already have an account? <LogIn className="w-4 h-4" />
          <span
            className="text-green-500 font-bold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Sign in
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterFrom;
