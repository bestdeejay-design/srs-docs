"use client";
import {
  ArrowLeft,
  ImagePlus,
  IndianRupee,
  Package,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const categories = [
  "fruits & vegetables",
  "dairy & bakery",
  "meat & seafood",
  "beverages",
  "snacks",
  "household",
  "personal care",
];

const units = ["kg", "gm", "piece", "litre", "pack"];

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    unit: "",
    image: null as File | null,
    preview: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (file: File | null) => {
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.category || !form.unit || !form.image) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append("unit", form.unit);
      data.append("image", form.image);

      await axios.post("/api/admin/add-grocery", data);

      setForm({
        name: "",
        price: "",
        category: "",
        unit: "",
        image: null,
        preview: "",
      });

      alert("Grocery added successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16 px-4 relative overflow-hidden">
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

      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow-lg z-20 transition-all hover:scale-105"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:inline text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-white/50 relative z-10"
      >
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6 text-center">
          Add Grocery Item
        </h1>

        {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-bold text-gray-700">Product Name</label>
            <div className="mt-1 flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 transition-all">
              <Package className="w-4 h-4 text-green-600" />
              <input
                type="text"
                className="flex-1 outline-none text-sm bg-transparent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-bold text-gray-700">Price</label>
            <div className="mt-1 flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 transition-all">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <input
                type="number"
                className="flex-1 outline-none text-sm"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-200 my-4" />

          {/* Category + Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1 flex items-center gap-2 border rounded-xl px-4 py-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <select
                  className="flex-1 outline-none text-sm bg-transparent"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <div className="mt-1 flex items-center gap-2 border rounded-xl px-4 py-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <select
                  className="flex-1 outline-none text-sm bg-transparent"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="">Select unit</option>
                  {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium text-gray-700">Product Image</label>
            {!form.preview ? (
              <label className="mt-1 flex items-center gap-2 border-dashed border-2 rounded-xl px-4 py-3 cursor-pointer text-sm text-gray-500 hover:border-green-400">
                <ImagePlus className="w-5 h-5" />
                Upload Image
                <input type="file" hidden onChange={(e) => handleImage(e.target.files?.[0] || null)} />
              </label>
            ) : (
              <div className="relative mt-2">
                <img src={form.preview} className="w-full h-48 object-cover rounded-xl border" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: null, preview: "" })}
                  className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-green-500/30 transition-all"
          >
            {loading ? "Adding..." : "Add Grocery"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Page;
