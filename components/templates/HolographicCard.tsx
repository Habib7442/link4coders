'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';
import { GitHubContributions } from '@/components/public-profile/github-contributions';
import { ClickableLink } from '@/components/public-profile/clickable-link';

interface HolographicCardTemplateProps {
  user: {
    id: string;
    full_name?: string;
    profile_title?: string;
    bio?: string;
    avatar_url?: string;
    tech_stacks?: string[];
    github_url?: string;
    github_username?: string;
    linkedin_url?: string;
    twitter_username?: string;
    website_url?: string;
    show_github_contributions?: boolean;
  };
  links?: Record<string, Array<{
    id: string;
    title: string;
    url: string;
    description?: string;
    icon_type?: string;
    link_image?: string;
  }>>;
  voiceAssistant?: {
    assistant_id: string;
    assistant_name?: string;
    first_message?: string;
  } | null;
  vapiPublicKey?: string;
  githubUsername?: string;
}

export default function HolographicCardTemplate({ 
  user, 
  links, 
  voiceAssistant, 
  vapiPublicKey, 
  githubUsername 
}: HolographicCardTemplateProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Mouse tracking for holographic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const getHolographicGradient = () => {
    const x = mousePosition.x * 100;
    const y = mousePosition.y * 100;
    
    return {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3), transparent 50%)`
    };
  };

  const rarityLevel = user.tech_stacks && user.tech_stacks.length > 10 ? 'Expert' 
    : user.tech_stacks && user.tech_stacks.length > 6 ? 'Advanced' 
    : user.tech_stacks && user.tech_stacks.length > 3 ? 'Intermediate' 
    : 'Developer';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Profile Card */}
          <div 
            ref={cardRef}
            className="relative mb-12 max-w-2xl mx-auto"
          >
            {/* Holographic Card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-transparent bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-pink-500/20 p-[2px]">
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                {/* Holographic Shine Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-all duration-300"
                  style={getHolographicGradient()}
                />

                {/* Rarity Badge */}
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm">
                  {rarityLevel}
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  {user.avatar_url ? (
                    <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-br from-violet-500 via-blue-500 to-pink-500">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                        <Image
                          src={user.avatar_url}
                          alt={user.full_name || 'User'}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.full_name?.[0] || 'U'}
                    </div>
                  )}
                </div>

                {/* Name & Title */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 mb-2 break-words px-4">
                    {user.full_name || 'Developer'}
                  </h1>
                  {user.profile_title && (
                    <p className="text-lg sm:text-xl text-blue-300 font-medium break-words px-4">
                      {user.profile_title}
                    </p>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm sm:text-base text-gray-300 text-center mb-6 max-w-md mx-auto break-words px-4">
                    {user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-violet-400">{user.tech_stacks?.length || 0}</div>
                    <div className="text-xs text-gray-400 mt-1">Skills</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">{Object.keys(links || {}).length}</div>
                    <div className="text-xs text-gray-400 mt-1">Categories</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-bold text-pink-400">⭐</div>
                    <div className="text-xs text-gray-400 mt-1">{rarityLevel}</div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {user.github_url && (
                    <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all">
                      <Image src="/icons/social/github.png" alt="GitHub" width={24} height={24} />
                    </a>
                  )}
                  {user.linkedin_url && (
                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all">
                      <Image src="/icons/social/linkedin.png" alt="LinkedIn" width={24} height={24} />
                    </a>
                  )}
                  {user.twitter_username && (
                    <a href={`https://x.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all">
                      <Image src="/icons/social/x.png" alt="X" width={24} height={24} />
                    </a>
                  )}
                  {user.website_url && (
                    <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all">
                      <Image src="/icons/social/website.png" alt="Website" width={24} height={24} />
                    </a>
                  )}
                </div>

                {/* Tech Stack */}
                {user.tech_stacks && user.tech_stacks.length > 0 && (
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Tech Stack</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {user.tech_stacks.map((tech: string, idx: number) => {
                        const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all"
                          >
                            <Image
                              src={`/techstacks/${techLower}.png`}
                              alt={tech}
                              width={20}
                              height={20}
                              className="w-5 h-5"
                            />
                            <span className="text-sm text-gray-300">{tech}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Voice Assistant */}
          {voiceAssistant && vapiPublicKey && (
            <div className="mb-12 flex justify-center">
              <VapiVoiceButton
                userId={user.id}
                assistantId={voiceAssistant.assistant_id}
                publicKey={vapiPublicKey}
                firstMessage={voiceAssistant.first_message || undefined}
              />
            </div>
          )}

          {/* GitHub Contributions */}
          {githubUsername && user.show_github_contributions !== false && (
            <div className="mb-12">
              <GitHubContributions githubUsername={githubUsername} />
            </div>
          )}

          {/* Links */}
          {links && Object.entries(links).map(([category, categoryLinks]) => {
            if (!Array.isArray(categoryLinks) || categoryLinks.length === 0) return null;

            const categoryEmoji = {
              projects: '💼',
              social: '🌐',
              blogs: '📝',
              achievements: '🏆',
              contact: '📧',
              personal: '👤',
              custom: '🔗'
            }[category.toLowerCase()] || '🔗';

            return (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-6 text-center">
                  {categoryEmoji} {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryLinks.map((link) => (
                    <ClickableLink
                      key={link.id}
                      linkId={link.id}
                      url={link.url}
                      title={link.title}
                      description={link.description}
                      iconType={link.icon_type}
                      linkImage={link.link_image}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} {user.full_name || 'Developer'}. Built with Link4Devs.
          </p>
        </div>
      </footer>
    </div>
  );
}
