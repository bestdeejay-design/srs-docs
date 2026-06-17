import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import emitEventHandler from "@/lib/emitEventHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, paymentMethod, totalAmount, address } = await req.json();

    // Basic validation
    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "cod") {
      return NextResponse.json(
        { message: "Only COD orders allowed on this route" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      address,
      status: "pending",
    });
    await emitEventHandler("new-order",order)
    return NextResponse.json(
      {
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
