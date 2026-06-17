import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let proposal = await prisma.projectProposal.findFirst();

    if (!proposal) {
      proposal = await prisma.projectProposal.create({
        data: {
          title: "Propuesta de Solución de IA",
          content: "Escribe aquí la propuesta inicial...",
          status: "DRAFT",
          updatedBy: "System",
        },
      });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, content, updatedBy } = await req.json();
    
    if (!id || !content || !updatedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedProposal = await prisma.projectProposal.update({
      where: { id },
      data: {
        content,
        updatedBy,
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 });
  }
}
