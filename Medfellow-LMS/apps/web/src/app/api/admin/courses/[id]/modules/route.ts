import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/[id]/modules - Get all modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const modules = await prisma.module.findMany({
      where: { courseId: resolvedParams.id },
      include: {
        lessons: {
          include: {
            resources: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.error('Get modules error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST /api/admin/courses/[id]/modules - Create a new module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, description, order } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Module title is required' },
        { status: 400 }
      );
    }

    // Get the highest order number for this course
    const maxOrder = await prisma.module.findFirst({
      where: { courseId: resolvedParams.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const moduleOrder = order ?? ((maxOrder as any)?.order ?? -1) + 1;

    const module = await prisma.module.create({
      data: {
        title,
        description: description || '',
        order: moduleOrder,
        courseId: resolvedParams.id,
      },
      include: {
        lessons: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: module,
    });
  } catch (error) {
    console.error('Create module error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/courses/[id]/modules - Reorder modules
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { modules } = body; // Array of { id, order }

    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json(
        { success: false, error: 'Modules array is required' },
        { status: 400 }
      );
    }

    // Update each module's order
    await Promise.all(
      modules.map((m: { id: string; order: number }) =>
        prisma.module.update({
          where: { id: m.id },
          data: { order: m.order },
        })
      )
    );

    // Fetch updated modules
    const updatedModules = await prisma.module.findMany({
      where: { courseId: resolvedParams.id },
      include: {
        lessons: {
          include: { resources: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: updatedModules,
    });
  } catch (error) {
    console.error('Reorder modules error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder modules' },
      { status: 500 }
    );
  }
}

