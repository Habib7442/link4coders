import React from 'react';

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Voice Portfolio Assistant",
      description: "Every portfolio gets a personal AI voice assistant that can answer recruiter questions about your projects and skills.",
      icon: "🎤"
    },
    {
      title: "Voice-to-Portfolio Builder",
      description: "Create your full portfolio by simply talking. AI asks questions and fills sections automatically.",
      icon: "🗣️"
    },
    {
      title: "AI Resume Generator",
      description: "One-click resume generation using your GitHub repositories, skills, and commits.",
      icon: "📄"
    },
    {
      title: "Recruiter Voice Notes",
      description: "Recruiters can leave voice messages for you that are automatically transcribed and analyzed.",
      icon: "📝"
    },
    {
      title: "AI Interview Practice",
      description: "Practice technical interviews with AI voice assistants in various roles and difficulty levels.",
      icon: "💼"
    },
    {
      title: "Portfolio Optimization",
      description: "AI audits your portfolio and provides actionable improvements for better recruiter engagement.",
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-6">
            Revolutionary Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The world&apos;s first voice-enabled developer portfolio platform powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            The Future of Developer Portfolios
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Link4Coders isn&apos;t just another portfolio tool. It&apos;s a developer identity platform powered by voice, AI, and community.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white font-medium rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}