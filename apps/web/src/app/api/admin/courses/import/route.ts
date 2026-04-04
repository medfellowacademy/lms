import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/admin/courses/import - Import courses from JSON
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courses } = body;

    if (!courses || !Array.isArray(courses)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format' },
        { status: 400 }
      );
    }

    const imported = [];
    const errors = [];

    for (const courseData of courses) {
      try {
        // Generate unique slug if exists
        let slug = courseData.slug || generateSlug(courseData.title);
        const existingSlug = await prisma.course.findUnique({ where: { slug } });
        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
        }

        // Create course with modules and lessons
        const course = await prisma.course.create({
          data: {
            title: courseData.title,
            slug,
            description: courseData.description || '',
            shortDescription: courseData.shortDescription || '',
            category: courseData.category || 'Cardiology',
            difficulty: courseData.difficulty || 'BEGINNER',
            duration: courseData.duration || 0,
            price: courseData.price || 0,
            isFree: courseData.isFree ?? true,
            status: 'DRAFT', // Import as draft
            xpReward: courseData.xpReward || 100,
            prerequisites: courseData.prerequisites || [],
            learningOutcomes: courseData.learningOutcomes || [],
            targetAudience: courseData.targetAudience || [],
            instructorId: courseData.instructorId || 'admin-001',
            modules: courseData.modules
              ? {
                  create: courseData.modules.map((module: any, mIndex: number) => ({
                    title: module.title,
                    description: module.description || '',
                    order: module.order ?? mIndex,
                    duration: module.duration || 0,
                    lessons: module.lessons
                      ? {
                          create: module.lessons.map((lesson: any, lIndex: number) => ({
                            title: lesson.title,
                            description: lesson.description || '',
                            content: lesson.content || '',
                            type: lesson.type || 'VIDEO',
                            duration: lesson.duration || 10,
                            videoUrl: lesson.videoUrl,
                            videoProvider: lesson.videoProvider,
                            videoDuration: lesson.videoDuration,
                            xpReward: lesson.xpReward || 10,
                            order: lesson.order ?? lIndex,
                            resources: lesson.resources
                              ? {
                                  create: lesson.resources.map((resource: any) => ({
                                    title: resource.title,
                                    type: resource.type || 'LINK',
                                    url: resource.url,
                                    size: resource.size,
                                  })),
                                }
                              : undefined,
                          })),
                        }
                      : undefined,
                  })),
                }
              : undefined,
          },
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    resources: true,
                  },
                },
              },
            },
          },
        });

        imported.push(course);
      } catch (error) {
        errors.push({
          course: courseData.title,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        imported: imported.length,
        failed: errors.length,
        courses: imported,
        errors,
      },
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { success: false, error: 'Import failed' },
      { status: 500 }
    );
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

