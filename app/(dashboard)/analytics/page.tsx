'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/useAuthStore';
import { getLinkAnalytics } from '@/server/actions/link.actions';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Link as LinkIcon, 
  Eye,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  totalClicks: number;
  linksByCategory: Record<string, number>;
  topLinks: Array<{
    title: string;
    url: string;
    clicks: number;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await getLinkAnalytics(user.id);
      if (result.success && result.data) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#54E0FF] animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalLinks = analytics ? Object.values(analytics.linksByCategory).reduce((a, b) => a + b, 0) : 0;
  const categoryData = analytics?.linksByCategory || {};
  const categories = Object.entries(categoryData);
  const maxCategoryCount = Math.max(...Object.values(categoryData), 1);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-[#54E0FF]" />
            Analytics Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-400">Track your portfolio performance and link engagement</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Total Clicks */}
          <Card className="bg-gradient-to-br from-[#54E0FF]/10 to-[#29ADFF]/10 border-[#54E0FF]/30">
            <CardHeader className="pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm text-gray-400">Total Clicks</CardDescription>
              <CardTitle className="text-3xl md:text-4xl text-white flex items-center gap-2 md:gap-3">
                <MousePointerClick className="w-6 h-6 md:w-8 md:h-8 text-[#54E0FF]" />
                {analytics?.totalClicks || 0}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                <span className="text-green-400">All-time engagement</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Links */}
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/30">
            <CardHeader className="pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm text-gray-400">Total Links</CardDescription>
              <CardTitle className="text-3xl md:text-4xl text-white flex items-center gap-2 md:gap-3">
                <LinkIcon className="w-6 h-6 md:w-8 md:h-8 text-violet-400" />
                {totalLinks}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Eye className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />
                <span className="text-violet-400">Published links</span>
              </div>
            </CardContent>
          </Card>

          {/* Average Clicks */}
          <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/30">
            <CardHeader className="pb-2 md:pb-3">
              <CardDescription className="text-xs md:text-sm text-gray-400">Avg. Clicks per Link</CardDescription>
              <CardTitle className="text-3xl md:text-4xl text-white flex items-center gap-2 md:gap-3">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
                {totalLinks > 0 ? Math.round((analytics?.totalClicks || 0) / totalLinks) : 0}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
                <span className="text-pink-400">Engagement rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Performing Links */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#54E0FF]" />
                Top Performing Links
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Most clicked links on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topLinks && analytics.topLinks.length > 0 ? (
                <div className="space-y-2 md:space-y-3">
                  {analytics.topLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-3 md:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#54E0FF] font-bold text-sm md:text-lg">#{idx + 1}</span>
                            <h3 className="text-white font-medium text-sm md:text-base truncate">{link.title}</h3>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-[#54E0FF] flex items-center gap-1 truncate"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{link.url}</span>
                          </a>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl md:text-2xl font-bold text-white">{link.clicks}</div>
                          <div className="text-xs text-gray-400">clicks</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <MousePointerClick className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm md:text-base text-gray-400">No clicks yet</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Share your profile to start tracking</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links by Category */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-[#54E0FF]" />
                Links by Category
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Distribution of your links</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {categories.map(([category, count]) => {
                    const percentage = maxCategoryCount > 0 ? (count / maxCategoryCount) * 100 : 0;
                    const categoryColors: Record<string, string> = {
                      projects: 'bg-[#54E0FF]',
                      blogs: 'bg-violet-500',
                      achievements: 'bg-pink-500',
                      contact: 'bg-green-500',
                      social: 'bg-blue-500',
                      personal: 'bg-yellow-500',
                      custom: 'bg-gray-500'
                    };
                    const color = categoryColors[category] || 'bg-gray-500';

                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm md:text-base text-white capitalize font-medium">{category}</span>
                          <span className="text-gray-400 text-xs md:text-sm">{count} links</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div
                            className={`${color} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <LinkIcon className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm md:text-base text-gray-400">No links yet</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Add links to see category breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm md:text-base text-white font-semibold mb-1">How Analytics Work</h3>
                <p className="text-xs md:text-sm text-gray-400">
                  Clicks are tracked when visitors interact with your links on your public profile page. 
                  Only clicks from your public profile ({window.location.origin}/[username]) are counted to ensure accurate visitor engagement metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
