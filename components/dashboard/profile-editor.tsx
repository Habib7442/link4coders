'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { updateUserProfile } from '@/server/actions/profile.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { toast } from 'sonner';

interface ProfileEditorProps {
  initialData?: {
    name?: string;
    username?: string;
    title?: string;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    website_url?: string;
  };
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    title: '',
    bio: '',
    avatar_url: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    // Always use initialData if available, otherwise use user data from store
    const dataToUse = initialData || (user ? {
      name: user.name,
      username: user.username,
      title: user.title,
      bio: user.bio,
      avatar_url: user.avatar_url,
      github_url: user.github_url,
      linkedin_url: user.linkedin_url,
      twitter_url: user.twitter_url,
      website_url: user.website_url
    } : null);
    
    if (dataToUse) {
      setFormData({
        name: dataToUse.name || '',
        username: dataToUse.username || '',
        title: dataToUse.title || '',
        bio: dataToUse.bio || '',
        avatar_url: dataToUse.avatar_url || '',
        github_url: dataToUse.github_url || '',
        linkedin_url: dataToUse.linkedin_url || '',
        twitter_url: dataToUse.twitter_url || '',
        website_url: dataToUse.website_url || ''
      });
    }
  }, [user, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpdate = (avatarUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      avatar_url: avatarUrl || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await updateUserProfile(user.id, formData);
      
      if (result.success) {
        // Update Zustand store with new data
        setUser({
          ...user,
          ...formData
        });
        
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-medium text-white">Profile Picture</h3>
          <AvatarUpload
            currentAvatarUrl={formData.avatar_url}
            onAvatarUpdate={handleAvatarUpdate}
            size="lg"
          />
          <p className="text-sm text-gray-400 text-center">
            Upload a profile picture to make your profile more personal.
            <br />
            Recommended size: 200×200px. Formats: JPEG, PNG, WebP, GIF. Max size: 5MB
          </p>
        </div>

        <div className="border-t border-white/10 pt-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-200 mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-gray-200 mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-200 mb-2 block">
              Professional Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
              placeholder="e.g., Full-Stack Developer"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-200 mb-2 block">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github_url" className="text-sm font-medium text-gray-200 mb-2 block">
                GitHub
              </Label>
              <Input
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
                placeholder="https://github.com/username"
              />
            </div>
            
            <div>
              <Label htmlFor="linkedin_url" className="text-sm font-medium text-gray-200 mb-2 block">
                LinkedIn
              </Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div>
              <Label htmlFor="twitter_url" className="text-sm font-medium text-gray-200 mb-2 block">
                Twitter
              </Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
                placeholder="https://twitter.com/username"
              />
            </div>
            
            <div>
              <Label htmlFor="website_url" className="text-sm font-medium text-gray-200 mb-2 block">
                Personal Website
              </Label>
              <Input
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] hover:from-[#29ADFF] hover:to-[#54E0FF] text-[#18181a] font-medium px-6 py-2 rounded-lg transition-all shadow-lg"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-[#18181a] border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}