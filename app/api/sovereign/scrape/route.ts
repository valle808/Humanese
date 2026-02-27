import { NextResponse } from "next/server";
import { scrapeAndStore } from "@/lib/scraper";

export async function POST(req: Request) {
    try {
        const { topic, url } = await req.json();
        const result = await scrapeAndStore(topic, url);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
