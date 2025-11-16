import React from 'react';
import Link from 'next/link';

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: "Minimalist",
      description: "Clean and simple design focused on your content",
      category: "Free",
      likes: 1240,
      image: "/templates/minimalist.png"
    },
    {
      id: 2,
      name: "Terminal",
      description: "Developer-focused design that looks like a code terminal",
      category: "Premium",
      likes: 890,
      image: "/templates/terminal.png"
    },
    {
      id: 3,
      name: "Cyberpunk",
      description: "Futuristic neon design with vibrant colors",
      category: "Premium",
      likes: 1450,
      image: "/templates/cyberpunk.png"
    },
    {
      id: 4,
      name: "Glassmorphism",
      description: "Modern frosted glass effect design",
      category: "Premium",
      likes: 1120,
      image: "/templates/glassmorphism.png"
    },
    {
      id: 5,
      name: "Dark Mode",
      description: "Sleek dark theme for better readability",
      category: "Free",
      likes: 980,
      image: "/templates/dark.png"
    },
    {
      id: 6,
      name: "Gradient",
      description: "Vibrant gradient backgrounds with clean typography",
      category: "Premium",
      likes: 1320,
      image: "/templates/gradient.png"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
            Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose the perfect template for your portfolio
          </p>
        </div>
        <button className="px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
          Upload Template
        </button>
      </div>

      {/* Template Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all whitespace-nowrap">
          All Templates
        </button>
        <button className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/40 transition-all whitespace-nowrap">
          Free
        </button>
        <button className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/40 transition-all whitespace-nowrap">
          Premium
        </button>
        <button className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/40 transition-all whitespace-nowrap">
          Most Popular
        </button>
        <button className="px-4 py-2 bg-white/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/40 transition-all whitespace-nowrap">
          Recently Added
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 bg-gray-200 border-b border-gray-300 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Template Preview</span>
              </div>
              {template.category === "Premium" && (
                <div className="absolute top-3 right-3 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full">
                  PREMIUM
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{template.likes}</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{template.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-white/50 rounded-full text-gray-700">
                  {template.category}
                </span>
                <div className="space-x-2">
                  <Link href={`/dashboard/templates/preview/${template.id}`} className="text-sm px-3 py-1 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
                    Preview
                  </Link>
                  <button className="text-sm px-3 py-1 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all">
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marketplace CTA */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Want to create your own template?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Join our template marketplace and earn money from your designs. Creators earn 80% of all sales.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white font-medium rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
          Become a Creator
        </button>
      </div>
    </div>
  );
}