import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import DeliveryAssignment from "@/models/deliveryAssignment";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDb();

    const { id } = await context.params;

    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment || assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "Assignment not found or not available" },
        { status: 404 }
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "You already have an active assignment" },
        { status: 400 }
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await orderModel.findById(assignment.order);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();

    await DeliveryAssignment.updateMany(
      { _id: { $ne: assignment._id }, broadcastedTo: deliveryBoyId },
      { $pull: { broadcastedTo: deliveryBoyId } }
    );

    return NextResponse.json(
      { message: "Assignment accepted successfully", assignment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Accept Assignment Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
