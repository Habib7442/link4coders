import React, { useState } from 'react';

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
  tech: string[];
}

interface Resume {
  name: string;
  title: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
}

export default function AIResumeGenerator() {
  const [githubUrl, setGithubUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resume, setResume] = useState<Resume | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setResume({
        name: "Habib Tanwir Laskar",
        title: "Full-Stack Developer",
        email: "habib@example.com",
        github: "github.com/habib",
        linkedin: "linkedin.com/in/habibtanwir",
        skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS"],
        experience: [
          {
            company: "TechCorp",
            position: "Senior Frontend Developer",
            duration: "2022 - Present",
            description: "Led frontend development for enterprise SaaS platform serving 100k+ users."
          },
          {
            company: "StartupXYZ",
            position: "Full-Stack Developer",
            duration: "2020 - 2022",
            description: "Developed and maintained multiple web applications using React and Node.js."
          }
        ],
        projects: [
          {
            name: "Portfolio Builder",
            description: "AI-powered portfolio creation tool with voice capabilities.",
            tech: ["Next.js", "VAPI", "OpenAI", "Supabase"]
          },
          {
            name: "Code Review Assistant",
            description: "Automated code review tool using AI to identify potential issues.",
            tech: ["Python", "TensorFlow", "GitHub API"]
          }
        ]
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
          AI Resume Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate a professional resume from your GitHub profile and projects
        </p>
      </div>

      {!resume ? (
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
            📄
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generate Your Resume</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Enter your GitHub profile URL and let our AI analyze your projects to create a professional resume.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              GitHub Profile URL
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!githubUrl || isGenerating}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              githubUrl && !isGenerating
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white hover:from-[#FF844B] hover:to-[#FFB088] shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing your profile...
              </div>
            ) : (
              'Generate Resume'
            )}
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Your data is secure and private. We only access public GitHub information.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF914D] p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{resume.name}</h2>
                <p className="text-white/90">{resume.title}</p>
              </div>
              <div className="text-right">
                <p>{resume.email}</p>
                <p>{resume.github}</p>
                <p>{resume.linkedin}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Experience</h3>
              <div className="space-y-6">
                {resume.experience.map((exp: Experience, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between">
                      <h4 className="font-bold text-gray-900 dark:text-white">{exp.position}</h4>
                      <span className="text-gray-600 dark:text-gray-300">{exp.duration}</span>
                    </div>
                    <p className="text-[#FF6B35] font-medium">{exp.company}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Projects */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.projects.map((project: Project, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{project.name}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.tech.map((tech: string, techIndex: number) => (
                        <span key={techIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
                Download PDF
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
                Enhance with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}