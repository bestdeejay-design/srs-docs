"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getsocket } from "@/lib/socket";
import { motion } from "framer-motion";
import { Package, MapPin, Truck } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state);
  const [activeOrder,setActiveOrder] = useState<any>(null);
  const [userLocation,setUserLocation] = useState<any>(null)
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/delivery/get-assignments");
        console.log("Fetched assignments:", res.data.assignments);
        setAssignments(res.data.assignments || []);
      } catch (error) {
        console.error("Fetch assignments failed:", error);
      }
    };

    fetchAssignments();
  }, []);

  const handleAccept = async (assignmentId: string | undefined) => {
    if (!assignmentId) {
      alert("Invalid assignment ID");
      console.error("Assignment ID is undefined");
      return;
    }

    try {
      setAcceptingId(assignmentId);

      const res = await axios.get(`/api/delivery/assignment/${assignmentId}/accept-assignment`);
      console.log("Accept response:", res.data);
      
      // Remove accepted assignment from list
      setAssignments((prev) => prev.filter((a) => {
        const currentId = a._id || a.id;
        return currentId !== assignmentId;
      }));
      
      alert("Assignment accepted successfully!");
    } catch (error) {
      console.error("Accept failed:", error);
      alert("Failed to accept assignment. Please try again.");
    } finally {
      setAcceptingId(null);
    }
  };

  useEffect(() => {
    const socket = getsocket();

    const handler = (deliveryAssignment: any) => {
      console.log("New assignment received via socket:", deliveryAssignment);
      setAssignments((prev) => {
        const newId = deliveryAssignment._id || deliveryAssignment.id;
        const exists = prev.find((a) => {
          const existingId = a._id || a.id;
          return existingId === newId;
        });
        if (exists) return prev;
        return [deliveryAssignment, ...prev];
      });
    };

    socket.on("new-assignment", handler);

    return () => {
      socket.off("new-assignment", handler);
    };
  }, []);

  const fetchCurrentOrder = async () => {
    try {
      const res = await axios.get("/api/delivery/current-order");
      console.log("Current order:", res.data);
      if (res.data.activeAssignment) {
        setActiveOrder(res.data.activeAssignment);
      }
    } catch (error) {
      console.log("Error fetching current order:", error);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, [user]);


  if(activeOrder && userLocation){
    return (
      <div className="p-4 pt-[120px] min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Active Delivery</h1>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Order Number</p>
                <p className="text-xl font-bold text-gray-800">
                  #{activeOrder?.order?._id?.slice(-8) || activeOrder?.order?.id?.slice(-8) || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </p>
                <p className="text-base text-gray-800">
                  {activeOrder?.order?.address?.fullAddress || "Address not available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Your Location</p>
                  <p className="text-sm text-gray-700">
                    {userLocation?.latitude?.toFixed(6)}, {userLocation?.longitude?.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                  <p className="text-sm font-bold text-green-600">{activeOrder?.status || "Assigned"}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                Mark as Delivered
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mt-28 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
            Delivery Assignments
          </h2>
        </motion.div>

        <div className="space-y-4">
          {assignments.map((a) => {
            const assignmentId = a._id || a.id;
            console.log("Rendering assignment:", { id: assignmentId, data: a });
            
            return (
              <motion.div
                key={assignmentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      Order #{a?.order?._id?.slice(-6) || a?.order?.id?.slice(-6) || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {a?.order?.address?.fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <motion.button
                    onClick={() => {
                      console.log("Accept button clicked for ID:", assignmentId);
                      handleAccept(assignmentId);
                    }}
                    disabled={acceptingId === assignmentId}
                    whileHover={{ scale: acceptingId !== assignmentId ? 1.05 : 1 }}
                    whileTap={{ scale: acceptingId !== assignmentId ? 0.95 : 1 }}
                    className={`flex-1 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-lg ${
                      acceptingId === assignmentId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30"
                    }`}
                  >
                    {acceptingId === assignmentId ? "Accepting..." : "Accept"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/30"
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            );
          })}

          {!assignments?.length && (
            <p className="text-center text-gray-500 mt-10">
              No delivery assignments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
