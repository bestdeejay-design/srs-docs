import connectDb from "@/lib/DB";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment";
import orderModel from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDb();

    const { orderId } = await context.params;
    const { status } = await req.json();

    if (!orderId) {
      return NextResponse.json({ message: "OrderId is required" }, { status: 400 });
    }

    const order = await orderModel.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    order.status = status;

    let availableDeliveryBoys: any[] = [];
    let deliveryAssignment: any = null;

    if (status === "out_for_delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (!candidates.length) {
        await order.save();

        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})
        return NextResponse.json(
          { message: "No available delivery boy nearby" },
          { status: 200 }
        );
      }

      deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      await deliveryAssignment.populate("order")

       for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy?.socketId) {
          await emitEventHandler("new-assignment", {
            assignmentId: deliveryAssignment._id,
            order: deliveryAssignment.order,
          });
        }
      }

      order.assignment = deliveryAssignment._id;
    }

    const deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
      id: b._id,
      name: b.name,
      mobile: b.mobile,
      latitude: b.location.coordinates[1],
      longitude: b.location.coordinates[0],
    }));

    if (deliveryAssignment) {
      await deliveryAssignment.populate("order");
    }

    await order.save();
    await order.populate("user");
        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})

    return NextResponse.json(
      {
        message: "Order updated successfully",
        order,
        assignment: deliveryAssignment,
        availableDeliveryBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Order Status Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
