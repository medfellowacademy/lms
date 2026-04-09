import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * PATCH /api/admin/lessons/[lessonId]/lock
 * Toggle lock status for a lesson
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    const body = await req.json();
    const { isLocked, reason } = body;

    // Get admin user from session (simplified - you should implement proper auth)
    const userId = req.headers.get('x-user-id') || 'admin';

    // Update lesson lock status
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: { isLocked: Boolean(isLocked) },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Log the lock/unlock action
    await db.lessonLockHistory.create({
      data: {
        lessonId,
        userId,
        action: isLocked ? 'LOCKED' : 'UNLOCKED',
        reason: reason || `Lesson ${isLocked ? 'locked' : 'unlocked'} by admin`,
      },
    }).catch(() => {
      // If history table doesn't exist yet, just continue
      console.log('LessonLockHistory table not found, skipping audit log');
    });

    return NextResponse.json({
      success: true,
      data: {
        lesson: {
          id: lesson.id,
          title: lesson.title,
          isLocked: lesson.isLocked,
          courseId: lesson.module.courseId,
          courseName: lesson.module.course.title,
        },
      },
      message: `Lesson ${isLocked ? 'locked' : 'unlocked'} successfully`,
    });
  } catch (error: any) {
    console.error('[API] Error toggling lesson lock:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle lesson lock' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/lessons/[lessonId]/lock
 * Get lock status and history for a lesson
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;

    // Get lesson with lock status
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        isLocked: true,
        module: {
          select: {
            isLocked: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get lock history
    const history = await db.lessonLockHistory
      .findMany({
        where: { lessonId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      })
      .catch(() => [] as any[]);

    return NextResponse.json({
      success: true,
      data: {
        lesson,
        history: history.map((h: any) => ({
          id: h.id,
          action: h.action,
          reason: h.reason,
          createdAt: h.createdAt,
          user: h.user
            ? `${h.user.firstName} ${h.user.lastName}`
            : 'Unknown',
        })),
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching lesson lock status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch lock status' },
      { status: 500 }
    );
  }
}
