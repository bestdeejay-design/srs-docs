import React from "react";
import HeroSection from "./HeroSection";
import CategorySlider from "./CategorySlider";
import connectDb from "@/lib/DB";
import Grocery from "@/models/grocery.model";
import GroceryItemCard from "./GroceryItemCard";

const UserDashboard = async () => {
  await connectDb();

  const groceries = await Grocery.find({});
  const plainGroceries = JSON.parse(JSON.stringify(groceries));

  return (
    <>
      <HeroSection />
      <CategorySlider />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {plainGroceries.map((item: any) => (
          <GroceryItemCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
};

export default UserDashboard;
