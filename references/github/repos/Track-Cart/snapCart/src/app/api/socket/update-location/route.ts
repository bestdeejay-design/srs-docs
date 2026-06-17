import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { userId, location } = await req.json();

    if (!userId || !location) {
      return NextResponse.json(
        { message: "missing userId and location" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(userId, { location }, { new: true });

    if (!user) {
      return NextResponse.json(
        { message: "user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "location updated successfully", user },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "server error" },
      { status: 500 }
    );
  }
}
