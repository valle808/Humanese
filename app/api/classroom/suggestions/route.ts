import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const suggestions = await prisma.projectSuggestion.findMany({
      include: {
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(suggestions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, suggestedBy } = await req.json();
    if (!name || !suggestedBy) {
      return NextResponse.json({ error: "Name and suggestedBy are required" }, { status: 400 });
    }

    const newSuggestion = await prisma.projectSuggestion.create({
      data: {
        name,
        suggestedBy,
      },
      include: {
        votes: true,
      },
    });

    return NextResponse.json(newSuggestion);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
  }
}
