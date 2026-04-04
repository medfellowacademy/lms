import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/enrollments/[id]
// Full enrollment detail: user, course modules+lessons, lesson locks, progress
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            medicalTitle: true,
            specialty: true,
            institution: true,
            country: true,
            medicalLicense: true,
            isVerified: true,
          },
        },
        course: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    duration: true,
                    order: true,
                    videoUrl: true,
                  },
                },
              },
            },
          },
        },
        lessonLocks: {
          select: {
            lessonId: true,
            lockedAt: true,
            lockedByAdmin: true,
          },
        },
      },
    }) as any;

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Fetch lesson progress for this user + course lessons
    const lessonIds = enrollment.course.modules.flatMap((m: any) =>
      m.lessons.map((l: any) => l.id),
    );

    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId: enrollment.userId,
        lessonId: { in: lessonIds },
      },
      select: { lessonId: true, progress: true, completedAt: true, watchTime: true },
    }) as any[];

    const progressMap = Object.fromEntries(
      progressRecords.map((p) => [p.lessonId, p]),
    );

    const lockedSet = new Set(enrollment.lessonLocks.map((l: any) => l.lessonId));

    // Enrich module/lesson data
    const modules = enrollment.course.modules.map((mod: any) => ({
      id: mod.id,
      title: mod.title,
      order: mod.order,
      duration: mod.duration,
      lessons: mod.lessons.map((lesson: any) => ({
        ...lesson,
        isLocked: lockedSet.has(lesson.id),
        progress: progressMap[lesson.id]?.progress ?? 0,
        completedAt: progressMap[lesson.id]?.completedAt ?? null,
        watchTime: progressMap[lesson.id]?.watchTime ?? 0,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...enrollment,
        course: {
          ...enrollment.course,
          modules,
        },
        lockedLessonIds: [...lockedSet],
      },
    });
  } catch (error) {
    console.error('Admin enrollment GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollment' },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/enrollments/[id]
// Update enrollment status or admin notes
// Body: { status?, adminNotes? }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body as {
      status?: string;
      adminNotes?: string;
    };

    const validStatuses = ['ACTIVE', 'PAUSED', 'CANCELLED', 'PENDING', 'COMPLETED', 'EXPIRED'];

    const data: any = {};

    if (status !== undefined) {
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 },
        );
      }
      data.status = status.toUpperCase();
    }

    if (adminNotes !== undefined) {
      data.adminNotes = adminNotes;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data: enrollment });
  } catch (error) {
    console.error('Admin enrollment PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enrollment' },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/enrollments/[id]
// Hard-delete an enrollment (irreversible — use PATCH status=CANCELLED for soft)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const enrollment = await prisma.enrollment.findUnique({ where: { id } }) as any;
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    await prisma.enrollment.delete({ where: { id } });

    // Decrement course enrollment counter
    await prisma.course.update({
      where: { id: enrollment.courseId },
      data: { enrollmentCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin enrollment DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete enrollment' },
      { status: 500 },
    );
  }
}
