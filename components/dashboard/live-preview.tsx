'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface LivePreviewProps {
  profileData?: {
    name?: string;
    username?: string;
    title?: string;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
    tech_stacks?: string[];
  };
}

export function LivePreview({ profileData: initialProfileData }: LivePreviewProps) {
  const { profile } = useAuthStore();

  // Compute profile data from store or initial data
  const profileData = useMemo(() => {
    if (profile) {
      const p = profile as unknown as Record<string, unknown>;
      return {
        name: (p.full_name as string) || initialProfileData?.name || 'Your Name',
        username: (p.profile_slug as string) || (p.github_username as string) || initialProfileData?.username || 'username',
        title: (p.profile_title as string) || initialProfileData?.title || 'Your Title',
        bio: (p.bio as string) || initialProfileData?.bio || 'Your bio will appear here...',
        avatar_url: (p.avatar_url as string) || initialProfileData?.avatar_url,
        github_url: (p.github_url as string) || initialProfileData?.github_url,
        linkedin_url: (p.linkedin_url as string) || initialProfileData?.linkedin_url,
        twitter_url: (p.twitter_username as string) ? `https://x.com/${p.twitter_username}` : initialProfileData?.twitter_url,
        website_url: (p.website_url as string) || initialProfileData?.website_url,
        tech_stacks: (p.tech_stacks as string[]) || initialProfileData?.tech_stacks || []
      };
    }
    return initialProfileData || {};
  }, [profile, initialProfileData]);

  const {
    name = 'Your Name',
    username = 'username',
    title = 'Your Title',
    bio = 'Your bio will appear here...',
    avatar_url,
    github_url,
    linkedin_url,
    twitter_url,
    website_url,
    tech_stacks = []
  } = profileData || {};

  const socialLinks = [
    { name: 'GitHub', url: github_url, icon: '/icons/social/github.png' },
    { name: 'LinkedIn', url: linkedin_url, icon: '/icons/social/linkedin.png' },
    { name: 'X', url: twitter_url, icon: '/icons/social/x.png' },
    { name: 'Website', url: website_url, icon: '/icons/social/website.png' }
  ].filter(link => link.url);

  // Get public profile URL
  const publicProfileUrl = `/${username}`;

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 mb-4">
              {avatar_url ? (
                <img 
                  src={avatar_url} 
                  alt={name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] text-2xl font-bold">
                  {name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <h2 className="text-xl font-bold text-white mb-1">{name}</h2>
            <p className="text-[#54E0FF] mb-2">@{username}</p>
            <p className="text-gray-300 text-sm mb-4">{title}</p>
            
            <p className="text-gray-400 text-sm mb-4">{bio}</p>
            
            {/* Tech Stack Preview */}
            {tech_stacks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {tech_stacks.slice(0, 6).map((tech: string, idx: number) => {
                  const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <Image
                        src={`/techstacks/${techLower}.png`}
                        alt={tech}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-300">{tech}</span>
                    </div>
                  );
                })}
                {tech_stacks.length > 6 && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-gray-400">+{tech_stacks.length - 6} more</span>
                  </div>
                )}
              </div>
            )}
            
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
                    title={link.name}
                  >
                    <Image
                      src={link.icon}
                      alt={link.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                ))}
              </div>
            )}
            
            <Link href={publicProfileUrl} target="_blank" className="w-full">
              <Button className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-[#18181a] font-medium">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Profile Preview</h3>
          <p className="text-gray-400 text-sm mb-3">
            This is how your profile will appear to visitors. Make sure all information is accurate and up-to-date.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Profile URL:</span>
              <code className="text-[#54E0FF] text-xs">{publicProfileUrl}</code>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-gray-400">Skills:</span>
              <span className="text-white">{tech_stacks.length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Social Links:</span>
              <span className="text-white">{socialLinks.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}