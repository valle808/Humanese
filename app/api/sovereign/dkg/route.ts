import { NextResponse } from "next/server";
import { dkgClient } from "@/lib/dkg";

export async function POST(req: Request) {
    try {
        const { topic, summary } = await req.json();
        const result = await dkgClient.publishKnowledge(topic, summary);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
