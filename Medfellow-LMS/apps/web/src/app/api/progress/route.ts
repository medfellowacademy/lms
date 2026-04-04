import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { awardXP, XP_REWARDS, updateStreak } from '@/lib/services/gamification';

// POST /api/progress - Update lesson progress
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
    const body = await request.json();

    const {
      lessonId,
      progress,
      watchTime,
      lastPosition,
      completed = false,
    } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Verify lesson exists and user is enrolled
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const courseId = (lesson as any)?.module?.courseId;

    // Check enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      );
    }

    // Get existing progress
    const existingProgress = await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    const wasAlreadyCompleted = (existingProgress as any)?.completedAt !== null;

    // Update or create progress
    const lessonProgress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        progress: Math.max((existingProgress as any)?.progress || 0, progress),
        watchTime: ((existingProgress as any)?.watchTime || 0) + (watchTime || 0),
        lastPosition: lastPosition || (existingProgress as any)?.lastPosition || 0,
        completedAt: completed && !wasAlreadyCompleted ? new Date() : (existingProgress as any)?.completedAt,
      },
      create: {
        userId,
        lessonId,
        progress,
        watchTime: watchTime || 0,
        lastPosition: lastPosition || 0,
        completedAt: completed ? new Date() : null,
      },
    });

    // Update enrollment last accessed
    await db.enrollment.update({
      where: { id: (enrollment as any)?.id },
      data: { lastAccessedAt: new Date() },
    });

    // Award XP and update streak if lesson completed
    let xpAwarded = 0;
    if (completed && !wasAlreadyCompleted) {
      xpAwarded = (lesson as any)?.xpReward || XP_REWARDS.COMPLETE_LESSON;
      await awardXP(userId, xpAwarded, `Completed lesson: ${(lesson as any)?.title}`);
      await updateStreak(userId);

      // Check if module is complete
      const moduleProgress = await checkModuleCompletion(userId, (lesson as any)?.module?.id);
      if (moduleProgress.completed) {
        await awardXP(userId, XP_REWARDS.COMPLETE_MODULE, `Completed module: ${(lesson as any)?.module?.title}`);
      }

      // Check if course is complete
      const courseProgress = await checkCourseCompletion(userId, courseId);
      if (courseProgress.completed) {
        await awardXP(userId, (lesson as any)?.module?.course?.xpReward || XP_REWARDS.COMPLETE_COURSE, `Completed course: ${(lesson as any)?.module?.course?.title}`);
        
        // Update enrollment status
        await db.enrollment.update({
          where: { id: (enrollment as any)?.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            progress: 100,
          },
        });

        // Create notification
        await db.notification.create({
          data: {
            userId,
            type: 'COURSE',
            title: 'Course Completed! 🎉',
            message: `Congratulations! You've completed ${(lesson as any)?.module?.course?.title}!`,
            actionUrl: `/dashboard/certificates`,
          },
        });
      } else {
        // Update enrollment progress
        await db.enrollment.update({
          where: { id: (enrollment as any)?.id },
          data: { progress: courseProgress.progress },
        });
      }
    }

    return NextResponse.json({
      progress: lessonProgress,
      xpAwarded,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper: Check module completion
async function checkModuleCompletion(userId: string, moduleId: string) {
  const module = await db.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: true,
    },
  });

  if (!module) {
    return { completed: false, progress: 0 };
  }

  const completedLessons = await db.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: ((module as any)?.lessons || []).map((l: any) => l.id) },
      completedAt: { not: null },
    },
  });

  const totalLessons = ((module as any)?.lessons || []).length;
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    completed: completedLessons === totalLessons && totalLessons > 0,
    progress,
  };
}

// Helper: Check course completion
async function checkCourseCompletion(userId: string, courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!course) {
    return { completed: false, progress: 0 };
  }

  const allLessonIds = ((course as any)?.modules || []).flatMap((m: any) => (m.lessons || []).map((l: any) => l.id));
  const totalLessons = allLessonIds.length;

  const completedLessons = await db.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completedAt: { not: null },
    },
  });

  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return {
    completed: completedLessons === totalLessons && totalLessons > 0,
    progress,
  };
}

// GET /api/progress - Get user's overall progress
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

    // Get all enrollments with progress
    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            category: true,
            duration: true,
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    }) as any[];

    // Get recent activity
    const recentProgress = await db.lessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    }) as any[];

    // Calculate stats
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length;
    const watchTimeRecords = await db.lessonProgress.findMany({
      where: { userId },
      select: { watchTime: true },
    }) as any[];
    const totalWatchTime = watchTimeRecords.reduce((sum, record) => sum + (record.watchTime || 0), 0);

    return NextResponse.json({
      enrollments,
      recentProgress,
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses: totalCourses - completedCourses,
        totalWatchTime: totalWatchTime,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

