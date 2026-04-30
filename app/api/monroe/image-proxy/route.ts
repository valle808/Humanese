import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

export async function GET(req: NextRequest) {
    const prompt = req.nextUrl.searchParams.get('prompt');
    const seed   = req.nextUrl.searchParams.get('seed') || '42';

    if (!prompt) {
        return new NextResponse('Missing prompt', { status: 400 });
    }

    try {
        const pollinationsUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
            `?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        const upstream = await fetch(pollinationsUrl, {
            headers: { 'User-Agent': 'Monroe-OMEGA/7.0' },
        });

        if (!upstream.ok) {
            return new NextResponse(`Upstream error ${upstream.status}`, { status: 502 });
        }

        const imageBuffer = await upstream.arrayBuffer();
        const contentType = upstream.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('[image-proxy] Error:', err.message);
        return new NextResponse('Image generation failed', { status: 500 });
    }
}
