'use client';

import React from 'react';
import Image from 'next/image';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';
import { GitHubContributions } from '@/components/public-profile/github-contributions';
import { ClickableLink } from '@/components/public-profile/clickable-link';

interface ArcticMinimalTemplateProps {
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

export default function ArcticMinimalTemplate({ user, links, voiceAssistant, vapiPublicKey, githubUsername }: ArcticMinimalTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Minimal with just name and title */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            {user.avatar_url && (
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <Image
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 tracking-tight break-words">
                {user.full_name || 'Developer'}
              </h1>
              {user.profile_title && (
                <p className="text-lg sm:text-xl text-gray-600 font-light break-words">
                  {user.profile_title}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Bio Section */}
        {user.bio && (
          <section className="mb-20">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-light max-w-3xl break-words">
              {user.bio}
            </p>
          </section>
        )}

        {/* Tech Stack - Minimal pills */}
        {user.tech_stacks && user.tech_stacks.length > 0 && (
          <section className="mb-20">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.tech_stacks.map((tech: string, idx: number) => {
                const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src={`/techstacks/${techLower}.png`}
                      alt={tech}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 font-light">{tech}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Social Links - Minimal horizontal list */}
        <section className="mb-20">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
            Connect
          </h2>
          <div className="flex flex-wrap gap-4">
            {user.github_url && (
              <a
                href={user.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="text-sm text-gray-700 font-light">GitHub</span>
              </a>
            )}
            {user.linkedin_url && (
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm text-gray-700 font-light">LinkedIn</span>
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://x.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm text-gray-700 font-light">X (Twitter)</span>
              </a>
            )}
            {user.website_url && (
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-sm text-gray-700 font-light">Website</span>
              </a>
            )}
          </div>
        </section>

        {/* Voice Assistant */}
        {voiceAssistant && vapiPublicKey && (
          <section className="mb-20">
            <VapiVoiceButton
              userId={user.id}
              assistantId={voiceAssistant.assistant_id}
              publicKey={vapiPublicKey}
              firstMessage={voiceAssistant.first_message || undefined}
            />
          </section>
        )}

        {/* GitHub Contributions */}
        {githubUsername && user.show_github_contributions !== false && (
          <section className="mb-20">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
              GitHub Activity
            </h2>
            <GitHubContributions githubUsername={githubUsername} />
          </section>
        )}

        {/* Links - Minimal cards */}
        {links && Object.entries(links).map(([category, categoryLinks]) => {
          if (!Array.isArray(categoryLinks) || categoryLinks.length === 0) return null;

          return (
            <section key={category} className="mb-20">
              <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-6 font-medium">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryLinks.map((link) => (
                  <div key={link.id} className="minimal-link-wrapper">
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
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <p className="text-sm text-gray-500 text-center font-light">
            © {new Date().getFullYear()} {user.full_name || 'Developer'}. Built with Link4Devs.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .minimal-link-wrapper :global(a) {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .minimal-link-wrapper :global(a:hover) {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
        }

        .minimal-link-wrapper :global(h3),
        .minimal-link-wrapper :global(p),
        .minimal-link-wrapper :global(svg) {
          color: #374151 !important;
        }

        .minimal-link-wrapper :global(.w-12) {
          background: #f3f4f6 !important;
          border-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}
