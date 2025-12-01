import { NextRequest, NextResponse } from 'next/server';

// In-memory store for active sessions
// In production, use Redis or similar
const activeSessions = new Map<string, number>();

// Clean up stale sessions (older than 2 minutes)
function cleanupStaleSessions() {
  const now = Date.now();
  const staleThreshold = 2 * 60 * 1000; // 2 minutes
  
  for (const [sessionId, timestamp] of activeSessions.entries()) {
    if (now - timestamp > staleThreshold) {
      activeSessions.delete(sessionId);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Update session timestamp
    activeSessions.set(sessionId, Date.now());
    
    // Clean up stale sessions
    cleanupStaleSessions();
    
    return NextResponse.json({
      count: activeSessions.size,
      sessionId,
    });
  } catch (error) {
    console.error('Presence error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    // Remove session
    activeSessions.delete(sessionId);
    
    return NextResponse.json({
      count: activeSessions.size,
    });
  } catch (error) {
    console.error('Presence cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Clean up stale sessions before returning count
  cleanupStaleSessions();
  
  return NextResponse.json({
    count: activeSessions.size,
  });
}
