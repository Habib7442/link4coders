'use client';

import { useCallback } from 'react';
import { ExternalLink, Github, Linkedin, Globe, Mail, BookOpen, Award, Link2 } from 'lucide-react';

interface ClickableLinkProps {
  linkId: string;
  url: string;
  title: string;
  description?: string;
  iconType?: string;
  children?: React.ReactNode;
}

export function ClickableLink({ linkId, url, title, description, iconType }: ClickableLinkProps) {
  const handleClick = useCallback(async () => {
    console.log('🔵 [ClickableLink] Link clicked:', { linkId, title, url });
    
    try {
      // Track click asynchronously (fire and forget)
      console.log('🔵 [ClickableLink] Sending tracking request...');
      
      const response = await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkId }),
        keepalive: true, // Ensure request completes even if page navigates away
      });
      
      const result = await response.json();
      console.log('✅ [ClickableLink] Tracking response:', result);
    } catch (error) {
      console.error('❌ [ClickableLink] Failed to track click:', error);
    }
  }, [linkId, title, url]);

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    
    switch (iconType?.toLowerCase()) {
      case 'github':
        return <Github className={iconClass} />;
      case 'linkedin':
        return <Linkedin className={iconClass} />;
      case 'twitter':
      case 'x':
        return <span className="text-lg">𝕏</span>;
      case 'website':
      case 'globe':
        return <Globe className={iconClass} />;
      case 'email':
      case 'mail':
        return <Mail className={iconClass} />;
      case 'dev-to':
      case 'medium':
      case 'hashnode':
        return <BookOpen className={iconClass} />;
      case 'leetcode':
      case 'award':
        return <Award className={iconClass} />;
      default:
        return <Link2 className={iconClass} />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#54E0FF]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#54E0FF]/20"
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#54E0FF]/20 to-[#29ADFF]/20 border border-[#54E0FF]/30 flex items-center justify-center text-[#54E0FF] group-hover:scale-110 transition-transform duration-300">
            {getIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg group-hover:text-[#54E0FF] transition-colors truncate">
                {title}
              </h3>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#54E0FF] opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            {description && (
              <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#54E0FF]/0 via-[#54E0FF]/5 to-[#29ADFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </a>
  );
}
