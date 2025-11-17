import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      feature: 'Custom Portfolio Templates',
      free: true,
      description: '5 beautiful templates including Dark, Vision Pro, Arctic, Tokyo Neon & Holographic'
    },
    {
      feature: 'AI-Powered Voice Assistant',
      free: true,
      description: 'Let visitors talk to your AI assistant about your work and experience'
    },
    {
      feature: 'Unlimited Links',
      free: true,
      description: 'Add unlimited project links, social profiles, and custom URLs'
    },
    {
      feature: 'GitHub Integration',
      free: true,
      description: 'Showcase your GitHub contributions and activity automatically'
    },
    {
      feature: 'Custom Domain',
      free: false,
      description: 'Use your own domain name (yourname.com) instead of link4coders/username'
    },
    {
      feature: 'Analytics Dashboard',
      free: true,
      description: 'Track link clicks, visitor engagement, and performance metrics'
    },
    {
      feature: 'Link Categories',
      free: true,
      description: 'Organize your links into Projects, Social, Blogs, Achievements & more'
    },
    {
      feature: 'Tech Stack Display',
      free: true,
      description: 'Showcase your skills with beautiful tech stack icons'
    },
    {
      feature: 'Profile Privacy Controls',
      free: true,
      description: 'Make your profile public or private with one click'
    },
    {
      feature: 'Image Uploads',
      free: true,
      description: 'Add custom images to your links and projects'
    },
    {
      feature: 'Real-time Preview',
      free: true,
      description: 'See changes instantly as you build your portfolio'
    },
    {
      feature: 'Priority Support',
      free: false,
      description: 'Get dedicated support and feature requests prioritized'
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-[#1a1a1c]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] bg-clip-text text-transparent">Stand Out</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Build a stunning portfolio in minutes with our comprehensive feature set
          </p>
        </div>

        {/* Features Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-semibold text-base py-4">Feature</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-base text-center py-4">Free Plan</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-base py-4">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((item, index) => (
                  <TableRow 
                    key={index}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="font-medium text-white py-4">
                      {item.feature}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {item.free ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-500/20 border border-gray-500/30">
                          <X className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm py-4">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

         
        </div>
      </div>
    </section>
  );
}
