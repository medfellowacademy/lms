import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/enrollments
// Query params: search, status, courseId, page, limit
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page    = parseInt(searchParams.get('page')   || '1');
    const limit   = parseInt(searchParams.get('limit')  || '20');
    const search  = searchParams.get('search')  || '';
    const status  = searchParams.get('status')  || 'all';
    const courseId = searchParams.get('courseId') || '';

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by enrollment status
    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Filter by course
    if (courseId) {
      where.courseId = courseId;
    }

    // Search by user name / email
    if (search) {
      where.user = {
        OR: [
          { email:     { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName:  { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [enrollmentsRaw, totalCount] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrolledAt: 'desc' },
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
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              category: true,
              difficulty: true,
              duration: true,
            },
          },
          lessonLocks: {
            select: { lessonId: true },
          },
        },
      }),
      prisma.enrollment.count({ where }),
    ]);
    
    const enrollments = enrollmentsRaw as any[];

    // Aggregate stats for the header strip
    const [active, paused, pending, completed] = await Promise.all([
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { status: 'PAUSED' } }),
      prisma.enrollment.count({ where: { status: 'PENDING' } }),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        enrollments: enrollments.map((e) => ({
          ...e,
          lockedLessonCount: e.lessonLocks.length,
        })),
        stats: { active, paused, pending, completed, total: totalCount },
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: page < Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error('Admin enrollments GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/enrollments
// Body: { ids: string[], status: EnrollmentStatus }
// Bulk-update enrollment status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body as { ids: string[]; status: string };

    if (!ids?.length || !status) {
      return NextResponse.json(
        { success: false, error: 'ids and status are required' },
        { status: 400 },
      );
    }

    const validStatuses = ['ACTIVE', 'PAUSED', 'CANCELLED', 'PENDING', 'COMPLETED', 'EXPIRED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 },
      );
    }

    const result = await prisma.enrollment.updateMany({
      where: { id: { in: ids } },
      data: { status: status.toUpperCase() as any },
    });

    return NextResponse.json({
      success: true,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    console.error('Admin enrollments PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update enrollments' },
      { status: 500 },
    );
  }
}

// POST /api/admin/enrollments
// Body: { userId, courseId, status?, adminNotes? }
// Manually enroll a doctor into a course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, status = 'ACTIVE', adminNotes } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'userId and courseId are required' },
        { status: 400 },
      );
    }

    // Check not already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User is already enrolled in this course' },
        { status: 400 },
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: status.toUpperCase(),
        adminNotes,
        paymentStatus: 'COMPLETED', // admin-granted = no payment needed
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        course: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    // Increment course enrollment counter
    await prisma.course.update({
      where: { id: courseId },
      data: { enrollmentCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error) {
    console.error('Admin enrollments POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create enrollment' },
      { status: 500 },
    );
  }
}
