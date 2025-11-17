/**
 * AI Voice Assistant Management Page
 * 
 * Features:
 * - 7-day free trial with 50 conversations
 * - VAPI voice assistant integration
 * - Customizable voice, model, and system prompt
 * - Portfolio data sync for AI training
 * - Real-time conversation tracking
 * - Usage analytics and limits
 * 
 * Setup Required:
 * 1. Add VAPI keys to .env.local:
 *    - NEXT_PUBLIC_VAPI_PUBLIC_KEY
 *    - VAPI_PRIVATE_KEY
 * 2. Restart dev server
 * 3. Start trial and configure assistant
 */

'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { Mic, Sparkles, Clock, MessageSquare, Play, Pause, RefreshCw, Save } from 'lucide-react';
import {
  checkVoiceAssistantAccess,
  startVoiceAssistantTrial,
  getVoiceAssistant,
  updateVoiceAssistant,
  getConversationHistory,
  generateTrainingData
} from '@/server/actions/ai-voice.actions';

interface AssistantConfig {
  assistant_name: string;
  voice_provider: string;
  voice_id: string;
  model: string;
  first_message: string;
  system_prompt: string;
  temperature: number;
}

export default function AIManagementPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [canStartTrial, setCanStartTrial] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [conversationsUsed, setConversationsUsed] = useState(0);
  const [conversationsLimit, setConversationsLimit] = useState(0);
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({
    assistant_name: 'My Portfolio Assistant',
    voice_provider: 'openai',
    voice_id: 'alloy',
    model: 'gpt-4o-mini',
    first_message: '',
    system_prompt: '',
    temperature: 0.7
  });
  const [conversations, setConversations] = useState<unknown[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Check access
      const accessResult = await checkVoiceAssistantAccess(user.id);
      setHasAccess(accessResult.hasAccess || false);
      setCanStartTrial(accessResult.canStartTrial || false);
      setIsTrial(accessResult.isTrial || false);
      setDaysLeft(accessResult.daysLeft || 0);
      setConversationsUsed(accessResult.conversationsUsed || 0);
      setConversationsLimit(accessResult.conversationsLimit || 0);

      if (accessResult.hasAccess) {
        // Load assistant config
        const assistantResult = await getVoiceAssistant(user.id);
        if (assistantResult.success && assistantResult.data) {
          setAssistantConfig({
            assistant_name: assistantResult.data.assistant_name,
            voice_provider: assistantResult.data.voice_provider,
            voice_id: assistantResult.data.voice_id,
            model: assistantResult.data.model,
            first_message: assistantResult.data.first_message || '',
            system_prompt: assistantResult.data.system_prompt || '',
            temperature: assistantResult.data.temperature || 0.7
          });
        }

        // Load conversation history
        const historyResult = await getConversationHistory(user.id, 5);
        if (historyResult.success && historyResult.data) {
          setConversations(historyResult.data);
        }
      }
    } catch (error) {
      console.error('Error loading AI management data:', error);
      toast.error('Failed to load AI management data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const result = await startVoiceAssistantTrial(user.id);
      if (result.success) {
        toast.success(result.message);
        await loadData();
      } else {
        toast.error(result.error || 'Failed to start trial');
      }
    } catch (error) {
      toast.error('Failed to start trial');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const result = await updateVoiceAssistant(user.id, assistantConfig);
      if (result.success) {
        toast.success('Voice assistant configuration saved!');
      } else {
        toast.error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleSyncData = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const result = await generateTrainingData(user.id);
      if (result.success) {
        toast.success('Portfolio data synced successfully!');
      } else {
        toast.error(result.error || 'Failed to sync data');
      }
    } catch (error) {
      toast.error('Failed to sync data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#54E0FF]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess && canStartTrial) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#54E0FF]/10 to-[#29ADFF]/10 border-[#54E0FF]/30">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl text-white">AI Voice Assistant</CardTitle>
              <CardDescription className="text-lg text-gray-300">
                Transform your portfolio with an AI voice assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-white/5">
                  <Mic className="w-8 h-8 text-[#54E0FF] mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Voice Conversations</h3>
                  <p className="text-sm text-gray-400">Natural voice interactions</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <Clock className="w-8 h-8 text-[#54E0FF] mx-auto mb-2" />
                  <h3 className="font-semibold text-white">7-Day Free Trial</h3>
                  <p className="text-sm text-gray-400">50 conversations included</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <MessageSquare className="w-8 h-8 text-[#54E0FF] mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Smart Responses</h3>
                  <p className="text-sm text-gray-400">Trained on your portfolio</p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleStartTrial}
                  disabled={saving}
                  size="lg"
                  className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-white font-semibold px-8"
                >
                  {saving ? 'Starting Trial...' : 'Start 7-Day Free Trial'}
                </Button>
                <p className="text-sm text-gray-400 mt-2">No credit card required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Voice Assistant Access Expired</CardTitle>
              <CardDescription>Upgrade to premium to continue using the voice assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF]">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Voice Assistant Management</h1>
          <p className="text-gray-400">Configure and manage your portfolio voice assistant</p>
        </div>

        {/* Status Card */}
        <Card className="bg-gradient-to-r from-[#54E0FF]/10 to-[#29ADFF]/10 border-[#54E0FF]/30">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-white font-semibold">
                    {isTrial ? `Trial Active (${daysLeft} days left)` : 'Premium Active'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Conversations Used</p>
                <p className="text-white font-semibold text-2xl">
                  {conversationsUsed} / {conversationsLimit}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  onClick={handleSyncData}
                  disabled={saving}
                  variant="outline"
                  className="border-[#54E0FF]/30 hover:bg-[#54E0FF]/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
                  Sync Portfolio Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Assistant Configuration - Sticky */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Configuration
                </CardTitle>
                <CardDescription>Customize your AI voice assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Assistant Name</Label>
                  <Input
                    value={assistantConfig.assistant_name}
                    onChange={(e) => setAssistantConfig({ ...assistantConfig, assistant_name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="My Portfolio Assistant"
                  />
                </div>

                <div>
                  <Label className="text-white">Voice Provider</Label>
                  <Select
                    value={assistantConfig.voice_provider}
                    onValueChange={(value) => setAssistantConfig({ ...assistantConfig, voice_provider: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                      <SelectItem value="deepgram">Deepgram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Voice ID</Label>
                  <Select
                    value={assistantConfig.voice_id}
                    onValueChange={(value) => setAssistantConfig({ ...assistantConfig, voice_id: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                      <SelectItem value="echo">Echo (Male)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Female)</SelectItem>
                      <SelectItem value="nova">Nova (Female)</SelectItem>
                      <SelectItem value="fable">Fable (British Male)</SelectItem>
                      <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">AI Model</Label>
                  <Select
                    value={assistantConfig.model}
                    onValueChange={(value) => setAssistantConfig({ ...assistantConfig, model: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4O Mini (Fast & Cheap)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4O (Best Quality)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">First Message</Label>
                  <Textarea
                    value={assistantConfig.first_message}
                    onChange={(e) => setAssistantConfig({ ...assistantConfig, first_message: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    placeholder="Hi! I'm the portfolio assistant. Ask me anything!"
                  />
                </div>

                <Button
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Prompt */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                System Prompt
              </CardTitle>
              <CardDescription>Customize how your assistant responds</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={assistantConfig.system_prompt}
                onChange={(e) => setAssistantConfig({ ...assistantConfig, system_prompt: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[400px] font-mono text-sm"
                placeholder="You are an AI assistant for..."
              />
              <div className="mt-4">
                <Label className="text-white">Temperature: {assistantConfig.temperature}</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={assistantConfig.temperature}
                  onChange={(e) => setAssistantConfig({ ...assistantConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>More Focused</span>
                  <span>More Creative</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Conversations
            </CardTitle>
            <CardDescription>Last {conversations.length} voice interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No conversations yet</p>
            ) : (
              <div className="space-y-3">
                {(conversations as Array<Record<string, unknown>>).map((conv, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Conversation {conversations.length - idx}</p>
                        <p className="text-sm text-gray-400">
                          {conv.duration_seconds} seconds • {new Date(conv.created_at as string).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {conv.cost && (
                      <p className="text-sm text-gray-400">${Number(conv.cost).toFixed(4)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
