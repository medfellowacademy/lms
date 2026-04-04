import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/[id]/modules/[moduleId]/lessons - Get all lessons
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const resolvedParams = await params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { moduleId: resolvedParams.moduleId },
      include: {
        resources: true,
        quizzes: {
          include: {
            questions: {
              include: { options: true },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses/[id]/modules/[moduleId]/lessons - Create a new lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      type,
      duration,
      videoUrl,
      videoProvider,
      videoDuration,
      xpReward,
      order,
      resources,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Lesson title is required' },
        { status: 400 }
      );
    }

    // Get the highest order number for this module
    const maxOrder = await prisma.lesson.findFirst({
      where: { moduleId: resolvedParams.moduleId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const lessonOrder = order ?? ((maxOrder as any)?.order ?? -1) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || '',
        content: content || '',
        type: type || 'VIDEO',
        duration: duration || 10,
        videoUrl: videoUrl || null,
        videoProvider: videoProvider || null,
        videoDuration: videoDuration || null,
        xpReward: xpReward || 10,
        order: lessonOrder,
        moduleId: resolvedParams.moduleId,
        resources: resources?.length
          ? {
              create: resources.map((r: { title: string; type: string; url: string; size?: number }) => ({
                title: r.title,
                type: r.type,
                url: r.url,
                size: r.size,
              })),
            }
          : undefined,
      },
      include: {
        resources: true,
      },
    });

    // Update module duration
    await updateModuleDuration(resolvedParams.moduleId);

    return NextResponse.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/courses/[id]/modules/[moduleId]/lessons - Reorder lessons
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { lessons } = body; // Array of { id, order }

    if (!lessons || !Array.isArray(lessons)) {
      return NextResponse.json(
        { success: false, error: 'Lessons array is required' },
        { status: 400 }
      );
    }

    // Update each lesson's order
    await Promise.all(
      lessons.map((l: { id: string; order: number }) =>
        prisma.lesson.update({
          where: { id: l.id },
          data: { order: l.order },
        })
      )
    );

    // Fetch updated lessons
    const updatedLessons = await prisma.lesson.findMany({
      where: { moduleId: resolvedParams.moduleId },
      include: { resources: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: updatedLessons,
    });
  } catch (error) {
    console.error('Reorder lessons error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder lessons' },
      { status: 500 }
    );
  }
}

// Helper function to update module duration
async function updateModuleDuration(moduleId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    select: { duration: true },
  });

  const totalDuration = (lessons as any[]).reduce((sum, l) => sum + l.duration, 0);

  await prisma.module.update({
    where: { id: moduleId },
    data: { duration: totalDuration },
  });
}

