import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, age, isAgent, serviceType } = await req.json();

    if (!email || !name || age === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, name, age" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        age: Number(age),
        isAgent: isAgent ?? false,
        ...(serviceType != null ? { serviceType } : {}),
      },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error("[register POST]", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
