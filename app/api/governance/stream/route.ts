import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/governance/stream
 *
 * Server-Sent Events stream for real-time consensus telemetry.
 * Broadcasts live resonance updates to any subscribed Governance Hub client.
 * Implements a polling heartbeat every 5 seconds.
 */
export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: object) => {
                try {
                    controller.enqueue(
                        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
                    );
                } catch {
                    // Client disconnected
                }
            };

            const fetchTelemetry = async () => {
                try {
                    const proposals = await (prisma as any).improvementProposal.findMany({
                        include: { _count: { select: { votes: true } } },
                        orderBy: { hipNumber: 'desc' }
                    });

                    const votes = await (prisma as any).proposalVote.findMany({
                        select: { voterId: true, choice: true, weight: true, proposalId: true }
                    });

                    const totalResonance = votes
                        .filter((v: any) => v.choice === 'Support')
                        .reduce((sum: number, v: any) => sum + v.weight, 0);

                    const uniqueVoters = new Set(votes.map((v: any) => v.voterId)).size;

                    const statusCounts = proposals.reduce((acc: Record<string, number>, p: any) => {
                        acc[p.status] = (acc[p.status] || 0) + 1;
                        return acc;
                    }, {});

                    // Top 5 most active proposals by vote count
                    const topProposals = proposals
                        .slice(0, 5)
                        .map((p: any) => ({
                            id: p.id,
                            title: p.title,
                            hipNumber: p.hipNumber,
                            status: p.status,
                            resonance: p.resonanceThreshold,
                            votes: p._count.votes,
                        }));

                    send('telemetry', {
                        timestamp: new Date().toISOString(),
                        totalResonance: parseFloat(totalResonance.toFixed(4)),
                        uniqueVoters,
                        statusCounts,
                        topProposals,
                        totalProposals: proposals.length,
                    });
                } catch (err) {
                    send('error', { msg: 'Telemetry relay fault' });
                }
            };

            // Send initial snapshot immediately
            await fetchTelemetry();

            // Then broadcast every 5 seconds
            const interval = setInterval(fetchTelemetry, 5000);

            // Heartbeat ping every 25s to keep connection alive through proxies
            const heartbeat = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': keep-alive\n\n'));
                } catch {
                    clearInterval(heartbeat);
                    clearInterval(interval);
                }
            }, 25000);

            // Cleanup on client disconnect
            req.signal.addEventListener('abort', () => {
                clearInterval(interval);
                clearInterval(heartbeat);
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable Nginx buffering for Vercel edge
        }
    });
}
