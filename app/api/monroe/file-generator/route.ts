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
        '.csv': 'text/csv', '.json': 'application/json', '.html': 'text/html',
        '.md': 'text/markdown', '.xlsx': 'text/csv', '.xls': 'text/csv',
        '.py': 'text/plain', '.js': 'text/plain', '.ts': 'text/plain',
        '.sh': 'text/plain', '.txt': 'text/plain',
    };
    const ext = Object.keys(mimeMap).find(e => lower.endsWith(e));
    return { buffer: Buffer.from(content, 'utf-8'), mimeType: ext ? mimeMap[ext] : 'text/plain' };
}

// GET handler — used by download links (anchor hrefs)
export async function GET(req: NextRequest) {
    const filename = req.nextUrl.searchParams.get('filename') || 'file.txt';
    const b64 = req.nextUrl.searchParams.get('b64');
    const rawContent = req.nextUrl.searchParams.get('content');

    const content = b64
        ? Buffer.from(decodeURIComponent(b64), 'base64').toString('utf-8')
        : decodeURIComponent(rawContent || '');

    try {
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
        return new NextResponse(`File generation failed: ${err.message}`, { status: 500 });
    }
}

// POST handler — for programmatic use
export async function POST(req: NextRequest) {
    try {
        const { filename, content } = await req.json();
        if (!filename || content === undefined) return new NextResponse('Missing params', { status: 400 });
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
        return new NextResponse(`File generation failed: ${err.message}`, { status: 500 });
    }
}


// Helper: generate DOCX as a simple XML-based Office Open format
function generateDocx(content: string): Buffer {
    // Minimal DOCX is a ZIP of XML files. We'll create a simplified version.
    // For simplicity, we'll return an RTF which opens in Word
    const rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Times New Roman;}}
\\f0\\fs24
${content.replace(/\n/g, '\\par\n').replace(/[{}\\]/g, '\\$&')}
}`;
    return Buffer.from(rtf, 'utf-8');
}

// Helper: generate simple ZIP with text content  
function generateZip(filename: string, content: string): Buffer {
    // Return a tar-like structure (simple approach - real ZIP needs compression)
    // We'll create a text archive with clear section headers
    const archive = `=== MONROE OMEGA ARCHIVE ===\nFile: ${filename}\nGenerated: ${new Date().toISOString()}\n${'='.repeat(50)}\n\n${content}`;
    return Buffer.from(archive, 'utf-8');
}

export async function POST(req: NextRequest) {
    try {
        const { filename, content } = await req.json();

        if (!filename || content === undefined) {
            return new NextResponse('Missing filename or content', { status: 400 });
        }

        const lower = filename.toLowerCase();
        let fileBuffer: Buffer;
        let mimeType: string;

        if (lower.endsWith('.pdf')) {
            // Dynamic import of jsPDF  
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            // Style the PDF
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            
            const lines = doc.splitTextToSize(content, 175);
            let y = 20;
            const pageHeight = doc.internal.pageSize.getHeight();
            
            for (const line of lines) {
                if (y > pageHeight - 20) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 15, y);
                y += 7;
            }
            
            fileBuffer = Buffer.from(doc.output('arraybuffer'));
            mimeType = 'application/pdf';
            
        } else if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
            fileBuffer = generateDocx(content);
            mimeType = 'application/msword';
            
        } else if (lower.endsWith('.zip')) {
            fileBuffer = generateZip(filename, content);
            mimeType = 'application/zip';
            
        } else if (lower.endsWith('.csv')) {
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'text/csv';
            
        } else if (lower.endsWith('.json')) {
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'application/json';
            
        } else if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
            // Return CSV that Excel can open
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'text/csv';
            
        } else if (lower.endsWith('.html')) {
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'text/html';
            
        } else if (lower.endsWith('.md')) {
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'text/markdown';
            
        } else {
            // Default: plain text (py, js, ts, sh, txt, exe blueprint, etc.)
            fileBuffer = Buffer.from(content, 'utf-8');
            mimeType = 'text/plain';
        }

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (err: any) {
        console.error('[file-generator] Error:', err.message);
        return new NextResponse(`File generation failed: ${err.message}`, { status: 500 });
    }
}
