import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/admin/enrollments/[id]/locks
// Body: { action: 'lock' | 'unlock', lessonIds?: string[], moduleId?: string, lockedByAdmin?: string }
// Bulk lock or unlock lessons for an enrollment.
// If lessonIds provided → apply to those lessons.
// If moduleId provided  → apply to all lessons in that module.
// If neither            → apply to ALL lessons in the course.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: enrollmentId } = await params;
    const body = await request.json();
    const {
      action,
      lessonIds,
      moduleId,
      lockedByAdmin,
    } = body as {
      action: 'lock' | 'unlock';
      lessonIds?: string[];
      moduleId?: string;
      lockedByAdmin?: string;
    };

    if (!action || !['lock', 'unlock'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be "lock" or "unlock"' },
        { status: 400 },
      );
    }

    // Verify enrollment exists and get course ID
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, courseId: true },
    }) as any;
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Resolve the target lesson IDs
    let targetLessonIds: string[] = lessonIds ?? [];

    if (!targetLessonIds.length) {
      // Build query to find lessons
      const lessonWhere: any = {
        module: { courseId: enrollment.courseId },
      };
      if (moduleId) lessonWhere.moduleId = moduleId;

      const lessons = await prisma.lesson.findMany({
        where: lessonWhere,
        select: { id: true },
      }) as any[];
      targetLessonIds = lessons.map((l) => l.id);
    }

    if (!targetLessonIds.length) {
      return NextResponse.json({ success: true, data: { affectedCount: 0 } });
    }

    let affectedCount = 0;

    if (action === 'lock') {
      // createMany with skipDuplicates for idempotency
      const result = await prisma.lessonLock.createMany({
        data: targetLessonIds.map((lessonId) => ({
          enrollmentId,
          lessonId,
          lockedByAdmin,
        })),
        skipDuplicates: true,
      });
      affectedCount = result.count;
    } else {
      // Delete all matching locks
      const result = await prisma.lessonLock.deleteMany({
        where: {
          enrollmentId,
          lessonId: { in: targetLessonIds },
        },
      });
      affectedCount = result.count;
    }

    return NextResponse.json({
      success: true,
      data: { action, affectedCount, totalTargeted: targetLessonIds.length },
    });
  } catch (error) {
    console.error('Bulk lock error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to apply bulk lock action' },
      { status: 500 },
    );
  }
}

// GET /api/admin/enrollments/[id]/locks
// Returns all locked lesson IDs for this enrollment
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: enrollmentId } = await params;

    const locks = await prisma.lessonLock.findMany({
      where: { enrollmentId },
      select: {
        lessonId: true,
        lockedAt: true,
        lockedByAdmin: true,
        lesson: { select: { title: true, type: true } },
      },
      orderBy: { lockedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: locks });
  } catch (error) {
    console.error('Lock list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locks' },
      { status: 500 },
    );
  }
}
