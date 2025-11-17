'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: 'free' | 'premium';
  price: number;
  thumbnail_url: string | null;
  preview_url: string | null;
  is_active: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
}

interface UserSubscription {
  id: string;
  user_id: string;
  template_id: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Get all templates
export async function getAllTemplates() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('price', { ascending: true });
    
    if (error) throw error;
    
    return { success: true, data: data as Template[] };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch templates' };
  }
}

// Get template by slug
export async function getTemplateBySlug(slug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    
    return { success: true, data: data as Template };
  } catch (error) {
    console.error('Error fetching template:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Template not found' };
  }
}

// Check if user has access to template (free or subscribed)
export async function checkTemplateAccess(userId: string, templateSlug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', templateSlug)
      .eq('is_active', true)
      .single();
    
    if (templateError) throw templateError;
    
    // Free templates are accessible to everyone
    if (template.category === 'free') {
      return { success: true, hasAccess: true, template: template as Template };
    }
    
    // Check for active subscription or trial
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', template.id)
      .in('status', ['trial', 'active'])
      .single();
    
    if (subError && subError.code !== 'PGRST116') throw subError; // PGRST116 = no rows
    
    // Check if trial/subscription is still valid
    if (subscription) {
      const now = new Date();
      
      if (subscription.status === 'trial' && subscription.trial_end_date) {
        const trialEnd = new Date(subscription.trial_end_date);
        if (now <= trialEnd) {
          return { success: true, hasAccess: true, template: template as Template, subscription: subscription as UserSubscription };
        }
      }
      
      if (subscription.status === 'active' && subscription.subscription_end_date) {
        const subEnd = new Date(subscription.subscription_end_date);
        if (now <= subEnd) {
          return { success: true, hasAccess: true, template: template as Template, subscription: subscription as UserSubscription };
        }
      }
    }
    
    return { success: true, hasAccess: false, template: template as Template };
  } catch (error) {
    console.error('Error checking template access:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to check access' };
  }
}

// Start 7-day free trial for premium template
export async function startTemplateTrial(userId: string, templateSlug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', templateSlug)
      .eq('category', 'premium')
      .eq('is_active', true)
      .single();
    
    if (templateError) throw templateError;
    if (!template) throw new Error('Premium template not found');
    
    // Check if user already has a subscription/trial for this template
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('template_id', template.id)
      .single();
    
    if (existing) {
      throw new Error('You already have a subscription for this template');
    }
    
    // Create trial subscription (7 days)
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        template_id: template.id,
        status: 'trial',
        trial_start_date: now.toISOString(),
        trial_end_date: trialEnd.toISOString()
      })
      .select()
      .single();
    
    if (subError) throw subError;
    
    // Update user's theme_id to use this template
    await supabase
      .from('users')
      .update({ theme_id: templateSlug })
      .eq('id', userId);
    
    return { 
      success: true, 
      data: subscription as UserSubscription,
      message: '7-day free trial started! Enjoy your premium template.' 
    };
  } catch (error) {
    console.error('Error starting trial:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to start trial' };
  }
}

// Get user's subscriptions
export async function getUserSubscriptions(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        template:templates(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch subscriptions' };
  }
}

// Set user's active template
export async function setUserTemplate(userId: string, templateSlug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check if user has access to this template
    const access = await checkTemplateAccess(userId, templateSlug);
    
    if (!access.success) {
      throw new Error(access.error || 'Failed to check template access');
    }
    
    if (!access.hasAccess) {
      throw new Error('You do not have access to this template. Start a free trial or subscribe.');
    }
    
    // Update user's theme_id
    const { data, error } = await supabase
      .from('users')
      .update({ theme_id: templateSlug })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data, message: 'Template applied successfully!' };
  } catch (error) {
    console.error('Error setting user template:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to set template' };
  }
}

// Cancel subscription (mark as cancelled, will expire at end date)
export async function cancelTemplateSubscription(userId: string, subscriptionId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data, message: 'Subscription cancelled. You can use the template until the end of your billing period.' };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to cancel subscription' };
  }
}