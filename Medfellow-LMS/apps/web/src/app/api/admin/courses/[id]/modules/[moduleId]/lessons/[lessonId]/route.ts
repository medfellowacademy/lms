import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  const resolvedParams = await params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.lessonId },
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
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
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

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (type !== undefined) updateData.type = type;
    if (duration !== undefined) updateData.duration = duration;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (videoProvider !== undefined) updateData.videoProvider = videoProvider;
    if (videoDuration !== undefined) updateData.videoDuration = videoDuration;
    if (xpReward !== undefined) updateData.xpReward = xpReward;
    if (order !== undefined) updateData.order = order;

    const lesson = await prisma.lesson.update({
      where: { id: resolvedParams.lessonId },
      data: updateData,
      include: {
        resources: true,
      },
    });

    // Handle resources update
    if (resources !== undefined) {
      // Delete existing resources
      await prisma.resource.deleteMany({
        where: { lessonId: resolvedParams.lessonId },
      });

      // Create new resources
      if (resources.length > 0) {
        await prisma.resource.createMany({
          data: resources.map((r: { title: string; type: string; url: string; size?: number }) => ({
            title: r.title,
            type: r.type as 'PDF' | 'IMAGE' | 'DOCUMENT' | 'LINK' | 'DOWNLOAD',
            url: r.url,
            size: r.size,
            lessonId: resolvedParams.lessonId,
          })),
        });
      }
    }

    // Update module duration if duration changed
    if (duration !== undefined) {
      await updateModuleDuration(resolvedParams.moduleId);
    }

    // Fetch updated lesson with resources
    const updatedLesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.lessonId },
      include: { resources: true },
    });

    return NextResponse.json({
      success: true,
      data: updatedLesson,
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[id]/modules/[moduleId]/lessons/[lessonId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; lessonId: string }> }
) {
  const resolvedParams = await params;
  try {
    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: resolvedParams.lessonId },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Store the order before deletion
    const lessonOrder = (existingLesson as any)?.order || 0;

    // Delete lesson (cascades to resources)
    await prisma.lesson.delete({
      where: { id: resolvedParams.lessonId },
    });

    // Update remaining lessons' order
    await prisma.lesson.updateMany({
      where: {
        moduleId: resolvedParams.moduleId,
        order: { gt: lessonOrder },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    // Update module duration
    await updateModuleDuration(resolvedParams.moduleId);

    return NextResponse.json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lesson' },
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

