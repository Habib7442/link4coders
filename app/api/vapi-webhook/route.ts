import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different VAPI webhook events
    const { type, call, metadata } = body;
    
    console.log('VAPI Webhook:', type, metadata);

    if (type === 'end-of-call-report') {
      // Track conversation when call ends
      const userId = metadata?.userId;
      const duration = call?.duration || 0;
      const cost = call?.cost || 0;
      
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const supabase = await createServerSupabaseClient();

      // Insert conversation record
      await supabase.from('ai_voice_conversations').insert({
        user_id: userId,
        conversation_id: call?.id || `call_${Date.now()}`,
        duration_seconds: Math.floor(duration),
        cost: cost,
        transcript: call?.transcript || null,
        metadata: {
          started_at: call?.startedAt,
          ended_at: call?.endedAt,
          status: call?.status
        }
      });

      // Increment conversations_used counter
      await supabase.rpc('increment_conversations_used', {
        p_user_id: userId,
        p_feature_type: 'voice_assistant'
      });

      console.log('Conversation tracked:', userId, duration, cost);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('VAPI webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
