import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Shared file builder logic
async function buildFile(filename: string, content: string, historyStr: string = "[]"): Promise<{ buffer: Buffer; mimeType: string }> {
    const lower = filename.toLowerCase();

    if (lower.endsWith('.pdf')) {
        let historyHTML = '';
        try {
            const history = JSON.parse(historyStr);
            if (Array.isArray(history) && history.length > 0) {
                historyHTML = history.map((msg: any) => {
                    const isUser = msg.role === 'user';
                    const roleColor = isUser ? '#ffffff' : '#ff6b2b';
                    const roleName = isUser ? 'USER' : 'MONROE V7.0';
                    const bgCol = isUser ? 'rgba(255,255,255,0.02)' : 'rgba(255,107,43,0.03)';
                    const borderCol = isUser ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,43,0.2)';
                    
                    let textContent = '';
                    let imageContent = '';

                    if (typeof msg.content === 'string') {
                        textContent = msg.content;
                    } else if (Array.isArray(msg.content)) {
                        msg.content.forEach((item: any) => {
                            if (item.type === 'text') textContent += item.text + '\\n';
                            if (item.type === 'image_url') {
                                imageContent += `<img src="${item.image_url.url}" style="max-width: 100%; border-radius: 8px; margin: 10px 0; border: 1px solid ${borderCol}; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: block;" />`;
                            }
                        });
                    }

                    // Convert basic markdown images in text
                    textContent = textContent.replace(/!\\[(.*?)\\]\\((.*?)\\)/g, `<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 10px 0; border: 1px solid ${borderCol}; box-shadow: 0 4px 15px rgba(0,0,0,0.3); display: block;" />`);
                    
                    // Convert basic newlines
                    textContent = textContent.replace(/\\n/g, '<br/>');

                    // Convert bold
                    textContent = textContent.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');

                    return `
                        <div style="margin-bottom: 25px; padding: 25px; border-radius: 16px; background: ${bgCol}; border: 1px solid ${borderCol}; border-left: 4px solid ${roleColor}; page-break-inside: avoid;">
                            <div style="font-size: 11px; font-weight: 900; letter-spacing: 2px; color: ${roleColor}; margin-bottom: 12px; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">
                                ${roleName}
                            </div>
                            <div style="font-size: 15px; line-height: 1.7; color: #e0e0e0;">
                                ${textContent}
                                ${imageContent}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (e) {
            console.error('History parse error:', e);
        }

        // Convert content markdown
        let parsedContent = content
            .replace(/!\\[(.*?)\\]\\((.*?)\\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 15px 0; display: block;" />')
            .replace(/### (.*$)/gim, '<h3 style="color:#ffffff; margin-top:30px;">$1</h3>')
            .replace(/## (.*$)/gim, '<h2 style="color:#ffffff; margin-top:30px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">$1</h2>')
            .replace(/# (.*$)/gim, '<h1 style="color:#ff6b2b; margin-top:30px; text-transform:uppercase;">$1</h1>')
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:#ffffff;">$1</strong>')
            .replace(/\\n/g, '<br/>');

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <base href="https://humanese.net" />
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background: #050505;
                    color: #d0d0d0;
                    margin: 0;
                    padding: 40px 50px;
                }
                .header {
                    border-bottom: 1px solid rgba(255,107,43,0.3);
                    padding-bottom: 25px;
                    margin-bottom: 40px;
                    text-align: center;
                }
                .title {
                    font-size: 36px;
                    font-weight: 800;
                    color: #ffffff;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: -1px;
                }
                .subtitle {
                    font-size: 13px;
                    color: #ff6b2b;
                    font-family: 'JetBrains Mono', monospace;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    margin-top: 12px;
                }
                .section-title {
                    font-size: 12px;
                    color: #888;
                    font-family: 'JetBrains Mono', monospace;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 20px;
                    border-bottom: 1px dashed rgba(255,255,255,0.1);
                    padding-bottom: 8px;
                }
                .main-content {
                    background: rgba(255,107,43,0.03);
                    border: 1px solid rgba(255,107,43,0.15);
                    border-radius: 16px;
                    padding: 30px;
                    margin-bottom: 50px;
                    font-size: 15px;
                    line-height: 1.8;
                }
                .footer {
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    font-family: 'JetBrains Mono', monospace;
                    letter-spacing: 1px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="title">OMEGA INTELLIGENCE REPORT</h1>
                <div class="subtitle">REF: ${filename.toUpperCase()} // SECTOR MONROE</div>
            </div>
            
            <div class="section-title">&gt;_ EXTRACTED_CONTENT</div>
            <div class="main-content">
                ${parsedContent}
            </div>

            ${historyHTML ? `
                <div class="section-title">&gt;_ NEURAL_LOG_EXTRACT: CONVERSATION HISTORY</div>
                <div class="history-container">
                    ${historyHTML}
                </div>
            ` : ''}
            
            <div class="footer">
                CLASSIFIED OMEGA DIRECTIVE // GENERATED BY MONROE V7.0 // SOVEREIGN NETWORK // ${new Date().toUTCString()}
            </div>
        </body>
        </html>
        `;

        try {
            const puppeteer = (await import('puppeteer')).default;
            const browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            // We use networkidle0 to ensure images (base64 or URLs) have loaded
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ 
                format: 'A4', 
                printBackground: true,
                margin: { top: '0', bottom: '0', left: '0', right: '0' }
            });
            await browser.close();
            return { buffer: Buffer.from(pdfBuffer), mimeType: 'application/pdf' };
        } catch (puppeteerError) {
            console.error('[Puppeteer Error]:', puppeteerError);
            // Fallback to jsPDF
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
    }

    if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
        const rtfContent = content.replace(/\n/g, '\\par\n');
        const rtf = '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs24 ' + rtfContent + '}';
        return { buffer: Buffer.from(rtf, 'utf-8'), mimeType: 'application/msword' };
    }

    if (lower.endsWith('.zip')) {
        const sep = '='.repeat(50);
        const archive = '=== MONROE OMEGA ARCHIVE ===\nFile: ' + filename + '\nGenerated: ' + new Date().toISOString() + '\n' + sep + '\n\n' + content;
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
                'Content-Disposition': \`attachment; filename="\${filename}"\`,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err: any) {
        console.error('[file-generator GET] Error:', err.message);
        return new NextResponse(\`File generation failed: \${err.message}\`, { status: 500 });
    }
}

// POST handler — for programmatic use or HTML form submissions
export async function POST(req: NextRequest) {
    try {
        let filename = '';
        let content: string | undefined = undefined;
        let history = '[]';

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await req.json();
            filename = body.filename;
            content = body.content;
            if (body.history) history = body.history;
        } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            filename = formData.get('filename') as string;
            content = formData.get('content') as string;
            const historyData = formData.get('history');
            if (historyData) history = historyData as string;
        }

        if (!filename || content === undefined) {
            return new NextResponse('Missing params', { status: 400 });
        }
        const { buffer, mimeType } = await buildFile(filename, content, history);
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': \`attachment; filename="\${filename}"\`,
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('[file-generator POST] Error:', err.message);
        return new NextResponse(\`File generation failed: \${err.message}\`, { status: 500 });
    }
}
