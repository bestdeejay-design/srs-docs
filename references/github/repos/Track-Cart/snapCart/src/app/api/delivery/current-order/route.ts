import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import DeliveryAssignment from "@/models/deliveryAssignment";
import orderModel from "@/models/order.model";

export async function GET() {
    try {
        await connectDb();
        const session = await auth();
        const deliveryBoy = session?.user?.id;
        
        if (!deliveryBoy) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const activeAssignment = await DeliveryAssignment.findOne({
            assignedTo: deliveryBoy,
            status: "assigned"
        }).populate({
            path: "order",
            populate: { path: "address" }
        }).lean();
        
        return Response.json({ activeAssignment }, { status: 200 });
    } catch (error) {
        console.error("Error fetching current order:", error);
        return Response.json(
            { error: "Failed to fetch current order" },
            { status: 500 }
        );
    }
}