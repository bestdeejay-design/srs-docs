import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    const userId = session?.user?.id;
    const sessionEmail = session?.user?.email;

    if (!userId) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    await connectDb();

    let user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user && typeof sessionEmail === "string" && sessionEmail.length > 0) {
      user = await User.findOne({ email: sessionEmail })
        .select("-password")
        .lean();
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid session user, please login again" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Get me error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
