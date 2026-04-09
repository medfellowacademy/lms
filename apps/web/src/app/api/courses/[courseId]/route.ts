import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/courses/[courseId] - Get course details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const sessionUser = await getCurrentUser();

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                resources: true,
              },
            },
          },
        },
        tags: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is enrolled
    let enrollment = null;
    let progress: Record<string, unknown>[] = [];
    const isAdmin = sessionUser?.role && ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(sessionUser.role);

    if (sessionUser?.dbUser) {
      enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: sessionUser.dbUser.id,
            courseId,
          },
        },
      });

      if (enrollment) {
        // Get lesson progress
        const lessonIds = (course as any)?.modules?.flatMap((m: any) => m.lessons?.map((l: any) => l.id)) || [];
        progress = await db.lessonProgress.findMany({
          where: {
            userId: sessionUser.dbUser.id,
            lessonId: { in: lessonIds },
          },
        }) as any;
      }
    }

    // Filter locked content for non-admin users
    let filteredCourse = course;
    if (!isAdmin) {
      filteredCourse = {
        ...course,
        modules: (course as any)?.modules?.map((module: any) => {
          // If module is locked, hide all lessons
          if (module.isLocked) {
            return {
              ...module,
              lessons: [],
              isLocked: true,
            };
          }

          // Filter out locked lessons
          return {
            ...module,
            lessons: module.lessons?.filter((lesson: any) => !lesson.isLocked && lesson.isPublished),
          };
        }),
      };
    }

    return NextResponse.json({
      course: filteredCourse,
      enrollment,
      progress,
      isEnrolled: !!enrollment,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/[courseId] - Update course (instructor only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (
      (course as any)?.instructorId !== sessionUser.dbUser.id &&
      !['ADMIN', 'SUPER_ADMIN'].includes(sessionUser.role)
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: body,
    });

    return NextResponse.json({ course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(sessionUser.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

