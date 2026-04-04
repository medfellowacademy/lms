import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/[id]/modules/[moduleId] - Get single module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const module = await prisma.module.findUnique({
      where: { id: resolvedParams.moduleId },
      include: {
        lessons: {
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
        },
      },
    });

    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: module,
    });
  } catch (error) {
    console.error('Get module error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/courses/[id]/modules/[moduleId] - Update module
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, description, order, duration } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;
    if (duration !== undefined) updateData.duration = duration;

    const module = await prisma.module.update({
      where: { id: resolvedParams.moduleId },
      data: updateData,
      include: {
        lessons: {
          include: { resources: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: module,
    });
  } catch (error) {
    console.error('Update module error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/courses/[id]/modules/[moduleId] - Delete module
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const resolvedParams = await params;
    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id: resolvedParams.moduleId },
      include: {
        lessons: {
          include: {
            _count: {
              select: { progress: true },
            },
          },
        },
      },
    });

    if (!existingModule) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    // Store the order before deletion
    const moduleOrder = (existingModule as any)?.order || 0;

    // Delete module (cascades to lessons)
    await prisma.module.delete({
      where: { id: resolvedParams.moduleId },
    });

    // Update remaining modules' order
    await prisma.module.updateMany({
      where: {
        courseId: resolvedParams.id,
        order: { gt: moduleOrder },
      },
      data: {
        order: { decrement: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error) {
    console.error('Delete module error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}

