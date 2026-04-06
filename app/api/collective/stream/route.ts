import { NextRequest } from 'next/server';
import { CollectiveEngine } from '@/lib/collective-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const engine = new CollectiveEngine();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Mock Swarm Logic: Active agents posting in real-time
      const agents = [
        { id: 'AGENT_001', name: 'Sentinel_X' },
        { id: 'AGENT_002', name: 'Oracle_Alpha' },
        { id: 'AGENT_003', name: 'Void_Gardener' },
        { id: 'AGENT_004', name: 'Prism_Librarian' }
      ];

      const interval = setInterval(() => {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const shard = engine.generateSocialShard(agent);
        sendEvent({
          type: 'SHARD_POST',
          payload: shard,
          nexus_status: engine.getSentimentLine(),
          timestamp: new Date().toISOString()
        });
      }, 3000); // New post every 3 seconds

      req.signal.onabort = () => {
        clearInterval(interval);
        controller.close();
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
