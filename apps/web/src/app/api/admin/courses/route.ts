import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses - Get all courses with admin details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category !== 'all') {
      where.category = category;
    }

    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Get courses with stats
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          modules: {
            include: {
              lessons: true,
            },
          },
          enrollments: {
            select: {
              id: true,
              status: true,
              progress: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.course.count({ where }),
    ]);

    // Transform courses with calculated stats
    const coursesWithStats = courses.map((course: any) => {
      const totalLessons = course.modules.reduce(
        (acc: number, mod: any) => acc + mod.lessons.length,
        0
      );
      const avgRating =
        course.reviews.length > 0
          ? course.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) /
            course.reviews.length
          : 0;
      const completedEnrollments = course.enrollments.filter(
        (e: any) => e.status === 'COMPLETED'
      ).length;
      const revenue = course.enrollments.length * course.price;

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        difficulty: course.difficulty,
        status: course.status,
        price: course.price,
        duration: course.duration,
        instructorId: course.instructorId,
        xpReward: course.xpReward,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        publishedAt: course.publishedAt,
        stats: {
          modules: course.modules.length,
          lessons: totalLessons,
          enrollments: course._count.enrollments,
          completions: completedEnrollments,
          completionRate:
            course._count.enrollments > 0
              ? ((completedEnrollments / course._count.enrollments) * 100).toFixed(1)
              : 0,
          avgRating: avgRating.toFixed(1),
          reviewCount: course._count.reviews,
          revenue,
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        courses: coursesWithStats,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Admin courses error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      difficulty = 'BEGINNER',
      instructorId,
      xpReward = 100,
      modules = [],
    } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await prisma.course.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Create course + modules + lessons in one transaction
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || '',
        category: 'General',
        difficulty: difficulty.toUpperCase(),
        price: 0,
        duration: 0,
        instructorId: instructorId || 'system',
        prerequisites: [],
        learningOutcomes: [],
        targetAudience: [],
        xpReward,
        status: 'DRAFT',
        modules: modules.length > 0 ? {
          create: modules.map((mod: any, mi: number) => ({
            title: mod.title || `Module ${mi + 1}`,
            description: mod.description || '',
            order: mod.order ?? mi,
            lessons: mod.lessons?.length > 0 ? {
              create: mod.lessons.map((lesson: any, li: number) => ({
                title: lesson.title || `Lesson ${li + 1}`,
                description: lesson.description || '',
                order: lesson.order ?? li,
                type: lesson.contentTypes?.includes('VIDEO') ? 'VIDEO'
                  : lesson.contentTypes?.includes('PPT') ? 'TEXT'
                  : lesson.contentTypes?.includes('EBOOK') ? 'TEXT'
                  : 'TEXT',
                videoUrl: lesson.videoUrl || null,
                content: lesson.pptUrl || lesson.ebookUrl || lesson.textContent || null,
                duration: 0,
                xpReward: 10,
              })),
            } : undefined,
          })),
        } : undefined,
      },
      include: {
        modules: { include: { lessons: true } },
      },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

