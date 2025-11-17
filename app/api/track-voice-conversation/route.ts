import { NextRequest, NextResponse } from 'next/server';
import { trackConversation } from '@/server/actions/ai-voice.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, conversationId, duration, cost, transcript } = body;

    if (!userId || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await trackConversation(userId, {
      conversation_id: conversationId,
      duration_seconds: duration || 0,
      cost: cost || 0,
      transcript: transcript || undefined
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversation' },
      { status: 500 }
    );
  }
}
