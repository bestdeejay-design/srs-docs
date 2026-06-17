import connectDb from "@/lib/DB";
import orderModel from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    // Validation
    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (paymentMethod !== "online") {
      return NextResponse.json(
        { message: "Only online payments allowed" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create pending order
    const order = await orderModel.create({
      user: userId,
      items,
      totalAmount,
      paymentMethod,
      address,
     
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_BASE_URL}/user/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.NEXT_BASE_URL}/user/order-cancel?orderId=${order._id}`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "SnapCart Order Payment",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
