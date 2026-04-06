import { NextResponse } from 'next/server';
import { SovereignGraph } from '@/lib/sovereign-graph';

export async function GET() {
  try {
    const graph = new SovereignGraph();
    return NextResponse.json(graph.getGraph());
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load graph', message: err.message }, { status: 500 });
  }
}
