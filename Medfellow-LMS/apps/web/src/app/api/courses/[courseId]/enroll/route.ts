import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { awardXP, XP_REWARDS } from '@/lib/services/gamification';

// POST /api/courses/[courseId]/enroll - Enroll in a course
export async function POST(
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

    const userId = sessionUser.dbUser.id;

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // For paid courses, check payment (simplified - would integrate with Stripe)
    const body = await request.json().catch(() => ({}));
    const paymentStatus = (course as any)?.isFree ? 'COMPLETED' : 'PENDING';

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        paymentStatus,
        paidAmount: (course as any)?.isFree ? 0 : (course as any)?.price || 0,
        lastAccessedAt: new Date(),
      },
    });

    // Update course enrollment count
    await db.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    // Award XP for enrolling
    await awardXP(userId, 10, `Enrolled in ${(course as any)?.title || 'course'}`);

    // Create notification
    await db.notification.create({
      data: {
        userId,
        type: 'COURSE',
        title: 'Course Enrolled! 📚',
        message: `You've enrolled in ${(course as any)?.title}. Start learning now!`,
        actionUrl: `/dashboard/courses/${courseId}`,
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/enroll - Unenroll from a course
export async function DELETE(
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

    const userId = sessionUser.dbUser.id;

    // Check if enrolled
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 400 }
      );
    }

    // Delete enrollment
    await db.enrollment.delete({
      where: { id: (enrollment as any)?.id },
    });

    // Update course enrollment count
    await db.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

