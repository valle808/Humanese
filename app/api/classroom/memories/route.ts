import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const memories = await prisma.monroeMemory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(memories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, authorName } = await req.json();
    if (!content || !authorName) {
      return NextResponse.json({ error: "Content and authorName are required" }, { status: 400 });
    }

    const newMemory = await prisma.monroeMemory.create({
      data: {
        content,
        authorName,
      },
    });

    return NextResponse.json(newMemory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save memory" }, { status: 500 });
  }
}
