import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/courses/enrolled - Get user's enrolled courses only
export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Get user's enrollments with course details
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: sessionUser.dbUser.id,
      },
      include: {
        course: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
              where: {
                isLocked: false, // Only show unlocked modules
              },
              include: {
                lessons: {
                  orderBy: { order: 'asc' },
                  where: {
                    isLocked: false, // Only show unlocked lessons
                    isPublished: true,
                  },
                },
              },
            },
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count
    const total = await db.enrollment.count({
      where: {
        userId: sessionUser.dbUser.id,
      },
    });

    // Transform to include enrollment data
    const courses = enrollments.map((enrollment: any) => ({
      ...enrollment.course,
      enrollment: {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        status: enrollment.status,
        lastAccessedAt: enrollment.lastAccessedAt,
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
