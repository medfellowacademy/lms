import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getUserStats } from '@/lib/services/gamification';

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    
    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;

    // Get user with related data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                category: true,
              },
            },
          },
          orderBy: { lastAccessedAt: 'desc' },
          take: 5,
        },
        achievements: {
          where: { unlockedAt: { not: null } },
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
          take: 5,
        },
        certificates: {
          orderBy: { issuedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get gamification stats
    const stats = await getUserStats(userId);

    // Remove sensitive fields
    const { passwordHash, ...safeUser } = user as any;

    return NextResponse.json({
      user: safeUser,
      stats,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/me - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();
    
    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;
    const body = await request.json();

    // Whitelist of updatable fields
    const allowedFields = [
      'firstName',
      'lastName',
      'bio',
      'medicalTitle',
      'currentRole',
      'specialty',
      'institution',
      'country',
      'yearsOfExperience',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

