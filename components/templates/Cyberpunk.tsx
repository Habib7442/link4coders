import React from 'react';
import VoiceWidget from '@/components/voice/VoiceWidget';

interface CyberpunkTemplateProps {
  user: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      tech: string[];
      github: string;
    }>;
    socialLinks: {
      github: string;
      linkedin: string;
      twitter: string;
    };
  };
}

export default function CyberpunkTemplate({ user }: CyberpunkTemplateProps) {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-cyan-400"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header with Glitch Effect */}
        <div className="text-center mb-16 relative">
          <div className="absolute -inset-1 bg-cyan-400 blur opacity-20 animate-pulse"></div>
          <div className="relative">
            <div className="w-32 h-32 bg-cyan-400/10 border-2 border-cyan-400 rounded-full flex items-center justify-center text-cyan-400 font-bold text-4xl mx-auto mb-6">
              {user.avatar}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 relative">
              <span className="relative z-10">{user.name}</span>
              <span className="absolute top-0 left-0 text-cyan-400/30 z-0" style={{ transform: 'translate(-2px, -2px)' }}>
                {user.name}
              </span>
            </h1>
            <p className="text-2xl text-pink-500 font-bold mb-6">{user.title}</p>
            <p className="text-cyan-300 max-w-2xl mx-auto mb-8 text-lg">
              {user.bio}
            </p>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a href={user.socialLinks.github} className="w-12 h-12 rounded-full bg-cyan-400/10 border-2 border-cyan-400 flex items-center justify-center hover:bg-cyan-400/20 transition-all transform hover:scale-110">
              <span className="font-bold text-cyan-400">GH</span>
            </a>
            <a href={user.socialLinks.linkedin} className="w-12 h-12 rounded-full bg-cyan-400/10 border-2 border-cyan-400 flex items-center justify-center hover:bg-cyan-400/20 transition-all transform hover:scale-110">
              <span className="font-bold text-cyan-400">LI</span>
            </a>
            <a href={user.socialLinks.twitter} className="w-12 h-12 rounded-full bg-cyan-400/10 border-2 border-cyan-400 flex items-center justify-center hover:bg-cyan-400/20 transition-all transform hover:scale-110">
              <span className="font-bold text-cyan-400">TW</span>
            </a>
          </div>
        </div>

        {/* Skills with Neon Glow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-pink-500">SKILLS</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {user.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-6 py-3 bg-cyan-400/10 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-all transform hover:scale-105 relative"
              >
                <span className="relative z-10">{skill}</span>
                <span className="absolute inset-0 bg-cyan-400 opacity-0 hover:opacity-20 rounded-lg"></span>
              </span>
            ))}
          </div>
        </div>

        {/* Projects with Holographic Effect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-pink-500">PROJECTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-cyan-400/5 border-2 border-cyan-400 rounded-2xl p-6 hover:bg-cyan-400/10 transition-all transform hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">{project.name}</h3>
                  <p className="text-cyan-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded text-sm border border-pink-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={project.github} 
                    className="inline-flex items-center text-cyan-400 hover:text-pink-400 hover:underline"
                  >
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Voice Assistant with Cyberpunk Styling */}
        <div className="bg-cyan-400/5 border-2 border-cyan-400 rounded-2xl p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">AI VOICE ASSISTANT</h2>
            <VoiceWidget />
          </div>
        </div>
      </div>
    </div>
  );
}