"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Eye,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Total Orders",
      value: "156",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: "89",
      icon: Package,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Users",
      value: "342",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Revenue",
      value: "₹45,890",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const actions = [
    {
      title: "Add Grocery",
      description: "Add new products to inventory",
      icon: Plus,
      href: "/admin/add-grocery",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "View Grocery",
      description: "Browse all products",
      icon: Eye,
      href: "/admin/view-grocery",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Manage Orders",
      description: "Track and update orders",
      icon: ClipboardList,
      href: "/admin/manage-orders",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage your grocery store</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center`}
                  >
                    <Icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
                    {card.value}
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">{card.title}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                >
                  <Link href={action.href}>
                    <div className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 shadow-xl text-white cursor-pointer h-full`}>
                      <Icon className="w-12 h-12 mb-4" />
                      <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                      <p className="text-white/90 text-sm">{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;