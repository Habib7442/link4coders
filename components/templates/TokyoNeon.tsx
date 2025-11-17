'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';
import { GitHubContributions } from '@/components/public-profile/github-contributions';
import { ClickableLink } from '@/components/public-profile/clickable-link';

interface TokyoNeonTemplateProps {
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

export default function TokyoNeonTemplate({ user, links, voiceAssistant, vapiPublicKey, githubUsername }: TokyoNeonTemplateProps) {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f0f23 0%, #1a1a2e 100%)'
      }}
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-16 text-center">
          <div className="relative inline-block mb-6">
            {user.avatar_url ? (
              <div className="relative">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-400" style={{
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
                }}>
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white" style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}>
                {user.full_name?.[0] || 'U'}
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{
            color: '#00ffff',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
          }}>
            {user.full_name || 'Developer'}
          </h1>
          
          {user.profile_title && (
            <p className="text-xl md:text-2xl text-cyan-300 font-light mb-4">
              {user.profile_title}
            </p>
          )}

          {user.bio && (
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              {user.bio}
            </p>
          )}
        </div>

        {/* Social Links - Neon Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {user.github_url && (
            <a
              href={user.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {user.linkedin_url && (
            <a
              href={user.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          )}
          {user.twitter_username && (
            <a
              href={`https://x.com/${user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
            </a>
          )}
          {user.website_url && (
            <a
              href={user.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Website
            </a>
          )}
        </div>

        {/* Tech Stack */}
        {user.tech_stacks && user.tech_stacks.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              Tech Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {user.tech_stacks.map((tech: string, idx: number) => {
                const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div
                    key={idx}
                    className="neon-pill"
                  >
                    <Image
                      src={`/techstacks/${techLower}.png`}
                      alt={tech}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{tech}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Voice Assistant */}
        {voiceAssistant && vapiPublicKey && (
          <div className="mb-16 flex justify-center">
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
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
              GitHub Activity
            </h2>
            <GitHubContributions githubUsername={githubUsername} />
          </div>
        )}

        {/* Links - Cyberpunk Cards */}
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
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">{categoryEmoji}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryLinks.map((link) => (
                  <div key={link.id} className="cyberpunk-link-wrapper">
                    <ClickableLink
                      linkId={link.id}
                      url={link.url}
                      title={link.title}
                      description={link.description}
                      iconType={link.icon_type}
                      linkImage={link.link_image}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20 relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} {user.full_name || 'Developer'}. Built with Link4Devs.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .neon-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(0, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.5);
          border-radius: 0.5rem;
          color: #00ffff;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
        }

        .neon-button:hover {
          background: rgba(0, 255, 255, 0.1);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .neon-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.5);
          border-radius: 9999px;
          color: #a78bfa;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .neon-pill:hover {
          background: rgba(139, 92, 246, 0.1);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
        }

        .cyberpunk-link-wrapper :global(a) {
          background: rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(139, 92, 246, 0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.2) !important;
          transition: all 0.3s ease !important;
        }

        .cyberpunk-link-wrapper :global(a:hover) {
          border-color: rgba(139, 92, 246, 0.5) !important;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4) !important;
          transform: translateY(-2px) !important;
        }

        .cyberpunk-link-wrapper :global(.w-12) {
          background: rgba(139, 92, 246, 0.2) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
        }

        .cyberpunk-link-wrapper :global(h3) {
          color: #a78bfa !important;
        }

        .cyberpunk-link-wrapper :global(a:hover h3) {
          color: #c4b5fd !important;
        }
      `}</style>
    </div>
  );
}
