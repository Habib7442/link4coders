import React from 'react';
import { VapiVoiceButton } from '@/components/voice/vapi-voice-button';

interface MinimalTemplateProps {
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

export default function MinimalTemplate({ user, voiceAssistant, vapiPublicKey }: MinimalTemplateProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-3xl mx-auto mb-6">
            {user.avatar}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 break-words px-4">
            {user.name}
          </h1>
          <p className="text-lg sm:text-xl text-[#FF6B35] font-medium mb-4 break-words px-4">{user.title}</p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 break-words px-4">
            {user.bio}
          </p>
          
          <div className="flex justify-center space-x-4">
            <a href={user.socialLinks.github} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <span className="font-bold text-gray-700 dark:text-gray-300">GH</span>
            </a>
            <a href={user.socialLinks.linkedin} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <span className="font-bold text-gray-700 dark:text-gray-300">LI</span>
            </a>
            <a href={user.socialLinks.twitter} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <span className="font-bold text-gray-700 dark:text-gray-300">TW</span>
            </a>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {user.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{project.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 break-words">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="px-2 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={project.github} 
                  className="inline-flex items-center text-[#FF6B35] hover:underline"
                >
                  View on GitHub
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* AI Voice Assistant */}
        {voiceAssistant && vapiPublicKey && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
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
  );
}