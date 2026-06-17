"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Package, Loader2, User, Phone, Truck, Navigation } from "lucide-react";
import { getsocket } from "@/lib/socket";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  paymentMethod: string;
  address: { fullAddress: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  assignedDeliveryBoy?: any;
}

const MyOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-order");
        setOrders(res.data.orders);

        const map: Record<string, string> = {};
        res.data.orders.forEach((o: Order) => (map[o._id] = o.status));
        setStatusMap(map);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = getsocket();

    socket.on("order-status-update", (data: { orderId: string; status: string }) => {
      setStatusMap((prev) => ({
        ...prev,
        [data.orderId]: data.status,
      }));
    });

    return () => {
      socket.off("order-status-update");
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Package className="text-white w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
            My Orders
          </h1>
        </motion.div>

        {orders.map((order) => (
          <motion.div
            key={order._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpen(open === order._id ? null : order._id)}
              className="w-full p-5 flex justify-between items-start text-left"
            >
              <div className="space-y-2">
                <p className="text-sm text-green-700 font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2 flex-wrap">
                  <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
                    {statusMap[order._id] || order.status}
                  </span>
                  <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md">
                    {order.paymentMethod}
                  </span>
                </div>

                <p className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} /> {order.address.fullAddress}
                </p>
              </div>

              <motion.div animate={{ rotate: open === order._id ? 180 : 0 }}>
                <ChevronDown className="text-gray-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {open === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t px-5 py-4 bg-gray-50"
                >
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Current Status:{" "}
                    <span className="text-green-700">
                      {statusMap[order._id] || order.status}
                    </span>
                  </p>

                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-lg object-cover border"
                          alt={item.name}
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-gray-700">₹{item.price}</p>
                    </div>
                  ))}

                  {order.assignedDeliveryBoy && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <p className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                        <Truck size={16} />
                        Delivery Boy Assigned
                      </p>
                      <div className="ml-6 space-y-1">
                        <p className="flex items-center gap-2 text-sm text-blue-600">
                          <User size={14} />
                          {order.assignedDeliveryBoy?.name || 
                           order.assignedDeliveryBoy?.email ||
                           "N/A"}
                        </p>
                        {order.assignedDeliveryBoy?.mobile && (
                          <a 
                            href={`tel:${order.assignedDeliveryBoy?.mobile}`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                          >
                            <Phone size={14} />
                            {order.assignedDeliveryBoy?.mobile}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {(statusMap[order._id] === "out_for_delivery" || order.status === "out_for_delivery") && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transition-all"
                      onClick={() => {
                        // Handle track order - could open a map modal or navigate to tracking page
                        alert(`Tracking order #${order._id.slice(-6)}`);
                      }}
                    >
                      <Navigation size={18} />
                      Track Order
                    </motion.button>
                  )}

                  <div className="flex justify-between border-t pt-3 mt-3 font-semibold text-sm">
                    <span>Total</span>
                    <span className="text-green-700">₹{order.totalAmount}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;
