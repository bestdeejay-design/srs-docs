import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await orderModel
      .find({ user: session.user.id })
      .populate("user assignedDeliveryBoy")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
