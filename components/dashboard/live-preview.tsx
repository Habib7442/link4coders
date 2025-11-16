'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  };
}

export function LivePreview({ profileData }: LivePreviewProps) {
  const {
    name = 'Your Name',
    username = 'username',
    title = 'Your Title',
    bio = 'Your bio will appear here...',
    avatar_url,
    github_url,
    linkedin_url,
    twitter_url,
    website_url
  } = profileData || {};

  const socialLinks = [
    { name: 'GitHub', url: github_url, icon: 'GH' },
    { name: 'LinkedIn', url: linkedin_url, icon: 'LI' },
    { name: 'X', url: twitter_url, icon: 'X' },
    { name: 'Website', url: website_url, icon: 'W' }
  ].filter(link => link.url);

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
            
            <p className="text-gray-400 text-sm mb-6">{bio}</p>
            
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                  >
                    {link.icon}
                  </Button>
                ))}
              </div>
            )}
            
            <Button className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-[#18181a] font-medium">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Public Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Profile Preview</h3>
          <p className="text-gray-400 text-sm">
            This is how your profile will appear to visitors. Make sure all information is accurate and up-to-date.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}