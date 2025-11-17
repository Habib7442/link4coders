'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { updateUserProfile } from '@/server/actions/profile.actions';
import { checkUsernameAvailability } from '@/server/actions/username.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { TechStackSelector } from '@/components/dashboard/tech-stack-selector';
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
    tech_stacks?: string[];
    show_github_contributions?: boolean;
  };
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    title: '',
    bio: '',
    avatar_url: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    tech_stacks: [] as string[],
    show_github_contributions: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState({
    checking: false,
    available: false,
    error: ''
  });

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        username: initialData.username || '',
        title: initialData.title || '',
        bio: initialData.bio || '',
        avatar_url: initialData.avatar_url || '',
        github_url: initialData.github_url || '',
        linkedin_url: initialData.linkedin_url || '',
        twitter_url: initialData.twitter_url || '',
        website_url: initialData.website_url || '',
        tech_stacks: initialData.tech_stacks || [],
        show_github_contributions: initialData.show_github_contributions !== undefined ? initialData.show_github_contributions : true
      });
    }
  }, [initialData]);

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

  const checkUsername = async () => {
    if (!formData.username) {
      setUsernameCheck({
        checking: false,
        available: false,
        error: 'Username is required'
      });
      return;
    }

    setUsernameCheck({
      checking: true,
      available: false,
      error: ''
    });

    try {
      const result = await checkUsernameAvailability(formData.username, user?.id);
      
      if (result.success) {
        setUsernameCheck({
          checking: false,
          available: result.available,
          error: result.available ? '' : 'Username is already taken'
        });
      } else {
        setUsernameCheck({
          checking: false,
          available: false,
          error: result.error || 'Failed to check username'
        });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameCheck({
        checking: false,
        available: false,
        error: 'An unexpected error occurred'
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsSaving(true);
    
    try {
      // Map form fields to database fields
      const profileData = {
        full_name: formData.name,
        profile_slug: formData.username,
        profile_title: formData.title,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_username: formData.twitter_url ? formData.twitter_url.replace('https://twitter.com/', '') : undefined,
        website_url: formData.website_url,
        tech_stacks: formData.tech_stacks,
        show_github_contributions: formData.show_github_contributions
      };
      
      const result = await updateUserProfile(user.id, profileData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        // Data is already revalidated on the server side via revalidatePath
        // No need for router.refresh() which causes loading state issues
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
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF] pr-10"
                  placeholder="Enter your username"
                />
                {usernameCheck.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#54E0FF] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {usernameCheck.available && !usernameCheck.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                )}
                {!usernameCheck.available && usernameCheck.error && !usernameCheck.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    ✗
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={checkUsername}
                disabled={usernameCheck.checking || !formData.username}
                className="bg-[#28282b] border border-[#33373b] text-white hover:bg-[#33373b] hover:border-[#54E0FF]/30 font-medium text-[14px] px-3"
              >
                Check
              </Button>
            </div>
            {usernameCheck.error && !usernameCheck.checking && (
              <p className="text-red-400 text-[12px] mt-1">{usernameCheck.error}</p>
            )}
            {usernameCheck.available && !usernameCheck.checking && (
              <p className="text-green-400 text-[12px] mt-1">Username is available!</p>
            )}
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
          
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-200 mb-2 block">
              Tech Stack
            </Label>
            <TechStackSelector
              selectedTechStacks={formData.tech_stacks}
              onChange={(techStacks) => setFormData(prev => ({ ...prev, tech_stacks: techStacks }))}
            />
            <p className="text-[12px] text-gray-400 mt-1">Select technologies you work with to showcase your skills.</p>
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
                X (formerly Twitter)
              </Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#54E0FF] focus:border-[#54E0FF]"
                placeholder="https://x.com/username"
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
        
        {/* Display Settings */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-medium text-white mb-4">Display Settings</h3>
          <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex-1">
              <Label htmlFor="show-github-contributions" className="text-sm font-medium text-gray-200 cursor-pointer">
                Show GitHub Contributions
              </Label>
              <p className="text-xs text-gray-400 mt-1">
                Display your GitHub contribution graph on your public profile
              </p>
            </div>
            <Switch
              id="show-github-contributions"
              checked={formData.show_github_contributions}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_github_contributions: checked }))}
            />
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