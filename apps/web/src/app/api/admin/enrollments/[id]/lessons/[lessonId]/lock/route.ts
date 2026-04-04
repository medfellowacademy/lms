import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { id: string; lessonId: string };

// POST /api/admin/enrollments/[id]/lessons/[lessonId]/lock
// Lock a specific lesson for this enrollment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id: enrollmentId, lessonId } = await params;
    const body = await request.json().catch(() => ({}));
    const { lockedByAdmin } = body as { lockedByAdmin?: string };

    // Verify enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, userId: true },
    });
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Upsert the lock record (idempotent)
    const lock = await prisma.lessonLock.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
      create: { enrollmentId, lessonId, lockedByAdmin },
      update: { lockedAt: new Date(), lockedByAdmin },
    });

    return NextResponse.json({ success: true, data: lock }, { status: 201 });
  } catch (error) {
    console.error('Lock lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to lock lesson' },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/enrollments/[id]/lessons/[lessonId]/lock
// Unlock a specific lesson for this enrollment
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id: enrollmentId, lessonId } = await params;

    const existing = await prisma.lessonLock.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    });

    if (!existing) {
      // Already unlocked — return 200 (idempotent)
      return NextResponse.json({ success: true, data: null });
    }

    await prisma.lessonLock.delete({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Unlock lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlock lesson' },
      { status: 500 },
    );
  }
}

// GET /api/admin/enrollments/[id]/lessons/[lessonId]/lock
// Check if a lesson is locked for this enrollment
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id: enrollmentId, lessonId } = await params;

    const lock = await prisma.lessonLock.findUnique({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    });

    return NextResponse.json({
      success: true,
      data: { isLocked: !!lock, lock: lock ?? null },
    });
  } catch (error) {
    console.error('Lock status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check lock status' },
      { status: 500 },
    );
  }
}
