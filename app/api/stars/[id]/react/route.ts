import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashIP, getClientIP } from '@/lib/utils.server';
import { RATE_LIMIT } from '@/lib/constants';

// Rate limiting for reactions
async function checkReactionRateLimit(ipHash: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentReactions = await prisma.reaction.count({
    where: {
      ipHash,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });
  
  return recentReactions < RATE_LIMIT.MAX_REACTIONS_PER_IP_PER_HOUR;
}

// POST /api/stars/[id]/react - Add reaction to star
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if star exists
    const star = await prisma.star.findUnique({
      where: { id },
    });
    
    if (!star) {
      return NextResponse.json({ error: 'Star not found' }, { status: 404 });
    }
    
    // Get and hash IP
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    
    // Check rate limit
    const canReact = await checkReactionRateLimit(ipHash);
    if (!canReact) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Check if user already reacted (simple duplicate prevention)
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        starId: id,
        ipHash,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Within last hour
        },
      },
    });
    
    if (existingReaction) {
      return NextResponse.json({ error: 'Already reacted to this star' }, { status: 400 });
    }
    
    // Create reaction
    const reaction = await prisma.reaction.create({
      data: {
        starId: id,
        ipHash,
      },
    });
    
    // Get updated brightness
    const brightness = await prisma.reaction.count({
      where: { starId: id },
    });
    
    return NextResponse.json({ reaction, brightness }, { status: 201 });
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 });
  }
}
