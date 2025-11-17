'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { AuthModal } from '@/components/ui/auth-modal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export function PricingSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };
  return (
    <section id="pricing" className="py-20 px-4 bg-[#18181a]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, <span className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for getting started</p>
            </div>

            <button
              onClick={handleGetStarted}
              className="block w-full text-center px-6 py-3 bg-white/5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all mb-8"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
            </button>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">5 Beautiful Templates</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">AI Voice Assistant</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Unlimited Links</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">GitHub Integration</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Analytics Dashboard</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Image Uploads</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Privacy Controls</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Real-time Preview</span>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-[#54E0FF]/10 to-[#29ADFF]/10 border-2 border-[#54E0FF]/50 rounded-2xl p-8 backdrop-blur-sm relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-black text-sm font-semibold rounded-full">
              Coming Soon
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-white">$5</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">For professionals who want more</p>
            </div>

            <button 
              disabled
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-black font-semibold rounded-lg opacity-50 cursor-not-allowed mb-8"
            >
              Coming Soon
            </button>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Everything in Free</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Custom Domain Support</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Priority Support</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Advanced Analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Remove Branding</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Early Access to Features</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-[#54E0FF]" />
                </div>
                <span className="text-gray-300">Custom Templates</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            All plans include unlimited bandwidth and 99.9% uptime guarantee
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
    </section>
  );
}
