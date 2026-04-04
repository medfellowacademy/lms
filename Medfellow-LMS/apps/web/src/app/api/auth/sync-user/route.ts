import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, firstName, lastName } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id,
        email,
        firstName,
        lastName,
        role: 'STUDENT',
        level: 1,
        xp: 0,
        rank: 'Intern',
        streak: 0,
        isActive: true,
        isVerified: false,
      },
    });

    // Award "First Steps" achievement
    const firstStepsAchievement = await prisma.achievement.findFirst({
      where: { id: 'first-steps' },
    });

    if (firstStepsAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: (firstStepsAchievement as any)?.id || 'default-id',
          progress: 100,
          unlockedAt: new Date(),
        },
      });

      // Award XP
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: (firstStepsAchievement as any)?.xpReward || 0 },
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Sync user error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

