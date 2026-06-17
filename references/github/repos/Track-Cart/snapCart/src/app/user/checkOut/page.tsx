"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Home,
  Building,
  Navigation,
  Search,
  LocateFixed,
  Loader2,
  CreditCard,
  Wallet,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Page = () => {
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online"
  );

  const [searchquery, setSearchQuery] = useState("");

  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, cartData, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart
  );
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searching, setSearching] = useState(false);

  const router = useRouter();
  const mapRef = useRef<any>(null);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
      );
      const data = await res.json();

      console.log("Reverse geocode response:", data); // Debug log

      // Try multiple fields for city in order of preference
      const city = 
        data.address.city || 
        data.address.town || 
        data.address.village || 
        data.address.municipality || 
        data.address.county ||
        data.address.state_district ||
        "";

      setAddress((prev) => ({
        ...prev,
        city: city,
        state: data.address.state || data.address.region || "",
        pincode: data.address.postcode || "",
        fullAddress: data.display_name || "",
      }));
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition([lat, lon]);
        mapRef.current?.flyTo([lat, lon], 14);
        await reverseGeocode(lat, lon);
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false)
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleSearch = async () => {
    if (!searchquery) return;
    setSearching(true);

    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: searchquery });

    if (result?.length) {
      const lat = result[0].y;
      const lon = result[0].x;

      setPosition([lat, lon]);
      mapRef.current?.flyTo([lat, lon], 14);
      await reverseGeocode(lat, lon);
    }

    setSearching(false);
  };

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  const handleCod = async () => {
    try {
      if (!userData?._id) return;

      const payload = {
        userId: userData._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        paymentMethod: "cod",
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position?.[0],
          longitude: position?.[1],
        },
      };

      const result = await axios.post("/api/user/order", payload);

      console.log("Order placed:", result.data);
      router.push("/user/order-success");
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const handleOnlinePayment = async () => {
  try {
    if (!userData?._id) return;

    const payload = {
      userId: userData._id,
      items: cartData.map((item) => ({
        grocery: item._id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        quantity: item.quantity,
      })),
      paymentMethod: "online", // ✅ FIXED
      totalAmount: finalTotal,
      address: {
        fullName: address.fullName,
        mobile: address.mobile,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        fullAddress: address.fullAddress,
        latitude: position?.[0],
        longitude: position?.[1],
      },
    };

    const result = await axios.post("/api/user/payment", payload);

    if (result.data?.url) {
      window.location.href = result.data.url; // ✅ Stripe redirect
    } else {
      console.error("Stripe URL missing", result.data);
    }

  } catch (error) {
    console.error("Online payment failed:", error);
  }
};


  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT - ADDRESS kdkdkd*/}
        <div className="md:col-span-2">
          <motion.div
            onClick={() => router.back()}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 w-fit bg-white px-4 py-2 rounded-full shadow-md transition-all mb-6"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </motion.div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
              Checkout
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 mt-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <Home className="text-green-600" /> Delivery Address
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <User
                  className="absolute left-4 top-4 text-green-600"
                  size={18}
                />
                <input
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className="pl-12 w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-4 text-green-600"
                  size={18}
                />
                <input
                  value={address.mobile}
                  onChange={(e) =>
                    setAddress({ ...address, mobile: e.target.value })
                  }
                  className="pl-12 w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Mobile"
                />
              </div>

              <div className="relative">
                <Home
                  className="absolute left-4 top-4 text-green-600"
                  size={18}
                />
                <input
                  value={address.fullAddress}
                  onChange={(e) =>
                    setAddress({ ...address, fullAddress: e.target.value })
                  }
                  className="pl-12 w-full border-2 border-gray-200 rounded-2xl p-4 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Full Address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={address.city}
                  readOnly
                  className="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50"
                  placeholder="City"
                />
                <input
                  value={address.state}
                  readOnly
                  className="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50"
                  placeholder="State"
                />
                <input
                  value={address.pincode}
                  readOnly
                  className="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50"
                  placeholder="Pincode"
                />
              </div>

              <div className="flex gap-2">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city area..."
                  className="flex-1 border-2 border-gray-200 rounded-2xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all"
                />
                <motion.button
                  onClick={handleSearch}
                  disabled={searching}
                  whileHover={{ scale: searching ? 1 : 1.05 }}
                  whileTap={{ scale: searching ? 1 : 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 rounded-2xl flex items-center gap-2 disabled:opacity-60 font-bold shadow-lg transition-all"
                >
                  {searching && <Loader2 className="animate-spin" size={16} />}
                  Search
                </motion.button>
              </div>

              <div className="relative mt-6 h-[330px] rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100">
                {position && (
                  <>
                    <MapContainer
                      ref={mapRef}
                      center={position}
                      zoom={13}
                      className="w-full h-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={position} icon={markerIcon}>
                        <Popup>Your delivery location</Popup>
                      </Marker>
                    </MapContainer>

                    <motion.button
                      onClick={fetchCurrentLocation}
                      disabled={loadingLocation}
                      whileHover={{ scale: loadingLocation ? 1 : 1.1 }}
                      whileTap={{ scale: loadingLocation ? 1 : 0.9 }}
                      className="absolute bottom-4 right-4 z-[999] bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all"
                    >
                      {loadingLocation ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <LocateFixed />
                      )}
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard className="text-green-600" /> Payment Method
            </h2>

            <div className="space-y-4">
              {/* Pay Online */}
              <motion.button
                onClick={() => setPaymentMethod("online")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 w-full border-2 rounded-2xl p-4 transition-all shadow-md ${
                  paymentMethod === "online"
                    ? "border-green-600 bg-green-50 shadow-green-500/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <CreditCard className="text-green-600" />
                <span className="font-bold text-gray-700">
                  Pay Online (Stripe)
                </span>
              </motion.button>

              {/* Cash on Delivery */}
              <motion.button
                onClick={() => setPaymentMethod("cod")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 w-full border-2 rounded-2xl p-4 transition-all shadow-md ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50 shadow-green-500/20"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <Wallet className="text-green-600" />
                <span className="font-bold text-gray-700">
                  Cash on Delivery
                </span>
              </motion.button>
            </div>

            {/* Price summary */}
            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Action Button */}
            {paymentMethod === "cod" ? (
              <motion.button
                onClick={handleCod}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30"
              >
                Place Order (COD)
              </motion.button>
            ) : (
              <motion.button
                onClick={handleOnlinePayment}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30"
              >
                Pay Now
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
