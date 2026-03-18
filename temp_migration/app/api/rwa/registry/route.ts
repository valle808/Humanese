import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const assets = await prisma.rWARegistry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    return NextResponse.json({
      success: true,
      assets,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch RWA registry:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch RWA registry',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
