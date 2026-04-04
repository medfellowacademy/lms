import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/certificates - Get user's certificates
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;

    const certificates = await db.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Issue a new certificate
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;
    const body = await request.json();

    const { courseId, examScore } = body;

    // Verify course completion
    if (courseId) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId },
        },
        include: {
          course: true,
        },
      });

      if (!enrollment || (enrollment as any)?.status !== 'COMPLETED') {
        return NextResponse.json(
          { error: 'Course not completed' },
          { status: 400 }
        );
      }

      // Check if certificate already exists
      const existingCert = await db.certificate.findFirst({
        where: { userId, courseId },
      });

      if (existingCert) {
        return NextResponse.json(
          { error: 'Certificate already issued', certificate: existingCert },
          { status: 400 }
        );
      }

      // Create certificate
      const certificate = await db.certificate.create({
        data: {
          userId,
          title: `${(enrollment as any)?.course?.title || 'Course'} Certification`,
          description: `Successfully completed the ${(enrollment as any)?.course?.title || 'Course'} program`,
          courseId,
          examScore,
          skills: (enrollment as any)?.course?.learningOutcomes || [],
          recognizedIn: ['USA'], // Default, can be expanded
        },
      });

      // Create notification
      await db.notification.create({
        data: {
          userId,
          type: 'CERTIFICATE',
          title: 'Certificate Issued! 🏆',
          message: `Your ${(enrollment as any)?.course?.title || 'course'} certificate is ready!`,
          actionUrl: `/dashboard/certificates`,
        },
      });

      return NextResponse.json({ certificate }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Course ID is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

