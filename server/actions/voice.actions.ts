'use server';

import { getVAPIClient } from '@/lib/vapi-client';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Start a voice assistant session
export async function startVoiceAssistant(assistantId: string) {
  const vapiClient = getVAPIClient();
  
  const response = await vapiClient.startAssistant(assistantId);
  
  if (!response.success) {
    return { success: false, error: response.message };
  }
  
  return { success: true, sessionId: response.sessionId };
}

// Send a message to the voice assistant
export async function sendVoiceMessage(sessionId: string, message: string) {
  const vapiClient = getVAPIClient();
  
  const response = await vapiClient.sendMessage(sessionId, message);
  
  if (!response.success) {
    return { success: false, error: response.response };
  }
  
  return { success: true, response: response.response };
}

// End a voice assistant session
export async function endVoiceAssistant(sessionId: string) {
  const vapiClient = getVAPIClient();
  
  const response = await vapiClient.endAssistant(sessionId);
  
  if (!response.success) {
    return { success: false, error: response.message };
  }
  
  return { success: true };
}

// Create a voice message
export async function createVoiceMessage(recipientId: string, senderId: string, content: string, audioUrl?: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('voice_messages')
    .insert({
      recipient_id: recipientId,
      sender_id: senderId,
      content,
      audio_url: audioUrl,
      is_read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating voice message:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Get user's voice messages
export async function getUserVoiceMessages(userId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('voice_messages')
    .select(`
      *,
      sender:profiles!voice_messages_sender_id_fkey(name, username, avatar_url),
      recipient:profiles!voice_messages_recipient_id_fkey(name, username, avatar_url)
    `)
    .or(`recipient_id.eq.${userId},sender_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching voice messages:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Mark voice message as read
export async function markVoiceMessageAsRead(messageId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('voice_messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single();
  
  if (error) {
    console.error('Error marking voice message as read:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Delete a voice message
export async function deleteVoiceMessage(messageId: string) {
  const supabase = createServerSupabaseClient();
  
  const { error } = await supabase
    .from('voice_messages')
    .delete()
    .eq('id', messageId);
  
  if (error) {
    console.error('Error deleting voice message:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}