import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/[id] - Get single course details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizzes: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
              },
            },
          },
          take: 10,
          orderBy: { enrolledAt: 'desc' },
        },
        reviews: {
          include: {
            course: true,
          },
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
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      thumbnail,
      category,
      difficulty,
      price,
      duration,
      status,
      prerequisites,
      learningOutcomes,
      targetAudience,
      xpReward,
    } = body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
      // Update slug if title changes
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty.toUpperCase();
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (status !== undefined) {
      updateData.status = status.toUpperCase();
      // Set publishedAt if publishing
      if (status.toUpperCase() === 'PUBLISHED' && !(existingCourse as any)?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites;
    if (learningOutcomes !== undefined) updateData.learningOutcomes = learningOutcomes;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (xpReward !== undefined) updateData.xpReward = xpReward;

    // Update course
    const course = await prisma.course.update({
      where: { id: resolvedParams.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Warn if course has enrollments
    if ((existingCourse as any)?._count?.enrollments > 0) {
      // Soft delete - archive instead of hard delete
      const course = await prisma.course.update({
        where: { id: resolvedParams.id },
        data: { status: 'ARCHIVED' },
      });

      return NextResponse.json({
        success: true,
        data: course,
        message: 'Course archived (has active enrollments)',
      });
    }

    // Hard delete if no enrollments
    await prisma.course.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}

