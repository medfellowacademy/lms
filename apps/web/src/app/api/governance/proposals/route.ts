import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/governance/proposals - Get all proposals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (category) {
      where.category = category.toUpperCase();
    }

    const proposals = await db.proposal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { votes: true },
        },
      },
    }) as any[];

    // Get user's votes if logged in
    const sessionUser = await getCurrentUser();
    let userVotes: Record<string, string> = {};

    if (sessionUser?.dbUser) {
      const votes = await db.vote.findMany({
        where: {
          userId: sessionUser.dbUser.id,
          proposalId: { in: proposals.map(p => p.id) },
        },
      }) as any[];
      userVotes = votes.reduce((acc, v) => {
        acc[v.proposalId] = v.vote;
        return acc;
      }, {} as Record<string, string>);
    }

    return NextResponse.json({
      proposals: proposals.map(p => ({
        ...p,
        userVote: userVotes[p.id] || null,
      })),
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/governance/proposals - Create a new proposal
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;

    // Check if user has enough level to create proposal
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { level: true },
    });

    const MIN_LEVEL_FOR_PROPOSAL = 5; // Minimum level 5

    if (!user || ((user as any)?.level || 0) < MIN_LEVEL_FOR_PROPOSAL) {
      return NextResponse.json(
        { error: `You need to be at least level ${MIN_LEVEL_FOR_PROPOSAL} to create a proposal` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, category, endDate } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Generate proposal ID
    const proposalCount = await db.proposal.count();
    const proposalId = `MF-${proposalCount + 1}`;

    // Calculate quorum based on active users (10% of total users)
    const totalUsers = await db.user.count({
      where: { isActive: true },
    });
    const quorum = Math.max(10, Math.floor(totalUsers * 0.1)); // At least 10 votes needed

    const proposal = await db.proposal.create({
      data: {
        proposalId,
        title,
        description,
        category: category.toUpperCase(),
        authorId: userId,
        quorum: Math.max(quorum, 100000), // Minimum quorum of 100k
        startDate: new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      },
    });

    // Create notification for all users (in production, use a queue)
    // For now, just create a system notification

    return NextResponse.json({ proposal }, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

