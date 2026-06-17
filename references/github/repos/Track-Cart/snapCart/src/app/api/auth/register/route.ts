import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existUser = await User.findOne({ email: normalizedEmail });
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return NextResponse.json(
      { message: "User registered successfully", user: safeUser },
      { status: 201 }
    );

  } catch (error: any) {
    // Handle duplicate key race condition
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      );
    }

    console.error("Register error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
