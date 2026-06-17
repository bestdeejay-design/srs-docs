"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 100 },
};

const CartPage = () => {
  const router = useRouter();
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
      {/* LEFT — Items */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="md:col-span-2 space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Your Cart</h2>
        </div>

        {cartData.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500"
          >
            Your cart is empty.
          </motion.p>
        )}

        <AnimatePresence>
          {cartData.map((item) => (
            <motion.div
              key={item._id}
              variants={itemAnim}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {item.category}
                </p>
                <p className="text-green-600 font-semibold">
                  ₹{item.price} / {item.unit}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => dispatch(decrementQuantity(item._id))}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center shadow-md"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>

                <span className="min-w-[32px] text-center font-bold text-lg">
                  {item.quantity}
                </span>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => dispatch(incrementQuantity(item._id))}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center justify-center shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(removeFromCart(item._id))}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* RIGHT — Summary */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit space-y-4 sticky top-24"
      >
        <h2 className="text-2xl font-black text-gray-800">Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{deliveryFee}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-green-500/30"
          onClick={() => router.push("/user/checkOut")}
        >
          Proceed to Checkout
        </motion.button>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default CartPage;
