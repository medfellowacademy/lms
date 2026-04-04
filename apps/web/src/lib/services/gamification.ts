import { db } from '../db';

// XP requirements for each level
const LEVEL_XP_REQUIREMENTS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  1750,   // Level 6
  2750,   // Level 7
  4000,   // Level 8
  5500,   // Level 9
  7500,   // Level 10
  10000,  // Level 11
  13000,  // Level 12
  17000,  // Level 13
  22000,  // Level 14
  28000,  // Level 15
  35000,  // Level 16
  43000,  // Level 17
  52000,  // Level 18
  62000,  // Level 19
  75000,  // Level 20
  // Additional levels follow a formula
];

// Rank progression
const RANKS = [
  { minLevel: 1, name: 'Intern', title: 'Medical Intern' },
  { minLevel: 5, name: 'Resident', title: 'Cardiology Resident' },
  { minLevel: 10, name: 'Fellow', title: 'Cardiology Fellow' },
  { minLevel: 15, name: 'Specialist', title: 'Cardiac Specialist' },
  { minLevel: 20, name: 'Consultant', title: 'Senior Consultant' },
  { minLevel: 30, name: 'Expert', title: 'Distinguished Expert' },
  { minLevel: 50, name: 'Master', title: 'Master Cardiologist' },
  { minLevel: 75, name: 'Legend', title: 'Legendary Practitioner' },
  { minLevel: 100, name: 'Nexus', title: 'Nexus Elite' },
];

// XP rewards for different actions
export const XP_REWARDS = {
  // Learning
  COMPLETE_LESSON: 10,
  COMPLETE_MODULE: 50,
  COMPLETE_COURSE: 200,
  WATCH_VIDEO: 5,
  
  // Assessment
  QUIZ_CORRECT_ANSWER: 5,
  QUIZ_PERFECT_SCORE: 50,
  EXAM_PASSED: 100,
  
  // Engagement
  DAILY_LOGIN: 5,
  STREAK_BONUS_7_DAYS: 50,
  STREAK_BONUS_30_DAYS: 200,
  STREAK_BONUS_100_DAYS: 1000,
  
  // Social
  POST_CREATED: 10,
  COMMENT_ADDED: 2,
  POST_LIKED: 1,
  HELPFUL_ANSWER: 25,
  
  // VR Surgery
  VR_SESSION_COMPLETED: 25,
  VR_PERFECT_SCORE: 100,
  VR_FIRST_TRY_SUCCESS: 50,
  
  // Research
  RESEARCH_PAPER_SAVED: 5,
  RESEARCH_PROJECT_COMPLETED: 200,
  
  // AI Tutor
  AI_CONVERSATION: 5,
  AI_QUIZ_CORRECT: 10,
  
  // Achievements
  ACHIEVEMENT_UNLOCKED: 0, // Varies by achievement
};

// Calculate level from XP
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_XP_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_XP_REQUIREMENTS[i]) {
      return i + 1;
    }
  }
  
  // For levels beyond our predefined array
  const baseLevel = LEVEL_XP_REQUIREMENTS.length;
  const baseXP = LEVEL_XP_REQUIREMENTS[baseLevel - 1];
  const xpPerLevel = 10000; // Each additional level needs 10k more XP
  
  return baseLevel + Math.floor((xp - baseXP) / xpPerLevel);
}

// Calculate XP needed for next level
export function calculateXPForNextLevel(currentLevel: number): number {
  if (currentLevel < LEVEL_XP_REQUIREMENTS.length) {
    return LEVEL_XP_REQUIREMENTS[currentLevel];
  }
  
  // Formula for higher levels
  const baseXP = LEVEL_XP_REQUIREMENTS[LEVEL_XP_REQUIREMENTS.length - 1];
  const levelsAboveBase = currentLevel - LEVEL_XP_REQUIREMENTS.length;
  return baseXP + (levelsAboveBase + 1) * 10000;
}

// Get rank for level
export function getRankForLevel(level: number): { name: string; title: string } {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return { name: RANKS[i].name, title: RANKS[i].title };
    }
  }
  return RANKS[0];
}

// Award XP to user
export async function awardXP(
  userId: string,
  amount: number,
  reason: string
): Promise<{
  newXP: number;
  newLevel: number;
  leveledUp: boolean;
  newRank: string | null;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, rank: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const newXP = ((user as any)?.xp || 0) + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > ((user as any)?.level || 1);
  
  const newRankInfo = getRankForLevel(newLevel);
  const rankChanged = newRankInfo.name !== ((user as any)?.rank || 'Novice');

  // Update user
  await db.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
      rank: newRankInfo.name,
    },
  });

  // Log analytics event
  await db.analyticsEvent.create({
    data: {
      userId,
      sessionId: 'system',
      event: 'xp_awarded',
      properties: JSON.stringify({
        amount,
        reason,
        newXP,
        newLevel,
        leveledUp,
      }),
    },
  });

  // Check for level-based achievements
  if (leveledUp) {
    await checkLevelAchievements(userId, newLevel);
    
    // Create notification for level up
    await db.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: 'Level Up! 🎉',
        message: `Congratulations! You've reached Level ${newLevel}!`,
      },
    });
  }

  if (rankChanged) {
    await db.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: 'New Rank Achieved! 🏆',
        message: `You've earned the rank of ${newRankInfo.title}!`,
      },
    });
  }

  return {
    newXP,
    newLevel,
    leveledUp,
    newRank: rankChanged ? newRankInfo.name : null,
  };
}

// Update streak
export async function updateStreak(userId: string): Promise<{
  streak: number;
  bonusXP: number;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActivityAt: true },
  }) as any;

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const lastActivity = user.lastActivityAt;
  let newStreak = 1;
  let bonusXP = 0;

  if (lastActivity) {
    const lastDate = new Date(lastActivity);
    const diffDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      // Same day, streak unchanged
      newStreak = (user as any)?.streak || 1;
    } else if (diffDays === 1) {
      // Consecutive day, increment streak
      newStreak = ((user as any)?.streak || 0) + 1;
      
      // Award streak bonuses
      if (newStreak === 7) {
        bonusXP = XP_REWARDS.STREAK_BONUS_7_DAYS;
      } else if (newStreak === 30) {
        bonusXP = XP_REWARDS.STREAK_BONUS_30_DAYS;
      } else if (newStreak === 100) {
        bonusXP = XP_REWARDS.STREAK_BONUS_100_DAYS;
      }
    }
    // diffDays > 1 means streak is broken, reset to 1
  }

  // Update user
  await db.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      lastActivityAt: now,
    },
  });

  // Award bonus XP if applicable
  if (bonusXP > 0) {
    await awardXP(userId, bonusXP, `Streak bonus (${newStreak} days)`);
    
    await db.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: 'Streak Bonus! 🔥',
        message: `Amazing ${newStreak}-day streak! +${bonusXP} XP bonus!`,
      },
    });
  }

  // Check for streak achievements
  await checkStreakAchievements(userId, newStreak);

  return { streak: newStreak, bonusXP };
}

// Check and award achievements
export async function checkAndAwardAchievement(
  userId: string,
  achievementId: string
): Promise<boolean> {
  // Check if already unlocked
  const existing = await db.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });

  if ((existing as any)?.unlockedAt) {
    return false;
  }

  const achievement = await db.achievement.findUnique({
    where: { id: achievementId },
  }) as any;

  if (!achievement) {
    return false;
  }

  // Update or create user achievement
  await db.userAchievement.upsert({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
    update: {
      progress: 100,
      unlockedAt: new Date(),
    },
    create: {
      userId,
      achievementId,
      progress: 100,
      unlockedAt: new Date(),
    },
  });

  // Award XP
  if (achievement.xpReward > 0) {
    await awardXP(userId, achievement.xpReward, `Achievement: ${achievement.title}`);
  }

  // Create notification
  await db.notification.create({
    data: {
      userId,
      type: 'ACHIEVEMENT',
      title: 'Achievement Unlocked! 🏅',
      message: `You've earned: ${achievement.title}`,
    },
  });

  return true;
}

// Check level-based achievements
async function checkLevelAchievements(userId: string, level: number): Promise<void> {
  const levelAchievements = await db.achievement.findMany({
    where: {
      category: 'LEVEL',
      requirement: {
        contains: `"level": ${level}`,
      },
    },
  }) as any[];

  for (const achievement of levelAchievements) {
    await checkAndAwardAchievement(userId, achievement.id);
  }
}

// Check streak achievements
async function checkStreakAchievements(userId: string, streak: number): Promise<void> {
  const streakAchievements = await db.achievement.findMany({
    where: {
      category: 'STREAK',
    },
  }) as any[];

  for (const achievement of streakAchievements) {
    try {
      const req = JSON.parse(achievement.requirement);
      if (streak >= req.streak) {
        await checkAndAwardAchievement(userId, achievement.id);
      }
    } catch (e) {
      // Invalid requirement format
    }
  }
}

// Get user gamification stats
export async function getUserStats(userId: string): Promise<{
  level: number;
  xp: number;
  xpToNextLevel: number;
  xpProgress: number;
  rank: string;
  rankTitle: string;
  streak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      level: true,
      xp: true,
      rank: true,
      streak: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const userLevel = (user as any)?.level || 1;
  const userXP = (user as any)?.xp || 0;
  
  const xpForCurrentLevel = userLevel > 1 
    ? LEVEL_XP_REQUIREMENTS[userLevel - 1] || 0 
    : 0;
  const xpToNextLevel = calculateXPForNextLevel(userLevel);
  const xpInCurrentLevel = userXP - xpForCurrentLevel;
  const xpNeededForLevel = xpToNextLevel - xpForCurrentLevel;
  const xpProgress = Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);

  const rankInfo = getRankForLevel(userLevel);

  const [achievementsUnlocked, totalAchievements] = await Promise.all([
    db.userAchievement.count({
      where: { userId, unlockedAt: { not: null } },
    }),
    db.achievement.count({ where: { isActive: true } }),
  ]);

  return {
    level: userLevel,
    xp: userXP,
    xpToNextLevel,
    xpProgress,
    rank: (user as any)?.rank || rankInfo.name,
    rankTitle: rankInfo.title,
    streak: (user as any)?.streak || 0,
    achievementsUnlocked,
    totalAchievements,
  };
}

// Get leaderboard
export async function getLeaderboard(
  type: 'xp' | 'level' | 'streak' = 'xp',
  limit: number = 10
): Promise<{
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  value: number;
  level: number;
  rankName: string;
}[]> {
  const orderBy = type === 'xp' ? { xp: 'desc' as const }
    : type === 'level' ? { level: 'desc' as const }
    : { streak: 'desc' as const };

  const users = await db.user.findMany({
    orderBy,
    take: limit,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      xp: true,
      level: true,
      streak: true,
      rank: true,
    },
  }) as any[];

  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
    avatar: user.avatar,
    value: type === 'xp' ? user.xp : type === 'level' ? user.level : user.streak,
    level: user.level,
    rankName: user.rank || 'Intern',
  }));
}

