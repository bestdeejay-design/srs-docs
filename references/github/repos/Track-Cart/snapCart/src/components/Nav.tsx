"use client";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Nav = ({ user }: { user: IUser }) => {
  const { cartData } = useSelector((state: RootState) => state.cart);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sideBar =
    menuOpen && user.role === "admin"
      ? createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 120 }}
                onClick={(e) => e.stopPropagation()}
                className="
                  fixed left-0 top-0 h-full w-[80%] max-w-xs
                  bg-gradient-to-b from-green-500 to-emerald-600
                  shadow-2xl p-6 text-white flex flex-col gap-4
                "
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Admin Panel</h2>
                  <button onClick={() => setMenuOpen(false)}>
                    <X />
                  </button>
                </div>

                <Link
                  href={"/admin/add-grocery"}
                  className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30"
                >
                  Add Grocery
                </Link>
                <Link
                  href="/admin/view-grocery"
                  className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30"
                >
                  View Grocery
                </Link>
                <Link
                  href="/admin/orders"
                  className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30"
                >
                  Manage Orders
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <div
        className="
          w-[95%] fixed top-4 left-1/2 -translate-x-1/2 z-50
          rounded-2xl bg-gradient-to-r from-green-500 via-emerald-400 to-green-600
          backdrop-blur-lg shadow-xl shadow-green-300/40 border border-white/20
          px-4 py-3 h-20 md:px-8 flex items-center justify-between
        "
      >
        <Link
          href="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:opacity-80"
        >
          Snapcart
        </Link>

        {/* Desktop Search */}
        {user.role == "user" && (
          <form className="hidden md:flex items-center bg-white/90 rounded-full px-4 py-2 shadow-sm w-[380px] focus-within:ring-2 focus-within:ring-green-400">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search groceries..."
              className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </form>
        )}
        {/* Mobile Search Icon */}

        <div className="flex items-center gap-3 md:gap-6 relative">
          {user.role == "user" && (
            <>
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/user/cart"
                className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartData?.length}
                </span>
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <div className="flex hidden flex-col md:flex-row gap-3 mt-4">
              <Link
                href={"/admin/add-grocery"}
                className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium backdrop-blur shadow transition"
              >
                Add Grocery
              </Link>

              <Link
                href="/admin/view-grocery"
                className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium backdrop-blur shadow transition"
              >
                View Grocery
              </Link>

              <Link
                href="/admin/orders"
                className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium backdrop-blur shadow transition"
              >
                Manage Orders
              </Link>
            </div>
          )}
          {user.role === "admin" && (
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <Menu />
            </button>
          )}
          {user.role === "admin" && (
            <div className="hidden md:flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-3">
              <Link
                href="/admin/add-grocery"
                className="
        px-5 py-2
        rounded-xl
        bg-white/20 hover:bg-white/30
        text-white text-sm font-semibold
        backdrop-blur
        shadow-md
        border border-white/20
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
      "
              >
                Add Grocery
              </Link>

              <Link
                href="/admin/view-grocery"
                className="
        px-5 py-2
        rounded-xl
        bg-white/20 hover:bg-white/30
        text-white text-sm font-semibold
        backdrop-blur
        shadow-md
        border border-white/20
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
      "
              >
                View Grocery
              </Link>

              <Link
                href="/admin/orders"
                className="
        px-5 py-2
        rounded-xl
        bg-white/20 hover:bg-white/30
        text-white text-sm font-semibold
        backdrop-blur
        shadow-md
        border border-white/20
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
      "
              >
                Manage Orders
              </Link>
            </div>
          )}

          <div className="relative" ref={profileDropDown}>
            <div
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 flex items-center justify-center shadow-md cursor-pointer hover:bg-white/30"
              onClick={() => setOpen(!open)}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-52 rounded-xl bg-white/90 shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    {user.role == "user" && (
                      <Link
                        href={"/user/my-order"}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <ShoppingBag className="w-4 h-4" /> Orders
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            onClick={() => setSearchOpen(false)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24"
          >
            <div
              ref={searchRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl px-4 py-3 w-[90%] max-w-md shadow-xl flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search groceries..."
                className="flex-1 outline-none text-sm text-gray-700"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {sideBar}
    </>
  );
};

export default Nav;
