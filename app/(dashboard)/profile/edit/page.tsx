import React from 'react';

export default function EditProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
          Edit Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update your portfolio information and showcase your skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Edit Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  About Me (AI Enhanced)
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="Describe your background, skills, and what drives you as a developer..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Enhance with AI</span>
                  <button className="text-sm px-3 py-1 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all">
                    Enhance
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skills</h2>
              <button className="text-sm px-3 py-1 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS'].map((skill, index) => (
                <div key={index} className="flex items-center bg-white/50 px-3 py-1 rounded-full border border-gray-200">
                  <span className="text-gray-700">{skill}</span>
                  <button className="ml-2 text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add new skill
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 bg-white/50 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="Enter a skill"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-r-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
              <button className="text-sm px-3 py-1 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
                + Add Achievement
              </button>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900">Hackathon Winner</h3>
                  <button className="text-gray-500 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">Won 1st place at TechCrunch Disrupt Hackathon 2024</p>
                <span className="text-xs text-gray-500">Oct 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        <div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Assistant</h2>
            <div className="bg-white/50 rounded-xl p-4 border border-gray-200 mb-4">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-sm mr-3">
                  AI
                </div>
                <div>
                  <p className="text-gray-700 text-sm">
                    I can help you enhance your profile content, suggest skills based on your projects, and optimize your portfolio for recruiters.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all text-sm">
                Suggest Skills
              </button>
              <button className="w-full py-2 px-4 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all text-sm">
                Optimize Content
              </button>
              <button className="w-full py-2 px-4 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all text-sm">
                Generate Summary
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white font-medium rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
          Save Profile
        </button>
      </div>
    </div>
  );
}