'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase-client';
import { 
  getAllTemplates, 
  checkTemplateAccess, 
  startTemplateTrial, 
  setUserTemplate,
  getUserSubscriptions 
} from '@/server/actions/template.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  // Template color schemes
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
        // Just reload the data without full page refresh
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#54E0FF]" />
      </div>
    );
  }

  const freeTemplates = templates.filter(t => t.category === 'free');
  const premiumTemplates = templates.filter(t => t.category === 'premium');

  return (
    <div className="space-y-8">
      {/* Free Templates */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2">Free Templates</h2>
          <p className="text-sm text-[#7a7a83]">Choose from our collection of free templates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeTemplates.map(template => {
            const colors = getTemplateColors(template.slug);
            
            return (
            <Card 
              key={template.id}
              className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden group hover:border-[#54E0FF]/30 transition-all"
            >
              <CardContent className="p-0">
                {/* Template Preview */}
                <div className={`relative h-48 ${colors.preview} flex items-center justify-center`}>
                  {template.thumbnail_url ? (
                    <Image
                      src={template.thumbnail_url}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Sparkles className="w-12 h-12 text-white/30" />
                  )}
                  
                  {activeTemplate === template.slug && (
                    <div className="absolute top-2 right-2 bg-[#54E0FF] text-[#18181a] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{template.name}</h3>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Free
                    </Badge>
                  </div>

                  <p className="text-sm text-[#7a7a83] mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {template.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#7a7a83]">
                        <Check className="w-3 h-3 text-[#54E0FF]" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleApplyTemplate(template)}
                    disabled={actionLoading === template.id || activeTemplate === template.slug}
                    className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-[#18181a] font-medium"
                  >
                    {actionLoading === template.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : activeTemplate === template.slug ? (
                      'Currently Active'
                    ) : (
                      'Apply Template'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>

      {/* Premium Templates */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Premium Templates
          </h2>
          <p className="text-sm text-[#7a7a83]">Unlock advanced templates with 7-day free trial</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumTemplates.map(template => {
            const access = hasAccess(template);
            const subInfo = getSubscriptionInfo(template);
            const colors = getTemplateColors(template.slug);

            return (
              <Card 
                key={template.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden group hover:border-yellow-400/30 transition-all relative"
              >
                {/* Premium Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-[#18181a] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </div>

                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className={`relative h-64 ${colors.preview} flex items-center justify-center`}>
                    {template.thumbnail_url ? (
                      <Image
                        src={template.thumbnail_url}
                        alt={template.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Crown className="w-16 h-16 text-white/30" />
                    )}
                    
                    {activeTemplate === template.slug && (
                      <div className="absolute top-2 right-2 bg-[#54E0FF] text-[#18181a] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </div>
                    )}

                    {subInfo && (
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {subInfo.type === 'trial' ? `Trial: ${subInfo.daysLeft}d left` : 'Subscribed'}
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-white">{template.name}</h3>
                    </div>

                    <p className="text-sm text-[#7a7a83] mb-4">
                      {template.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-1 mb-4">
                      {template.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#7a7a83]">
                          <Check className="w-3 h-3 text-yellow-400" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {!access ? (
                        <>
                          <Button
                            onClick={() => handleStartTrial(template)}
                            disabled={actionLoading === template.id}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-[#18181a] font-bold"
                          >
                            {actionLoading === template.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Start 7-Day Free Trial
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-center text-[#7a7a83]">
                            No credit card required
                          </p>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleApplyTemplate(template)}
                          disabled={actionLoading === template.id || activeTemplate === template.slug}
                          className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-[#18181a] font-medium"
                        >
                          {actionLoading === template.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : activeTemplate === template.slug ? (
                            'Currently Active'
                          ) : (
                            'Apply Template'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
