"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, Truck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getsocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

export const slides = [
  {
    id: 1,
    icon: ShoppingBag,
    title: "Fresh Groceries Delivered",
    subtitle: "Order farm-fresh fruits, vegetables and daily essentials from local stores in minutes.",
    btnText: "Shop Now",
    bg: "https://plus.unsplash.com/premium_photo-1664551734602-49640bd82eba?w=1000&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    icon: Truck,
    title: "Fast & Reliable Delivery",
    subtitle: "Get your groceries delivered to your doorstep within 30 minutes.",
    btnText: "Track Order",
    bg: "https://images.unsplash.com/photo-1695654390723-479197a8c4a3?w=1000&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    icon: Leaf,
    title: "100% Fresh & Organic",
    subtitle: "We partner with trusted farmers to bring you healthy, organic food every day.",
    btnText: "Explore Organic",
    bg: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1000&auto=format&fit=crop&q=60",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
const { userData } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.icon;

 
  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-3xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-8"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-2xl border-2 border-white/30">
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl font-black mb-6 leading-tight"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-100 mb-8 leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              <motion.button
                initial={{ y: 30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-2xl shadow-green-500/50 transition-all text-lg"
              >
                {slide.btnText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-white w-10" : "bg-white/50 w-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
