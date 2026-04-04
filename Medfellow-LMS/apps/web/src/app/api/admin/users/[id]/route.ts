import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/users/[id] - Get single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                category: true,
              },
            },
          },
          take: 10,
          orderBy: { enrolledAt: 'desc' },
        },
        certificates: {
          take: 10,
          orderBy: { issuedAt: 'desc' },
        },
        achievements: {
          include: {
            achievement: true,
          },
          where: {
            unlockedAt: { not: null },
          },
          take: 10,
          orderBy: { unlockedAt: 'desc' },
        },
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            achievements: true,
            aiConversations: true,
            vrSessions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      role,
      isVerified,
      isActive,
      medicalTitle,
      specialty,
      institution,
      country,
      level,
      xp,
      rank,
    } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role.toUpperCase();
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (medicalTitle !== undefined) updateData.medicalTitle = medicalTitle;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (institution !== undefined) updateData.institution = institution;
    if (country !== undefined) updateData.country = country;
    if (level !== undefined) updateData.level = level;
    if (xp !== undefined) updateData.xp = xp;
    if (rank !== undefined) updateData.rank = rank;

    // Update user
    const user = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete - deactivate instead of hard delete
    const user = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

