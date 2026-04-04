import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, properties, userId, sessionId, timestamp, url } = body;

    // Store analytics event in database
    await prisma.analyticsEvent.create({
      data: {
        userId: userId || null,
        sessionId: sessionId || 'anonymous',
        event: name,
        properties: JSON.stringify(properties || {}),
        page: url,
        userAgent: request.headers.get('user-agent') || null,
        createdAt: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request, analytics should be non-blocking
    return NextResponse.json({ success: true });
  }
}

