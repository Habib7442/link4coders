import React from 'react';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF914D] bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your public portfolio information
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF914D] text-white rounded-lg hover:from-[#FF844B] hover:to-[#FFB088] transition-all shadow-lg">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  defaultValue="Habib Tanwir Laskar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  defaultValue="habib"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  defaultValue="Full-stack developer passionate about creating beautiful, functional web applications. Specializing in React, Node.js, and cloud technologies."
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="https://github.com/username"
                  defaultValue="https://github.com/habib"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="https://linkedin.com/in/username"
                  defaultValue="https://linkedin.com/in/habibtanwir"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="https://twitter.com/username"
                  defaultValue="https://twitter.com/habibtanwir"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personal Website
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Preview */}
        <div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Preview</h2>
            <div className="bg-white/50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-xl mr-4">
                  H
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Habib Tanwir Laskar</h3>
                  <p className="text-gray-600 text-sm">@habib</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4">
                Full-stack developer passionate about creating beautiful, functional web applications. Specializing in React, Node.js, and cloud technologies.
              </p>
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold">GH</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold">LI</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold">TW</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35]/10 transition-all">
              Preview Public Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}