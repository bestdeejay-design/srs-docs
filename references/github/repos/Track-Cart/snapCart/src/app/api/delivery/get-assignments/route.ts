import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import DeliveryAssignment from "@/models/deliveryAssignment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: session.user.id,
      status: "broadcasted",
    })
      .populate("order")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { assignments },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Assignments Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
