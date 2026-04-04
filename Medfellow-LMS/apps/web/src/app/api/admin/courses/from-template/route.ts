import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTemplateById, templateToCourseData } from '@/lib/course-templates';

// POST /api/admin/courses/from-template - Create course from template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, title, instructorId, price, isFree } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Get template
    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Convert template to course data
    const courseData = templateToCourseData(template, {
      title,
      instructorId,
      price,
      isFree,
    });

    // Generate slug
    const slug = (title || template.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    let finalSlug = slug;
    const existingSlug = await prisma.course.findUnique({ where: { slug } });
    if (existingSlug) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    // Create course with modules and lessons
    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: finalSlug,
        description: courseData.description,
        shortDescription: template.description.substring(0, 150),
        category: courseData.category,
        difficulty: courseData.difficulty,
        duration: courseData.duration,
        price: price || 0,
        isFree: isFree ?? true,
        status: 'DRAFT',
        xpReward: Math.ceil(courseData.duration / 10), // 1 XP per 10 minutes
        instructorId: instructorId || 'admin-001',
        modules: {
          create: courseData.modules.map((module: any) => ({
            title: module.title,
            description: module.description,
            order: module.order,
            duration: module.lessons.reduce(
              (sum: number, l: any) => sum + l.duration,
              0
            ),
            lessons: {
              create: module.lessons.map((lesson: any) => ({
                title: lesson.title,
                description: lesson.description,
                content: lesson.content,
                type: lesson.type,
                duration: lesson.duration,
                xpReward: lesson.xpReward,
                order: lesson.order,
              })),
            },
          })),
        },
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Track template usage (you could create a TemplateUsage model)
    console.log(`Template ${templateId} used to create course ${course.id}`);

    return NextResponse.json({
      success: true,
      data: course,
      message: 'Course created from template successfully',
    });
  } catch (error) {
    console.error('Create from template error:', error);
    return NextResponse.json(
      { error: 'Failed to create course from template' },
      { status: 500 }
    );
  }
}

