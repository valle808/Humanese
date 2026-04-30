import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Shared file builder logic
async function buildFile(filename: string, content: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const lower = filename.toLowerCase();

    if (lower.endsWith('.pdf')) {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(content, 175);
        let y = 20;
        const pageHeight = doc.internal.pageSize.getHeight();
        for (const line of lines) {
            if (y > pageHeight - 20) { doc.addPage(); y = 20; }
            doc.text(line, 15, y);
            y += 7;
        }
        return { buffer: Buffer.from(doc.output('arraybuffer')), mimeType: 'application/pdf' };
    }

    if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
        const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs24 ${content.replace(/\n/g, '\\par\n')}}`;
        return { buffer: Buffer.from(rtf, 'utf-8'), mimeType: 'application/msword' };
    }

    if (lower.endsWith('.zip')) {
        const archive = `=== MONROE OMEGA ARCHIVE ===\nFile: ${filename}\nGenerated: ${new Date().toISOString()}\n${'='.repeat(50)}\n\n${content}`;
        return { buffer: Buffer.from(archive, 'utf-8'), mimeType: 'application/zip' };
    }

    const mimeMap: Record<string, string> = {
        '.csv': 'text/csv',
        '.json': 'application/json',
        '.html': 'text/html',
        '.md': 'text/markdown',
        '.xlsx': 'text/csv',
        '.xls': 'text/csv',
        '.py': 'text/plain',
        '.js': 'text/plain',
        '.ts': 'text/plain',
        '.sh': 'text/plain',
        '.txt': 'text/plain',
    };
    const ext = Object.keys(mimeMap).find(e => lower.endsWith(e));
    return { buffer: Buffer.from(content, 'utf-8'), mimeType: ext ? mimeMap[ext] : 'text/plain' };
}

// GET handler — used by download anchor hrefs
export async function GET(req: NextRequest) {
    const filename = req.nextUrl.searchParams.get('filename') || 'file.txt';
    const b64 = req.nextUrl.searchParams.get('b64');
    const rawContent = req.nextUrl.searchParams.get('content');

    let content = '';
    if (b64) {
        content = Buffer.from(decodeURIComponent(b64), 'base64').toString('utf-8');
    } else if (rawContent) {
        content = decodeURIComponent(rawContent);
    }

    try {
        const { buffer, mimeType } = await buildFile(filename, content);
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err: any) {
        console.error('[file-generator GET] Error:', err.message);
        return new NextResponse(`File generation failed: ${err.message}`, { status: 500 });
    }
}

// POST handler — for programmatic use or HTML form submissions
export async function POST(req: NextRequest) {
    try {
        let filename = '';
        let content: string | undefined = undefined;

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            filename = body.filename;
            content = body.content;
        } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            filename = formData.get('filename') as string;
            content = formData.get('content') as string;
        }

        if (!filename || content === undefined) {
            return new NextResponse('Missing params', { status: 400 });
        }
        const { buffer, mimeType } = await buildFile(filename, content);
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('[file-generator POST] Error:', err.message);
        return new NextResponse(`File generation failed: ${err.message}`, { status: 500 });
    }
}
