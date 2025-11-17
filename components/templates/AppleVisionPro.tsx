'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';
import { GitHubContributions } from '@/components/public-profile/github-contributions';
import { ClickableLink } from '@/components/public-profile/clickable-link';

interface AppleVisionProTemplateProps {
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

export default function AppleVisionProTemplate({ user, links, voiceAssistant, vapiPublicKey, githubUsername }: AppleVisionProTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number }>>([]);

  // Initialize particles
  useEffect(() => {
    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
    }));
    
    // Initialize particles in a function to avoid setState during effect
    const initializeParticles = () => {
      setParticles(newParticles);
    };
    
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(initializeParticles, 0);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        x: (p.x + p.vx + 100) % 100,
        y: (p.y + p.vy + 100) % 100,
        vx: p.vx,
        vy: p.vy,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getParallaxStyle = (depth: number) => {
    const offsetX = (mousePosition.x - 0.5) * depth;
    const offsetY = (mousePosition.y - 0.5) * depth;
    
    return {
      transform: `translate3d(${offsetX}px, ${offsetY}px, ${depth}px)`,
      transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
    };
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1A1A2E 50%, #16213E 100%)',
        perspective: '1000px',
      }}
    >
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20 blur-[1px]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          />
        ))}
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4FF]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B68EE]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Card - Main Floating Panel */}
          <div
            className="mb-12 floating-panel"
            style={getParallaxStyle(30)}
          >
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              {/* Light Refraction Border */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                background: 'linear-gradient(#1A1A2E, #1A1A2E) padding-box, linear-gradient(45deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3), rgba(255,255,0,0.3)) border-box',
                border: '1px solid transparent',
              }} />

              <div className="text-center relative z-10">
                {/* Avatar */}
                {user.avatar_url ? (
                  <div className="w-32 h-32 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 glass-panel">
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full glass-panel border-2 border-white/20 flex items-center justify-center text-white text-4xl font-thin">
                    {user.full_name?.[0] || 'U'}
                  </div>
                )}

                {/* Name & Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white mb-2 tracking-wide break-words px-4">
                  {user.full_name || 'Developer'}
                </h1>
                
                {user.profile_title && (
                  <p className="text-lg sm:text-xl text-[#00D4FF] font-light mb-4 tracking-wide break-words px-4">
                    {user.profile_title}
                  </p>
                )}

                {user.bio && (
                  <p className="text-sm sm:text-base text-[#A0AEC0] max-w-2xl mx-auto mb-6 font-light leading-relaxed tracking-wide break-words px-4">
                    {user.bio}
                  </p>
                )}

                {/* Social Links - Floating Orbs */}
                <div className="flex justify-center gap-4 mt-8">
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="floating-orb glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-[#00D4FF]/50 transition-all hover:scale-110 group"
                      style={getParallaxStyle(50)}
                    >
                      <svg className="w-5 h-5 text-white/70 group-hover:text-[#00D4FF] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="floating-orb glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-[#00D4FF]/50 transition-all hover:scale-110 group"
                      style={getParallaxStyle(50)}
                    >
                      <svg className="w-5 h-5 text-white/70 group-hover:text-[#00D4FF] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {user.twitter_username && (
                    <a
                      href={`https://x.com/${user.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="floating-orb glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-[#00D4FF]/50 transition-all hover:scale-110 group"
                      style={getParallaxStyle(50)}
                    >
                      <svg className="w-5 h-5 text-white/70 group-hover:text-[#00D4FF] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {user.website_url && (
                    <a
                      href={user.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="floating-orb glass-panel w-12 h-12 rounded-full flex items-center justify-center border border-white/20 hover:border-[#00D4FF]/50 transition-all hover:scale-110 group"
                      style={getParallaxStyle(50)}
                    >
                      <svg className="w-5 h-5 text-white/70 group-hover:text-[#00D4FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stacks - Floating Pills */}
          {user.tech_stacks && user.tech_stacks.length > 0 && (
            <div className="mb-12" style={getParallaxStyle(20)}>
              <div className="flex flex-wrap justify-center gap-3">
                {user.tech_stacks.map((tech: string, idx: number) => {
                  const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div
                      key={idx}
                      className="glass-panel px-4 py-2 rounded-full border border-white/20 hover:border-[#00D4FF]/50 transition-all hover:scale-105 floating-pill"
                      style={{
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/techstacks/${techLower}.png`}
                          alt={tech}
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <span className="text-sm text-white/90 font-light tracking-wide">{tech}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Voice Assistant */}
          {voiceAssistant && vapiPublicKey && (
            <div className="mb-12 flex justify-center" style={getParallaxStyle(25)}>
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
            <div className="mb-12" style={getParallaxStyle(20)}>
              <GitHubContributions githubUsername={githubUsername} />
            </div>
          )}

          {/* Links - 3D Floating Cards */}
          {links && Object.entries(links).map(([category, categoryLinks], categoryIdx) => {
            if (!Array.isArray(categoryLinks) || categoryLinks.length === 0) return null;

            return (
              <div key={category} className="mb-12" style={getParallaxStyle(10 + categoryIdx * 5)}>
                <h2 className="text-3xl font-extralight text-white mb-6 text-center tracking-widest">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryLinks.map((link) => (
                    <div
                      key={link.id}
                      className="floating-card"
                      style={{
                        animationDelay: `${categoryLinks.indexOf(link) * 0.15}s`,
                      }}
                    >
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
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel mt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <p className="text-sm text-[#A0AEC0] text-center font-light">
            © {new Date().getFullYear()} {user.full_name || 'Developer'}. Built with Link4Devs.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px) saturate(180%);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .floating-orb {
          animation: float 6s ease-in-out infinite;
        }

        .floating-pill {
          animation: float 8s ease-in-out infinite;
        }

        .floating-panel {
          animation: float 10s ease-in-out infinite;
        }

        .floating-card {
          animation: float 7s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .glass-panel:hover {
          box-shadow: 
            0 8px 32px rgba(0, 212, 255, 0.3),
            0 0 40px rgba(0, 212, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
