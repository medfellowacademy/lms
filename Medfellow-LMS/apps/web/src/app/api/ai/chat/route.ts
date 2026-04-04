import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { streamChat, chat, AIMode, ChatMessage } from '@/lib/services/ai';
import { awardXP, XP_REWARDS } from '@/lib/services/gamification';

// POST /api/ai/chat - Chat with Dr. Nexus AI
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

    const {
      message,
      conversationId,
      mode = 'chat',
      stream = true,
      attachments = [],
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create conversation
    let conversation;
    let messages: ChatMessage[] = [];

    if (conversationId) {
      conversation = await db.aIConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Keep last 20 messages for context
          },
        },
      });

      if (conversation) {
        messages = (conversation as any)?.messages?.map((m: any) => ({
          role: m.role.toLowerCase() as 'user' | 'assistant' | 'system',
          content: m.content,
        }));
      }
    }

    if (!conversation) {
      conversation = await db.aIConversation.create({
        data: {
          userId,
          mode: mode.toUpperCase() as AIMode,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        },
      });
    }

    // Add user message to history
    messages.push({ role: 'user', content: message });

    // Save user message to database
    await db.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
        attachments,
      },
    });

    // Award XP for using AI tutor
    await awardXP(userId, XP_REWARDS.AI_CONVERSATION, 'AI Tutor conversation');

    if (stream) {
      // Create a ReadableStream for streaming response
      const encoder = new TextEncoder();
      let fullResponse = '';

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChat(messages, mode as AIMode)) {
              fullResponse += chunk;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }

            // Save assistant message after streaming complete
            await db.aIMessage.create({
              data: {
                conversationId: conversation!.id,
                role: 'ASSISTANT',
                content: fullResponse,
                model: 'gpt-4-turbo-preview',
              },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: conversation!.id })}\n\n`));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new NextResponse(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const response = await chat(messages, mode as AIMode);

      // Save assistant message
      await db.aIMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: response.content,
          tokensUsed: response.tokensUsed,
          model: response.model,
        },
      });

      return NextResponse.json({
        content: response.content,
        conversationId: conversation.id,
        tokensUsed: response.tokensUsed,
      });
    }
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/ai/chat - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser || !sessionUser.dbUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = sessionUser.dbUser.id;
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await db.aIConversation.findFirst({
        where: { id: conversationId, userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ conversation });
    }

    // Get all conversations
    const conversations = await db.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

