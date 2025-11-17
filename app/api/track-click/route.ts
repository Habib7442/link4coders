import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  console.log('🟢 [API] Track click endpoint called');
  
  try {
    const { linkId } = await request.json();
    console.log('🟢 [API] Received linkId:', linkId);

    if (!linkId) {
      console.error('❌ [API] No linkId provided');
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    console.log('🟢 [API] Supabase client created');

    // Increment click count
    console.log('🟢 [API] Calling increment_link_clicks RPC with:', { p_link_id: linkId });
    
    const { data, error } = await supabase.rpc('increment_link_clicks', {
      p_link_id: linkId
    });

    if (error) {
      console.error('❌ [API] Error tracking click:', error);
      return NextResponse.json(
        { error: 'Failed to track click', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ [API] Click tracked successfully, RPC result:', data);
    return NextResponse.json({ success: true, linkId });
  } catch (error) {
    console.error('❌ [API] Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
