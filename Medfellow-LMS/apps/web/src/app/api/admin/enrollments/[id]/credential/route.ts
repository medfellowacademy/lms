import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Generates a credential ID in the format MF-CERT-XX-YYYY-NNN
function generateCredentialId(specialty: string, year: number, sequence: number): string {
  const tag = (specialty ?? 'GEN').slice(0, 2).toUpperCase();
  const seq = String(sequence).padStart(3, '0');
  return `MF-CERT-${tag}-${year}-${seq}`;
}

// POST /api/admin/enrollments/[id]/credential
// Issues a certificate for the given enrollment.
// Body: { issuedByAdminId?, skills?, expiresAt?, forceIssue? }
//   forceIssue=true bypasses the 80% completion check.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { issuedByAdminId, skills = [], expiresAt, forceIssue = false } = body as {
      issuedByAdminId?: string;
      skills?: string[];
      expiresAt?: string;
      forceIssue?: boolean;
    };

    // Load enrollment with user + course
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
        course: {
          select: { id: true, title: true, category: true },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    // Progress guard (80% minimum unless admin forces)
    if (!forceIssue && (enrollment as any).progress < 80) {
      return NextResponse.json(
        {
          success: false,
          error: `Doctor has only completed ${(enrollment as any).progress.toFixed(0)}% of the course. Minimum 80% required. Pass forceIssue=true to override.`,
          progress: (enrollment as any).progress,
        },
        { status: 422 },
      );
    }

    // Check if a certificate already exists for this user + course
    const existing = await prisma.certificate.findFirst({
      where: {
        userId: (enrollment as any).userId,
        courseId: (enrollment as any).courseId,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'A certificate for this course has already been issued.',
          certificate: existing,
        },
        { status: 409 },
      );
    }

    // Determine sequence number for the credential ID
    const year = new Date().getFullYear();
    const certCount = await prisma.certificate.count({
      where: { issuedAt: { gte: new Date(`${year}-01-01`) } },
    });

    const credentialId = generateCredentialId(
      (enrollment as any).user.specialty ?? (enrollment as any).course.category,
      year,
      certCount + 1,
    );

    // Build certificate title
    const userName =
      [(enrollment as any).user.firstName, (enrollment as any).user.lastName].filter(Boolean).join(' ') ||
      (enrollment as any).user.email;
    const certificateTitle = `Certificate of Completion — ${(enrollment as any).course.title}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: (enrollment as any).userId,
        courseId: (enrollment as any).courseId,
        title: certificateTitle,
        description: `Awarded to ${userName} for successfully completing ${(enrollment as any).course.title} on MedFellow Academy.`,
        issuer: 'MedFellow Academy',
        verificationId: credentialId,
        issuedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        skills: skills.length ? skills : [(enrollment as any).course.category],
        recognizedIn: [],
      },
    });

    // Mark enrollment as COMPLETED if not already
    if ((enrollment as any).status !== 'COMPLETED') {
      await prisma.enrollment.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    // Send in-app notification to doctor
    await prisma.notification.create({
      data: {
        userId: (enrollment as any).userId,
        type: 'CERTIFICATE',
        title: 'Certificate Issued!',
        message: `Your certificate for "${(enrollment as any).course.title}" has been issued. Credential ID: ${credentialId}`,
        actionUrl: `/dashboard/credentials`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          certificate,
          credentialId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Credential issue error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to issue credential' },
      { status: 500 },
    );
  }
}

// GET /api/admin/enrollments/[id]/credential
// Returns the certificate issued for this enrollment (if any)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      select: { userId: true, courseId: true },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 },
      );
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        userId: (enrollment as any).userId,
        courseId: (enrollment as any).courseId,
      },
    });

    return NextResponse.json({ success: true, data: certificate ?? null });
  } catch (error) {
    console.error('Credential GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch credential' },
      { status: 500 },
    );
  }
}
