import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/courses/export - Export courses to JSON
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseIds = searchParams.get('ids')?.split(',') || [];
    const exportAll = searchParams.get('all') === 'true';

    // Build query
    const where = exportAll
      ? {}
      : courseIds.length > 0
      ? { id: { in: courseIds } }
      : { status: 'PUBLISHED' }; // Default: export published courses

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizzes: {
                  include: {
                    questions: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Clean up data for export (remove IDs, timestamps, etc.)
    const exportData = (courses as any[]).map((course) => ({
      // Basic info
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDescription: course.shortDescription,
      thumbnail: course.thumbnail,
      previewVideo: course.previewVideo,
      
      // Categorization
      category: course.category,
      subcategory: course.subcategory,
      difficulty: course.difficulty,
      
      // Pricing
      price: course.price,
      currency: course.currency,
      isFree: course.isFree,
      
      // Content
      duration: course.duration,
      language: course.language,
      prerequisites: course.prerequisites,
      learningOutcomes: course.learningOutcomes,
      targetAudience: course.targetAudience,
      
      // Gamification
      xpReward: course.xpReward,
      
      // Instructor info
      instructorId: course.instructorId,
      instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
      
      // Modules
      modules: course.modules.map((module: any) => ({
        title: module.title,
        description: module.description,
        order: module.order,
        duration: module.duration,
        lessons: module.lessons.map((lesson: any) => ({
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          type: lesson.type,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          videoProvider: lesson.videoProvider,
          videoDuration: lesson.videoDuration,
          xpReward: lesson.xpReward,
          order: lesson.order,
          resources: lesson.resources.map((resource: any) => ({
            title: resource.title,
            type: resource.type,
            url: resource.url,
            size: resource.size,
          })),
          quizzes: lesson.quizzes.map((quiz: any) => ({
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            shuffleQuestions: quiz.shuffleQuestions,
            showResults: quiz.showResults,
            type: quiz.type,
            difficulty: quiz.difficulty,
            questions: quiz.questions.map((question: any) => ({
              question: question.question,
              explanation: question.explanation,
              hint: question.hint,
              type: question.type,
              difficulty: question.difficulty,
              imageUrl: question.imageUrl,
              points: question.points,
              topic: question.topic,
              subtopic: question.subtopic,
              options: question.options.map((option: any) => ({
                text: option.text,
                isCorrect: option.isCorrect,
                order: option.order,
              })),
            })),
          })),
        })),
      })),
      
      // Export metadata
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
    }));

    // Return as JSON file download
    const filename = `medfellow-courses-export-${Date.now()}.json`;
    
    return new NextResponse(JSON.stringify({ courses: exportData }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}

