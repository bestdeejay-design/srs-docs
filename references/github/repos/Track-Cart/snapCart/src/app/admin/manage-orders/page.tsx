"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { getsocket } from "@/lib/socket";
import { div } from "motion/react-m";
import mongoose from "mongoose";
import { IUser } from "@/models/user.model";

interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  items: {
    grocery: mongoose.Types.ObjectId;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
  }[];

  isPaid: boolean
  totalAmount: number;
  paymentMethod: "cod" | "online";

  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: mongoose.Types.ObjectId
  assignedDeliveryBoy?: IUser
  status: "pending" | "out_for_delivery" | "delivered";

  createdAt?: Date;
  updatedAt?: Date;
}

const statusColors: any = {
  pending: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data.data || result.data);
        console.log(orders);
        
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      await axios.post(`/api/admin/update-order-status/${orderId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const socket = getsocket();
    const handler = (order: IOrder) => {
      setOrders((prev) => [order, ...prev]);
    };

    socket?.on("new-order", handler);

    return () => {
      socket?.off("new-order", handler);
    };
  }, []);
console.log(orders);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8"
    >
      <motion.div variants={itemAnim} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition">
          <ClipboardList className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
          Manage Orders
        </h1>
      </motion.div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            variants={itemAnim}
            whileHover={{ scale: 1.01, y: -4 }}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 p-6 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                  <Package size={20} />
                  Order #{order._id.slice(-6)}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-md">
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="text-sm space-y-2 mt-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <User size={14} /> {order.address.fullName}
                  </p>
                  <a 
                    href={`tel:${order.address.mobile}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                  >
                    <Phone size={14} /> {order.address.mobile}
                  </a>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.pincode}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard size={14} />
                    {order.paymentMethod === "online"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </p>
                  
                  {order.assignedDeliveryBoy && (
                    <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <p className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                        <Truck size={16} />
                        Delivery Boy Assigned
                      </p>
                      <div className="ml-6 space-y-1">
                        <p className="flex items-center gap-2 text-sm text-blue-600">
                          <User size={14} />
                          {(order.assignedDeliveryBoy as any)?.name || 
                           (order.assignedDeliveryBoy as any)?.email ||
                           "N/A"}
                        </p>
                        {(order.assignedDeliveryBoy as any)?.mobile && (
                          <a 
                            href={`tel:${(order.assignedDeliveryBoy as any)?.mobile}`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                          >
                            <Phone size={14} />
                            {(order.assignedDeliveryBoy as any)?.mobile}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize shadow-md
                    ${
                      order.status === "pending"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                        : order.status === "out_for_delivery"
                        ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white"
                        : order.status === "delivered"
                        ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                        : "bg-gradient-to-r from-red-400 to-pink-400 text-white"
                    }
                  `}
                >
                  {order.status.replaceAll("_", " ")}
                </span>

                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    handleStatusChange(order._id.toString(), e.target.value)
                  }
                  className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 bg-white transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-sm text-gray-600 mb-3 font-semibold">
                {order.items?.length || 0} Items
              </p>

              <div className="space-y-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price}/{item.unit} × {item.quantity || 1}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No items found</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 border-t pt-4">
              <p className="flex items-center gap-2 text-sm text-gray-500 capitalize">
                <Truck size={14} /> {order.status.replaceAll("_", " ")}
              </p>
              <p className="text-lg font-semibold text-green-600">
                Total: ₹{order.totalAmount}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManageOrders;
