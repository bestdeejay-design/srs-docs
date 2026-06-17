import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleAndMoble from "@/components/EditRoleAndMoble";
import GeoUpdater from "@/components/Geoupdater";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import React from "react";
import { redirect } from "next/navigation";

const Home = async () => {
  await connectDb();
  const session = await auth();

  const userId = session?.user?.id;
  const sessionEmail = session?.user?.email;

  if (!userId) {
    redirect("/login");
  }

  let user = await User.findById(userId);

  if (!user && typeof sessionEmail === "string" && sessionEmail.length > 0) {
    user = await User.findOne({ email: sessionEmail });
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  if (!user) {
    redirect("/login");
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");

  if (inComplete) {
    return <EditRoleAndMoble />;
  }

  return (
    <>
      <Nav user={plainUser} />
      <GeoUpdater userId={plainUser._id} />

      {plainUser.role === "user" ? (
        <UserDashboard />
      ) : plainUser.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
};

export default Home;
