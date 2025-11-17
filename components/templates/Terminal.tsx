import React from 'react';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';

interface TerminalTemplateProps {
  user: {
    id: string;
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
  voiceAssistant?: {
    assistant_id: string;
    assistant_name?: string;
    first_message?: string;
  } | null;
  vapiPublicKey?: string;
}

export default function TerminalTemplate({ user, voiceAssistant, vapiPublicKey }: TerminalTemplateProps) {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="container mx-auto px-4 py-12">
        {/* Terminal Header */}
        <div className="border border-green-400 rounded-t-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
            <span className="text-gray-400">terminal - habib@link4coders: ~</span>
          </div>
        </div>
        
        {/* Terminal Content */}
        <div className="border-l border-r border-b border-green-400 rounded-b-lg p-6">
          <div className="mb-4">
            <span className="text-green-400">$ </span>
            <span className="animate-pulse">█</span>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">{'>'} whoami</p>
            <p className="ml-4 break-words">{user.name}</p>
            <p className="ml-4 text-green-300 break-words">{user.title}</p>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">{'>'} cat about.txt</p>
            <p className="ml-4 break-words">{user.bio}</p>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">{'>'} ls skills</p>
            <div className="ml-4 flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="bg-green-400/10 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">{'>'} ls projects</p>
            <div className="ml-4 space-y-4">
              {user.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-green-400 pl-4 py-2">
                  <p className="font-bold break-words">{project.name}</p>
                  <p className="text-green-300 break-words">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-green-400/10 px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={project.github} className="text-green-300 hover:underline inline-flex items-center mt-2">
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">{'>'} cat contact.txt</p>
            <div className="ml-4 flex space-x-4">
              <a href={user.socialLinks.github} className="hover:underline">GitHub</a>
              <a href={user.socialLinks.linkedin} className="hover:underline">LinkedIn</a>
              <a href={user.socialLinks.twitter} className="hover:underline">Twitter</a>
            </div>
          </div>
          
          {/* AI Voice Assistant */}
          {voiceAssistant && vapiPublicKey && (
            <div className="mt-8">
              <p className="mb-2">{'>'} run voice_assistant</p>
              <div className="ml-4 flex justify-start">
                <VapiVoiceButton
                  userId={user.id}
                  assistantId={voiceAssistant.assistant_id}
                  publicKey={vapiPublicKey}
                  firstMessage={voiceAssistant.first_message || undefined}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}