import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { suggestionId, userId } = await req.json();

    if (!suggestionId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Toggle vote: check if already voted
    const existingVote = await prisma.suggestionVote.findUnique({
      where: {
        suggestionId_userId: {
          suggestionId,
          userId,
        },
      },
    });

    if (existingVote) {
      await prisma.suggestionVote.delete({
        where: { id: existingVote.id },
      });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      await prisma.suggestionVote.create({
        data: {
          suggestionId,
          userId,
        },
      });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle vote" }, { status: 500 });
  }
}
