'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase-client';
import { 
  getAllTemplates, 
  startTemplateTrial, 
  setUserTemplate,
  getUserSubscriptions 
} from '@/server/actions/template.actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Clock, Loader2, ArrowRight, Layout } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
}

interface UserSubscription {
  id: string;
  template_id: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  trial_end_date: string | null;
  subscription_end_date: string | null;
  template?: Template;
}

export function TemplateSelector() {
  const { user } = useAuthStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>('developer-dark');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load templates and user subscriptions
  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [templatesResult, subsResult] = await Promise.all([
        getAllTemplates(),
        getUserSubscriptions(user.id)
      ]);

      if (templatesResult.success && templatesResult.data) {
        setTemplates(templatesResult.data);
      }

      if (subsResult.success && subsResult.data) {
        setSubscriptions(subsResult.data);
      }

      // Get user's current theme from Supabase
      const supabase = createClient();
      const { data: userData } = await supabase
        .from('users')
        .select('theme_id')
        .eq('id', user.id)
        .single();
      
      if (userData?.theme_id) {
        setActiveTemplate(userData.theme_id);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Template color schemes for dynamic previews
  const templateColors: Record<string, { bg: string; accent: string; preview: string }> = {
    'developer-dark': { 
      bg: 'from-[#18181a] to-[#1e1e20]', 
      accent: 'from-[#54E0FF] to-[#29ADFF]',
      preview: 'bg-gradient-to-br from-[#18181a] to-[#1e1e20]'
    },
    'arctic-minimal': { 
      bg: 'from-white to-gray-50', 
      accent: 'from-blue-600 to-blue-400',
      preview: 'bg-gradient-to-br from-white to-gray-50'
    },
    'tokyo-neon': { 
      bg: 'from-[#0A0E27] to-[#1A1A2E]', 
      accent: 'from-[#FF006E] to-[#8338EC]',
      preview: 'bg-gradient-to-br from-[#0A0E27] to-[#1A1A2E]'
    },
    'holographic-card': { 
      bg: 'from-[#0F0F1E] to-[#1A1A2E]', 
      accent: 'from-[#FF00FF] to-[#00FFFF]',
      preview: 'bg-gradient-to-br from-[#0F0F1E] via-purple-900/20 to-cyan-900/20'
    },
    'apple-vision-pro': { 
      bg: 'from-black via-[#1A1A2E] to-[#16213E]', 
      accent: 'from-[#00D4FF] to-[#7B68EE]',
      preview: 'bg-gradient-to-br from-black via-blue-950/30 to-purple-950/20'
    },
  };

  const getTemplateColors = (slug: string) => {
    return templateColors[slug] || templateColors['developer-dark'];
  };

  const hasAccess = (template: Template): boolean => {
    if (template.category === 'free') return true;

    // Check if user has active subscription or trial
    const sub = subscriptions.find(s => s.template_id === template.id);
    if (!sub) return false;

    if (sub.status === 'trial' && sub.trial_end_date) {
      return new Date() <= new Date(sub.trial_end_date);
    }

    if (sub.status === 'active' && sub.subscription_end_date) {
      return new Date() <= new Date(sub.subscription_end_date);
    }

    return false;
  };

  const getSubscriptionInfo = (template: Template) => {
    const sub = subscriptions.find(s => s.template_id === template.id);
    if (!sub) return null;

    if (sub.status === 'trial' && sub.trial_end_date) {
      const daysLeft = Math.ceil((new Date(sub.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return { type: 'trial', daysLeft };
    }

    if (sub.status === 'active') {
      return { type: 'active', daysLeft: null };
    }

    return null;
  };

  const handleStartTrial = async (template: Template) => {
    if (!user?.id) return;

    setActionLoading(template.id);
    try {
      const result = await startTemplateTrial(user.id, template.slug);
      
      if (result.success) {
        toast.success(result.message || '7-day free trial started!');
        await loadData(); // Reload data
      } else {
        toast.error(result.error || 'Failed to start trial');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyTemplate = async (template: Template) => {
    if (!user?.id) return;

    setActionLoading(template.id);
    try {
      const result = await setUserTemplate(user.id, template.slug);
      
      if (result.success) {
        toast.success(result.message || 'Template applied successfully!');
        setActiveTemplate(template.slug);
        await loadData();
      } else {
        toast.error(result.error || 'Failed to apply template');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading templates...</p>
      </div>
    );
  }

  // Sort templates: Active first, then Premium, then Free
  const sortedTemplates = [...templates].sort((a, b) => {
    if (a.slug === activeTemplate) return -1;
    if (b.slug === activeTemplate) return 1;
    if (a.category === 'premium' && b.category === 'free') return -1;
    if (b.category === 'premium' && a.category === 'free') return 1;
    return 0;
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="w-6 h-6 text-primary" />
            All Templates
          </h2>
          <p className="text-muted-foreground mt-1">
            Select a design to instantly transform your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{templates.filter(t => t.category === 'premium').length} Premium</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{templates.filter(t => t.category === 'free').length} Free</span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTemplates.map((template) => {
          const isActive = activeTemplate === template.slug;
          const isPremium = template.category === 'premium';
          const access = hasAccess(template);
          const subInfo = getSubscriptionInfo(template);
          const colors = getTemplateColors(template.slug);

          return (
            <div
              key={template.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300",
                isActive 
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_-10px_rgba(84,224,255,0.3)]" 
                  : "border-white/10 bg-[#18181a] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              )}
            >
              {/* Status Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                {isActive && (
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-none px-3 py-1">
                    <Check className="w-3 h-3 mr-1" /> Active
                  </Badge>
                )}
                {isPremium && !isActive && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none font-bold shadow-lg shadow-orange-500/20">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                )}
                {!isPremium && !isActive && (
                  <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-md border-white/10">
                    Free
                  </Badge>
                )}
              </div>

              {/* Subscription Status Badge */}
              {subInfo && !isActive && (
                <div className="absolute top-3 right-3 z-20">
                  <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/20 text-white">
                    <Clock className="w-3 h-3 mr-1 text-primary" />
                    {subInfo.type === 'trial' ? `${subInfo.daysLeft}d Trial` : 'Subscribed'}
                  </Badge>
                </div>
              )}

              {/* Preview Image Area */}
              <div className={cn(
                "relative aspect-[16/10] w-full overflow-hidden",
                colors.preview
              )}>
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPremium ? (
                      <Crown className="w-16 h-16 text-white/20" />
                    ) : (
                      <Layout className="w-16 h-16 text-white/20" />
                    )}
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181a] via-transparent to-transparent opacity-60" />
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-1 p-5">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || "A modern, professional template for your portfolio."}
                  </p>
                </div>

                {/* Features List (Compact) */}
                <div className="space-y-2 mb-6 flex-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground/80">
                      <div className="w-1 h-1 rounded-full bg-primary/50" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-4 border-t border-white/5">
                  {!access ? (
                    <Button
                      onClick={() => handleStartTrial(template)}
                      disabled={actionLoading === template.id}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold shadow-lg shadow-orange-500/10 transition-all"
                    >
                      {actionLoading === template.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleApplyTemplate(template)}
                      disabled={actionLoading === template.id || isActive}
                      variant={isActive ? "outline" : "default"}
                      className={cn(
                        "w-full font-medium transition-all",
                        isActive 
                          ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 cursor-default" 
                          : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10"
                      )}
                    >
                      {actionLoading === template.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isActive ? (
                        <>
                          <Check className="w-4 h-4 mr-2" /> Applied
                        </>
                      ) : (
                        'Apply Template'
                      )}
                    </Button>
                  )}
                  
                  {!access && (
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                      7-day free trial • No credit card required
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
