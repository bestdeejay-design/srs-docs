"use client";
import { Eye, EyeOff, Leaf, Loader2, Lock, LogIn, Mail } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import googleImage from "@/assesst/google.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect only once when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.error) {
        router.replace("/");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
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
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Welcome Back
        </motion.h1>
        <p className="text-gray-700 text-lg font-medium flex items-center justify-center gap-2">
          Login to <span className="text-green-600 font-bold">snapCart</span>
          <Leaf className="w-5 h-5 text-green-600" />
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleLogin}
        className="mt-3 flex flex-col gap-5 w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10"
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Email */}
        <motion.div
          className="relative"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Mail className="absolute left-4 top-4 w-5 h-5 text-green-600" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border-2 border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 backdrop-blur"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        {/* Password */}
        <motion.div
          className="relative"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Lock className="absolute left-4 top-4 w-5 h-5 text-green-600" />
          <input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border-2 border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white/50 backdrop-blur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        </motion.div>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <motion.button
          disabled={!email || !password || loading}
          whileHover={{ scale: email && password ? 1.02 : 1 }}
          whileTap={{ scale: email && password ? 0.98 : 1 }}
          className={`w-full font-bold py-4 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg
            ${
              email && password
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/50"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </motion.button>

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200" />
          OR
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        <motion.button
          type="button"
          onClick={() => signIn("google")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3.5 rounded-2xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-md font-semibold"
        >
          <Image src={googleImage} width={22} height={22} alt="google" />
          Continue with Google
        </motion.button>

        <p className="text-gray-600 mt-6 text-sm flex items-center justify-center gap-1">
          Want to create an account?
          <LogIn className="w-4 h-4" />
          <span
            className="text-green-500 font-bold cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Sign Up
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
