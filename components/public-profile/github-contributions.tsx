'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GitHubContributionsProps {
  githubUsername: string;
}

export function GitHubContributions({ githubUsername }: GitHubContributionsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Set loading to false after a short delay to allow image to load
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!githubUsername) return null;

  const contributionUrl = `https://ghchart.rshah.org/${githubUsername}`;

  return (
    <div className="w-full mb-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Image 
            src="/icons/social/github.png" 
            alt="GitHub" 
            width={24} 
            height={24}
            className="opacity-80"
          />
          <h3 className="text-xl font-semibold text-white">
            GitHub Contributions
          </h3>
        </div>
        
        <div className="relative w-full overflow-x-auto">
          {loading && (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-[#54E0FF] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {!error ? (
            <img
              src={contributionUrl}
              alt={`${githubUsername}'s GitHub contributions`}
              className={`w-full rounded-lg ${loading ? 'hidden' : 'block'}`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError(true);
                setLoading(false);
              }}
              loading="lazy"
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Unable to load GitHub contributions</p>
              <a 
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54E0FF] hover:underline mt-2 inline-block"
              >
                View on GitHub →
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Last 12 months of activity</span>
          <a 
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#54E0FF] hover:underline flex items-center gap-1"
          >
            View full profile
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
