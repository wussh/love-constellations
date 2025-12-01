import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSecretCode, hashIP, generateStarPosition, getClientIP } from '@/lib/utils.server';
import { RATE_LIMIT, MODERATION } from '@/lib/constants';

// Rate limiting check
async function checkRateLimit(ipHash: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentStars = await prisma.star.count({
    where: {
      ipHash,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });
  
  return recentStars < RATE_LIMIT.MAX_STARS_PER_IP_PER_HOUR;
}

// Find and create twin link if matching code exists
async function findAndLinkTwin(starId: string, codeHash: string): Promise<void> {
  // Find another star with same code hash (excluding current star)
  const twinStar = await prisma.star.findFirst({
    where: {
      codeHash,
      id: {
        not: starId,
      },
      // Ensure it's not already linked
      AND: [
        {
          twinLinksA: {
            none: {
              starBId: starId,
            },
          },
        },
        {
          twinLinksB: {
            none: {
              starAId: starId,
            },
          },
        },
      ],
    },
  });
  
  if (twinStar) {
    // Create twin link
    await prisma.twinLink.create({
      data: {
        starAId: starId,
        starBId: twinStar.id,
      },
    });
  }
}

// GET /api/stars - List stars with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const stars = await prisma.star.findMany({
      where: theme ? { theme: theme as any } : undefined,
      include: {
        reactions: {
          select: {
            id: true,
          },
        },
        twinLinksA: {
          include: {
            starB: {
              select: {
                id: true,
                posX: true,
                posY: true,
              },
            },
          },
        },
        twinLinksB: {
          include: {
            starA: {
              select: {
                id: true,
                posX: true,
                posY: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    
    // Transform data for frontend
    const transformedStars = stars.map((star: any) => ({
      id: star.id,
      message: star.message,
      theme: star.theme,
      posX: star.posX,
      posY: star.posY,
      brightness: star.reactions.length,
      createdAt: star.createdAt,
      hasTwin: star.twinLinksA.length > 0 || star.twinLinksB.length > 0,
      twinLink: star.twinLinksA[0]?.starB || star.twinLinksB[0]?.starA || null,
    }));
    
    return NextResponse.json({ stars: transformedStars });
  } catch (error) {
    console.error('Error fetching stars:', error);
    return NextResponse.json({ error: 'Failed to fetch stars' }, { status: 500 });
  }
}

// POST /api/stars - Create new star
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, theme, initials, birthMonth } = body;
    
    // Validation
    if (!message || !theme) {
      return NextResponse.json({ error: 'Message and theme are required' }, { status: 400 });
    }
    
    if (message.length < MODERATION.MIN_MESSAGE_LENGTH || message.length > MODERATION.MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be between ${MODERATION.MIN_MESSAGE_LENGTH} and ${MODERATION.MAX_MESSAGE_LENGTH} characters` },
        { status: 400 }
      );
    }
    
    // Get and hash IP for rate limiting
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);
    
    // Check rate limit
    const canPost = await checkRateLimit(ipHash);
    if (!canPost) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Hash secret code if provided
    let codeHash: string | null = null;
    if (initials && birthMonth) {
      codeHash = hashSecretCode(initials, birthMonth);
    }
    
    // Generate star position
    const position = generateStarPosition();
    
    // Create star
    const star = await prisma.star.create({
      data: {
        message,
        theme,
        codeHash,
        posX: position.x,
        posY: position.y,
        ipHash,
      },
    });
    
    // Check for twin star match
    if (codeHash) {
      await findAndLinkTwin(star.id, codeHash);
    }
    
    return NextResponse.json({ star }, { status: 201 });
  } catch (error) {
    console.error('Error creating star:', error);
    return NextResponse.json({ error: 'Failed to create star' }, { status: 500 });
  }
}
