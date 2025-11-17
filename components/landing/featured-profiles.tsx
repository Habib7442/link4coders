import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProfiles } from '@/server/actions/public-profile.actions';

export async function FeaturedProfiles() {
  const { profiles } = await getFeaturedProfiles(6);

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-[#18181a]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our <span className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] bg-clip-text text-transparent">Developers</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover amazing portfolios created by developers from around the world
          </p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Link 
              key={profile.id} 
              href={`/${profile.profile_slug}`}
              className="block group"
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 transition-all duration-300 h-full hover:bg-white/[0.05] hover:border-[#54E0FF]/30 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(84,224,255,0.1)]">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#54E0FF]/30 mx-auto transition-colors group-hover:border-[#54E0FF]">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Developer'}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Theme Badge */}
                  {profile.theme_id && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-black">
                      {profile.theme_id === 'developer-dark' && '🌑 Dark'}
                      {profile.theme_id === 'apple-vision-pro' && '🍎 Vision'}
                      {profile.theme_id === 'holographic-card' && '✨ Holo'}
                      {profile.theme_id === 'arctic-minimal' && '❄️ Arctic'}
                      {profile.theme_id === 'tokyo-neon' && '🌃 Tokyo'}
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1 transition-colors group-hover:text-[#54E0FF]">
                    {profile.full_name || 'Developer'}
                  </h3>
                  {profile.profile_title && (
                    <p className="text-sm text-gray-400 mb-2">{profile.profile_title}</p>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Tech Stack */}
                {profile.tech_stacks && profile.tech_stacks.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {profile.tech_stacks.slice(0, 4).map((tech: string, idx: number) => {
                      const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
                        >
                          <Image
                            src={`/techstacks/${techLower}.png`}
                            alt={tech}
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5"
                          />
                          <span>{tech}</span>
                        </div>
                      );
                    })}
                    {profile.tech_stacks.length > 4 && (
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                        +{profile.tech_stacks.length - 4}
                      </div>
                    )}
                  </div>
                )}

                {/* View Profile Link */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#54E0FF] opacity-0 transition-opacity group-hover:opacity-100">
                  <span>View Profile</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
