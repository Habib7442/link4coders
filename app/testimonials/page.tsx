'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function TestimonialsPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    rating: 5,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please sign in to submit a testimonial');
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#54E0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Thank you for your testimonial!');
        setFormData({
          name: '',
          email: '',
          role: '',
          company: '',
          rating: 5,
          message: '',
        });
      } else {
        toast.error('Failed to submit testimonial. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181a]">
      <Header />
      
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your <span className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] bg-clip-text text-transparent">Experience</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Help us improve by sharing your feedback about Link4Coders
          </p>
        </div>

        {/* Testimonial Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54E0FF]/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54E0FF]/50 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54E0FF]/50 transition-colors"
                  placeholder="Full Stack Developer"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54E0FF]/50 transition-colors"
                  placeholder="Tech Corp"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'fill-[#54E0FF] text-[#54E0FF]'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Your Testimonial <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#54E0FF]/50 transition-colors resize-none"
                placeholder="Tell us about your experience with Link4Coders..."
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-black font-semibold py-3 rounded-lg hover:shadow-[0_0_30px_rgba(84,224,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </Button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Your testimonial helps us improve and helps others discover Link4Coders
          </p>
        </div>
      </main>
    </div>
  );
}
