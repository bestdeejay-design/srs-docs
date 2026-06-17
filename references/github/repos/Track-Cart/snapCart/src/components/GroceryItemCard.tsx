"use client";

import mongoose from "mongoose";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addToCart, incrementQuantity, decrementQuantity } from "@/redux/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface IGrocery {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItem = useSelector((state: RootState) =>
    state.cart.cartData.find((i) => i._id === item._id)
  );

  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100 group"
    >
      {/* Image with scale only */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 overflow-hidden"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Grocery item"}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-green-600 transition">
          {item.name}
        </h3>

        <p className="text-xs text-gray-500 capitalize mt-1 font-medium">{item.category}</p>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
            ₹{item.price}
            <span className="text-xs text-gray-500 font-normal"> / {item.unit}</span>
          </p>

          {quantity === 0 ? (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-500/30"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1.5 shadow-lg">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => dispatch(decrementQuantity(item._id as string))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-green-600 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>

              <span className="text-sm font-bold text-white min-w-[24px] text-center">{quantity}</span>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => dispatch(incrementQuantity(item._id as string))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-green-600 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
