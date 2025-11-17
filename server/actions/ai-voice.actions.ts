'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { createVapiAssistant, updateVapiAssistant as updateVapiAssistantAPI } from '@/lib/vapi-api';

// Check if user has access to voice assistant feature
export async function checkVoiceAssistantAccess(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check for active subscription or trial
    const { data: subscription } = await supabase
      .from('ai_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_type', 'voice_assistant')
      .single();

    if (!subscription) {
      return { 
        hasAccess: false, 
        canStartTrial: true,
        conversationsUsed: 0,
        conversationsLimit: 0
      };
    }

    // Check if trial is active
    if (subscription.status === 'trial' && subscription.trial_end_date) {
      const trialEnd = new Date(subscription.trial_end_date);
      const now = new Date();
      
      if (now <= trialEnd) {
        return {
          hasAccess: true,
          isTrial: true,
          canStartTrial: false,
          daysLeft: Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          conversationsUsed: subscription.conversations_used || 0,
          conversationsLimit: subscription.conversations_limit || 50
        };
      }
    }

    // Check if subscription is active
    if (subscription.status === 'active' && subscription.subscription_end_date) {
      const subEnd = new Date(subscription.subscription_end_date);
      const now = new Date();
      
      if (now <= subEnd) {
        return {
          hasAccess: true,
          isTrial: false,
          canStartTrial: false,
          conversationsUsed: subscription.conversations_used || 0,
          conversationsLimit: subscription.conversations_limit || 999999
        };
      }
    }

    return { 
      hasAccess: false, 
      canStartTrial: false,
      conversationsUsed: subscription.conversations_used || 0,
      conversationsLimit: subscription.conversations_limit || 0
    };
  } catch (error) {
    console.error('Error checking voice assistant access:', error);
    return { hasAccess: false, canStartTrial: true, conversationsUsed: 0, conversationsLimit: 0 };
  }
}

// Start 7-day free trial
export async function startVoiceAssistantTrial(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if trial already exists
    const { data: existing } = await supabase
      .from('ai_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('feature_type', 'voice_assistant')
      .single();

    if (existing) {
      return { 
        success: false, 
        error: 'You have already used your free trial for voice assistant' 
      };
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const { error } = await supabase
      .from('ai_subscriptions')
      .insert({
        user_id: userId,
        feature_type: 'voice_assistant',
        status: 'trial',
        trial_start_date: now.toISOString(),
        trial_end_date: trialEnd.toISOString(),
        conversations_used: 0,
        conversations_limit: 50 // 50 conversations during trial
      });

    if (error) {
      console.error('Error starting trial:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/ai-management');
    return { 
      success: true, 
      message: '7-day free trial started! You have 50 conversations to try the voice assistant.' 
    };
  } catch (error) {
    console.error('Error starting trial:', error);
    return { success: false, error: 'Failed to start trial' };
  }
}

// Get or create voice assistant configuration
export async function getVoiceAssistant(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: assistant } = await supabase
      .from('ai_voice_assistants')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (assistant) {
      return { success: true, data: assistant };
    }

    // Get user data for default system prompt
    const { data: user } = await supabase
      .from('users')
      .select('full_name, profile_title, bio, github_username')
      .eq('id', userId)
      .single();

    const defaultSystemPrompt = `You are an AI assistant for ${user?.full_name || 'a developer'}'s portfolio. 
${user?.profile_title ? `They are a ${user.profile_title}.` : ''}
${user?.bio ? `About them: ${user.bio}` : ''}

Answer questions about their skills, projects, and experience based on their portfolio data.
Be friendly, professional, and helpful. Keep responses concise and relevant.

When visitors ask about projects:
- Ask them to share more details about specific projects they're interested in
- Encourage them to describe what tech stack they used
- Inquire about challenges they faced and how they solved them
- Ask about the impact or results of their projects
- Request information about their role and responsibilities
- Encourage them to share links to live demos, GitHub repos, or case studies

Always be curious and help visitors provide comprehensive information about their work!`;

    const firstMessage = `Hi! I'm ${user?.full_name || 'the'} portfolio assistant. Ask me anything about their skills, projects, or experience!`;

    // Create VAPI assistant via API
    const vapiResult = await createVapiAssistant({
      name: `${user?.full_name || 'Portfolio'} Assistant`,
      systemPrompt: defaultSystemPrompt,
      firstMessage,
      voiceProvider: 'openai',
      voiceId: 'alloy',
      model: 'gpt-4o-mini',
      temperature: 0.7
    });

    if (!vapiResult.success) {
      console.error('Failed to create VAPI assistant:', vapiResult.error);
      // Fallback: create with temporary ID
      const tempAssistantId = `temp_${userId.slice(0, 8)}`;
      
      const { data: newAssistant, error } = await supabase
        .from('ai_voice_assistants')
        .insert({
          user_id: userId,
          assistant_id: tempAssistantId,
          assistant_name: 'My Portfolio Assistant',
          voice_provider: 'openai',
          voice_id: 'alloy',
          model: 'gpt-4o-mini',
          first_message: firstMessage,
          system_prompt: defaultSystemPrompt,
          temperature: 0.7,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating assistant:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: newAssistant };
    }

    // Create assistant in database with VAPI ID
    const vapiAssistantId = (vapiResult.data as { id: string }).id;
    
    const { data: newAssistant, error } = await supabase
      .from('ai_voice_assistants')
      .insert({
        user_id: userId,
        assistant_id: vapiAssistantId,
        assistant_name: 'My Portfolio Assistant',
        voice_provider: 'openai',
        voice_id: 'alloy',
        model: 'gpt-4o-mini',
        first_message: firstMessage,
        system_prompt: defaultSystemPrompt,
        temperature: 0.7,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assistant:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: newAssistant };
  } catch (error) {
    console.error('Error getting voice assistant:', error);
    return { success: false, error: 'Failed to get voice assistant' };
  }
}

// Update voice assistant configuration
export async function updateVoiceAssistant(userId: string, updates: {
  assistant_name?: string;
  voice_provider?: string;
  voice_id?: string;
  model?: string;
  first_message?: string;
  system_prompt?: string;
  temperature?: number;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current assistant
    const { data: currentAssistant } = await supabase
      .from('ai_voice_assistants')
      .select('assistant_id')
      .eq('user_id', userId)
      .single();

    if (!currentAssistant) {
      return { success: false, error: 'Assistant not found' };
    }

    // Update VAPI assistant if not a temp ID
    if (!currentAssistant.assistant_id.startsWith('temp_')) {
      await updateVapiAssistantAPI(currentAssistant.assistant_id, {
        name: updates.assistant_name,
        systemPrompt: updates.system_prompt,
        firstMessage: updates.first_message,
        voiceProvider: updates.voice_provider,
        voiceId: updates.voice_id,
        model: updates.model,
        temperature: updates.temperature
      });
    }

    // Update database
    const { error } = await supabase
      .from('ai_voice_assistants')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating assistant:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/ai-management');
    return { success: true, message: 'Voice assistant updated successfully' };
  } catch (error) {
    console.error('Error updating assistant:', error);
    return { success: false, error: 'Failed to update assistant' };
  }
}

// Track conversation usage
export async function trackConversation(userId: string, data: {
  conversation_id: string;
  duration_seconds: number;
  transcript?: Record<string, unknown>;
  cost?: number;
  visitor_id?: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    // Insert conversation record
    await supabase
      .from('ai_voice_conversations')
      .insert({
        user_id: userId,
        conversation_id: data.conversation_id,
        duration_seconds: data.duration_seconds,
        transcript: data.transcript || null,
        cost: data.cost || 0,
        visitor_id: data.visitor_id || null
      });

    // Update conversations count
    const { data: subscription } = await supabase
      .from('ai_subscriptions')
      .select('conversations_used')
      .eq('user_id', userId)
      .eq('feature_type', 'voice_assistant')
      .single();

    if (subscription) {
      await supabase
        .from('ai_subscriptions')
        .update({
          conversations_used: (subscription.conversations_used || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('feature_type', 'voice_assistant');
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking conversation:', error);
    return { success: false, error: 'Failed to track conversation' };
  }
}

// Get conversation history
export async function getConversationHistory(userId: string, limit = 10) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('ai_voice_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching conversation history:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return { success: false, error: 'Failed to fetch conversation history' };
  }
}

// Generate training data from user profile
export async function generateTrainingData(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get all user data
    const [userResult, linksResult] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('user_links').select('*').eq('user_id', userId).eq('is_active', true)
    ]);

    const trainingData = [];

    // Profile data
    if (userResult.data) {
      trainingData.push({
        user_id: userId,
        data_type: 'profile',
        content: {
          name: userResult.data.full_name,
          title: userResult.data.profile_title,
          bio: userResult.data.bio,
          location: userResult.data.location,
          company: userResult.data.company,
          tech_stacks: userResult.data.tech_stacks || []
        },
        is_active: true
      });
    }

    // Links data (projects, blogs, etc.)
    if (linksResult.data && linksResult.data.length > 0) {
      const linksByCategory = linksResult.data.reduce((acc: Record<string, unknown[]>, link: Record<string, unknown>) => {
        const category = (link.category as string) || 'custom';
        if (!acc[category]) acc[category] = [];
        acc[category].push({
          title: link.title,
          url: link.url,
          description: link.description
        });
        return acc;
      }, {});

      trainingData.push({
        user_id: userId,
        data_type: 'links',
        content: linksByCategory,
        is_active: true
      });
    }

    // Clear old training data
    await supabase
      .from('ai_training_data')
      .delete()
      .eq('user_id', userId);

    // Insert new training data
    if (trainingData.length > 0) {
      const { error } = await supabase
        .from('ai_training_data')
        .insert(trainingData);

      if (error) {
        console.error('Error generating training data:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true, message: 'Training data generated successfully' };
  } catch (error) {
    console.error('Error generating training data:', error);
    return { success: false, error: 'Failed to generate training data' };
  }
}
