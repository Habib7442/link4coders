import React from 'react';

export default function PublicPortfolioPage({ params }: { params: { username: string } }) {
  // In a real app, this would be fetched from the database
  const user = {
    name: "Habib Tanwir Laskar",
    username: params.username,
    title: "Full-Stack Developer",
    bio: "I build scalable web applications with React, Node.js, and cloud technologies. Passionate about creating beautiful, functional user experiences.",
    avatar: "H",
    skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS", "Docker"],
    projects: [
      {
        name: "Portfolio Builder",
        description: "AI-powered portfolio creation tool with voice capabilities.",
        tech: ["Next.js", "VAPI", "OpenAI", "Supabase"],
        github: "https://github.com/habib/portfolio-builder"
      },
      {
        name: "Code Review Assistant",
        description: "Automated code review tool using AI to identify potential issues.",
        tech: ["Python", "TensorFlow", "GitHub API"],
        github: "https://github.com/habib/code-review"
      },
      {
        name: "Task Management App",
        description: "Collaborative task management application with real-time updates.",
        tech: ["React", "Socket.io", "Express", "MongoDB"],
        github: "https://github.com/habib/task-manager"
      }
    ],
    socialLinks: {
      github: "https://github.com/habib",
      linkedin: "https://linkedin.com/in/habibtanwir",
      twitter: "https://twitter.com/habibtanwir"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
            {user.avatar}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {user.name}
          </h1>
          <p className="text-xl text-[#FF6B35] font-medium mb-4">{user.title}</p>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {user.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-full text-gray-900 dark:text-white shadow-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                
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
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center">
          <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
            🎤
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ask Me Anything</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I have an AI voice assistant that can answer questions about my projects, skills, and experience. 
            Click below to start a conversation!
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white font-medium rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
            Start Voice Conversation
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Powered by Link4Coders - The world&apos;s first voice-enabled developer portfolio platform
          </p>
        </div>
      </div>
    </div>
  );
}