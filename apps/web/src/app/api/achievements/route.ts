import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/achievements - Get all achievements and user progress
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    // Get all achievements
    const achievements = await db.achievement.findMany({
      where: { isActive: true },
      orderBy: [
        { rarity: 'desc' },
        { category: 'asc' },
      ],
    });

    // Get user's achievement progress if logged in
    let userAchievements: Record<string, { progress: number; unlockedAt: Date | null }> = {};

    if (sessionUser?.dbUser) {
      const userProgress = await db.userAchievement.findMany({
        where: { userId: sessionUser.dbUser.id },
      });

      userAchievements = (userProgress as any[]).reduce((acc, ua) => {
        acc[ua.achievementId] = {
          progress: ua.progress,
          unlockedAt: ua.unlockedAt,
        };
        return acc;
      }, {} as Record<string, { progress: number; unlockedAt: Date | null }>);
    }

    // Group achievements by category
    const grouped = (achievements as any[]).reduce((acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        ...achievement,
        userProgress: userAchievements[achievement.id] || null,
      });
      return acc;
    }, {} as Record<string, unknown[]>);

    return NextResponse.json({
      achievements: grouped,
      totalUnlocked: Object.values(userAchievements).filter(ua => ua.unlockedAt).length,
      totalAchievements: achievements.length,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

