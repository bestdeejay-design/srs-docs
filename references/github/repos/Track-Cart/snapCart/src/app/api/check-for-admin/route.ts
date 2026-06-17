import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const admins = await User.find({ role: "admin" }).select("_id email name");

    if (admins.length > 0) {
      return NextResponse.json(
        { exists: true, admins },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { exists: false, message: "No admin user found" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Check Admin Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
