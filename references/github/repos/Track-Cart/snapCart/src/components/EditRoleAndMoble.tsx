"use client";

import React, { useEffect, useState } from "react";
import { Bike, User, UserCog, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EditRoleAndMoble = () => {
  const { update } = useSession();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ]);

  useEffect(() => {
    const checkForAdmin = async () => {
      try {
        const result = await axios.get("/api/check-for-admin");
        if (result.data.exists === true) {
          // Remove admin role if already exists
          setRoles((prev) => prev.filter((r) => r.id !== "admin"));
        }
      } catch (error) {
        console.log("Admin check failed:", error);
      }
    };

    checkForAdmin();
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);

    if (value.length !== 10) {
      setError("Mobile number must be 10 digits");
    } else {
      setError("");
    }
  };

  const handleEdit = async () => {
    try {
      await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });

      await update({ role: selectedRole });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 p-6 relative overflow-hidden">
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

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 text-center mt-8 mb-4 relative z-10"
      >
        Select Your Role
      </motion.h1>
      <p className="text-center text-gray-600 text-lg mb-8 relative z-10">
        Choose how you want to use <span className="font-bold text-green-600">snapCart</span>
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isActive = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative cursor-pointer w-72 rounded-3xl border-3 p-8 shadow-xl transition-all
                ${
                  isActive
                    ? "border-green-600 bg-white shadow-2xl shadow-green-500/30"
                    : "border-gray-200 bg-white/80 backdrop-blur hover:border-green-400"
                }`}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <CheckCircle className="text-green-600 w-8 h-8" />
                </motion.div>
              )}

              <div
                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                <Icon size={40} />
              </div>

              <h2 className="text-center text-xl font-semibold text-gray-800">
                {role.label}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Continue as {role.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div className="mt-14 mx-auto w-full max-w-md relative z-10">
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Mobile Number
        </label>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
          <input
            type="text"
            maxLength={10}
            value={mobile}
            onChange={handleMobileChange}
            placeholder="Enter 10-digit mobile number"
            className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
      </motion.div>

      <div className="mt-10 flex justify-center relative z-10">
        <motion.button
          onClick={handleEdit}
          disabled={!selectedRole || mobile.length !== 10}
          whileHover={{ scale: selectedRole && mobile.length === 10 ? 1.05 : 1, y: -2 }}
          whileTap={{ scale: selectedRole && mobile.length === 10 ? 0.95 : 1 }}
          className={`rounded-2xl px-12 py-4 font-bold text-white transition-all shadow-lg
            ${
              selectedRole && mobile.length === 10
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default EditRoleAndMoble;
