import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * PATCH /api/admin/modules/[moduleId]/lock
 * Toggle lock status for a module (locks/unlocks all lessons in the module)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params;
    const body = await req.json();
    const { isLocked, reason } = body;

    const userId = req.headers.get('x-user-id') || 'admin';

    // Update module lock status
    const module = await db.module.update({
      where: { id: moduleId },
      data: { isLocked: Boolean(isLocked) },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Also update all lessons in this module
    await db.lesson.updateMany({
      where: { moduleId },
      data: { isLocked: Boolean(isLocked) },
    });

    // Log lock action for each lesson
    const lockHistoryEntries = module.lessons.map((lesson) => ({
      lessonId: lesson.id,
      userId,
      action: isLocked ? 'LOCKED' : 'UNLOCKED',
      reason: reason || `Module ${isLocked ? 'locked' : 'unlocked'} by admin`,
    }));

    await db.lessonLockHistory.createMany({
      data: lockHistoryEntries,
    }).catch(() => {
      console.log('LessonLockHistory table not found, skipping audit log');
    });

    return NextResponse.json({
      success: true,
      data: {
        module: {
          id: module.id,
          title: module.title,
          isLocked: module.isLocked,
          courseId: module.courseId,
          courseName: module.course.title,
          affectedLessons: module.lessons.length,
        },
      },
      message: `Module ${isLocked ? 'locked' : 'unlocked'} successfully (${module.lessons.length} lessons affected)`,
    });
  } catch (error: any) {
    console.error('[API] Error toggling module lock:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to toggle module lock' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/modules/[moduleId]/lock
 * Get lock status for a module
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params;

    const module = await db.module.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        title: true,
        isLocked: true,
        lessons: {
          select: {
            id: true,
            title: true,
            isLocked: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    const lockedCount = module.lessons.filter((l) => l.isLocked).length;
    const unlockedCount = module.lessons.length - lockedCount;

    return NextResponse.json({
      success: true,
      data: {
        module: {
          ...module,
          stats: {
            total: module.lessons.length,
            locked: lockedCount,
            unlocked: unlockedCount,
          },
        },
      },
    });
  } catch (error: any) {
    console.error('[API] Error fetching module lock status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch lock status' },
      { status: 500 }
    );
  }
}
