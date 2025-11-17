import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPublicProfile } from '@/server/actions/public-profile.actions';
import { ClickableLink } from '@/components/public-profile/clickable-link';
import { GitHubContributions } from '@/components/public-profile/github-contributions';
import AppleVisionProTemplate from '@/components/templates/AppleVisionPro';
import HolographicCardTemplate from '@/components/templates/HolographicCard';
import ArcticMinimalTemplate from '@/components/templates/ArcticMinimal';
import TokyoNeonTemplate from '@/components/templates/TokyoNeon';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  
  // Validate username
  if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
    notFound();
  }
  
  // Fetch profile data
  const result = await getPublicProfile(username);
  
  if (!result.success || !result.user) {
    notFound();
  }
  
  const { user, links, voiceAssistant } = result;
  
  // Check if profile is private
  const isProfilePublic = (user as unknown as Record<string, unknown>).profile_public;
  if (isProfilePublic === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#18181a] to-[#1e1e20] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">This Account is Private</h1>
          <p className="text-gray-400 text-sm md:text-base">
            This profile has been set to private by the user.
          </p>
        </div>
      </div>
    );
  }
  
  // Get VAPI public key from env
  const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
  
  // Extract GitHub username from GitHub URL
  let githubUsername = user.github_username || '';
  if (!githubUsername && user.github_url) {
    // Extract username from URLs like:
    // https://github.com/Habib7442
    // github.com/Habib7442
    const match = user.github_url.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
      githubUsername = match[1];
    }
  }
  
  // Get user's template (default to developer-dark)
  const templateId = user.theme_id || 'developer-dark';
  
  // Render Arctic Minimal template
  if (templateId === 'arctic-minimal') {
    return (
      <ArcticMinimalTemplate 
        user={user} 
        links={links as Record<string, Array<{ id: string; url: string; title: string; description?: string; icon_type?: string; link_image?: string }>>}
        voiceAssistant={voiceAssistant}
        vapiPublicKey={vapiPublicKey}
        githubUsername={githubUsername}
      />
    );
  }
  
  // Render Tokyo Neon template
  if (templateId === 'tokyo-neon') {
    return (
      <TokyoNeonTemplate 
        user={user} 
        links={links as Record<string, Array<{ id: string; url: string; title: string; description?: string; icon_type?: string; link_image?: string }>>}
        voiceAssistant={voiceAssistant}
        vapiPublicKey={vapiPublicKey}
        githubUsername={githubUsername}
      />
    );
  }
  
  // Render Holographic Card template
  if (templateId === 'holographic-card') {
    return (
      <HolographicCardTemplate 
        user={user} 
        links={links as Record<string, Array<{ id: string; url: string; title: string; description?: string; icon_type?: string; link_image?: string }>>}
        voiceAssistant={voiceAssistant}
        vapiPublicKey={vapiPublicKey}
        githubUsername={githubUsername}
      />
    );
  }
  
  // Render Apple Vision Pro template
  if (templateId === 'apple-vision-pro') {
    return (
      <AppleVisionProTemplate 
        user={user} 
        links={links as Record<string, Array<{ id: string; url: string; title: string; description?: string; icon_type?: string; link_image?: string }>>}
        voiceAssistant={voiceAssistant}
        vapiPublicKey={vapiPublicKey}
        githubUsername={githubUsername}
      />
    );
  }
  
  // For other templates, use Developer Dark as fallback for now
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181a] to-[#1e1e20]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
          {user.avatar_url ? (
            <div className="w-32 h-32 mx-auto mb-6 relative rounded-full overflow-hidden border-4 border-[#54E0FF]">
              <Image
                src={user.avatar_url}
                alt={user.full_name || 'User avatar'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] flex items-center justify-center text-[#18181a] text-4xl font-bold">
              {user.full_name?.[0] || user.email?.[0] || 'U'}
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-white mb-2">
            {user.full_name || 'Developer'}
          </h1>
          
          {user.profile_title && (
            <p className="text-xl text-[#54E0FF] mb-4">{user.profile_title}</p>
          )}
          
          {user.bio && (
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              {user.bio}
            </p>
          )}
          
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-6">
            {user.github_url && (
              <a
                href={user.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-[#54E0FF]/50 transition-all group"
              >
                <Image src="/icons/social/github.png" alt="GitHub" width={20} height={20} />
                <span className="text-white text-sm group-hover:text-[#54E0FF] transition-colors">GitHub</span>
              </a>
            )}
            {user.linkedin_url && (
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-[#54E0FF]/50 transition-all group"
              >
                <Image src="/icons/social/linkedin.png" alt="LinkedIn" width={20} height={20} />
                <span className="text-white text-sm group-hover:text-[#54E0FF] transition-colors">LinkedIn</span>
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://x.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-[#54E0FF]/50 transition-all group"
              >
                <Image src="/icons/social/x.png" alt="X" width={20} height={20} />
                <span className="text-white text-sm group-hover:text-[#54E0FF] transition-colors">X</span>
              </a>
            )}
            {user.website_url && (
              <a
                href={user.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-[#54E0FF]/50 transition-all group"
              >
                <Image src="/icons/social/website.png" alt="Website" width={20} height={20} />
                <span className="text-white text-sm group-hover:text-[#54E0FF] transition-colors">Website</span>
              </a>
            )}
          </div>
          
          {/* AI Voice Assistant */}
          {voiceAssistant && vapiPublicKey && (
            <div className="mb-8">
              <VapiVoiceButton
                userId={user.id}
                assistantId={voiceAssistant.assistant_id}
                publicKey={vapiPublicKey}
                firstMessage={voiceAssistant.first_message || undefined}
              />
            </div>
          )}
          
          {/* Tech Stacks */}
          {user.tech_stacks && user.tech_stacks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {user.tech_stacks.map((tech: string, idx: number) => {
                const techLower = tech.toLowerCase().replace(/\s+/g, '-');
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#54E0FF]/50 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-6 h-6 rounded overflow-hidden">
                      <Image
                        src={`/techstacks/${techLower}.png`}
                        alt={tech}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-[#54E0FF] transition-colors">
                      {tech}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          </div>
          
          {/* GitHub Contributions */}
          {githubUsername && user.show_github_contributions !== false && (
            <GitHubContributions githubUsername={githubUsername} />
          )}
          
          {/* Links */}
          <div>
          {Object.entries(links).map(([category, categoryLinks]) => {
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
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{categoryEmoji}</span>
                  <h2 className="text-2xl font-bold text-white capitalize">{category}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-4" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(categoryLinks as Array<{ id: string; url: string; title: string; description?: string; icon_type?: string; link_image?: string }>).map((link) => (
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
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#1e1e20] mt-20">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} {user.full_name || 'Developer'}. Built with Link4Devs.
          </p>
        </div>
      </footer>
    </div>
  );
}