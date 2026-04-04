import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/achievements - Get all achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') || 'all';
    const rarity = searchParams.get('rarity') || 'all';

    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (category !== 'all') {
      where.category = category;
    }

    if (rarity !== 'all') {
      where.rarity = rarity.toUpperCase();
    }

    const [achievements, totalCount] = await Promise.all([
      prisma.achievement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      }),
      prisma.achievement.count({ where }),
    ]);

    const totalUsers = await prisma.user.count();

    const achievementsWithStats = (achievements as any[]).map((achievement) => ({
      ...achievement,
      unlockCount: achievement._count.users,
      unlockRate:
        totalUsers > 0
          ? ((achievement._count.users / totalUsers) * 100).toFixed(1)
          : 0,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        achievements: achievementsWithStats,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Admin achievements error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST /api/admin/achievements - Create a new achievement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      icon,
      rarity = 'COMMON',
      requirement,
      xpReward = 50,
      category,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        title,
        description,
        icon: icon || '🏆',
        rarity: rarity.toUpperCase(),
        requirement: requirement || JSON.stringify({ type: 'manual' }),
        xpReward,
        category: category || 'General',
      },
    });

    return NextResponse.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}

