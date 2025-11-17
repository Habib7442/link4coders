'use client';

import { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Github, Linkedin, Globe, Mail, BookOpen, Award, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createLink, updateLink } from '@/server/actions/link.actions';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  editLink?: {
    id: string;
    title: string;
    url: string;
    description?: string;
    category: string;
    icon_type?: string;
    live_project_url?: string;
  } | null;
  defaultCategory?: string;
}

// Custom X icon component for social media
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const categories = [
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'projects', label: 'Projects', icon: '💼' },
  { value: 'blogs', label: 'Blogs', icon: '📝' },
  { value: 'achievements', label: 'Achievements', icon: '🏆' },
  { value: 'contact', label: 'Contact', icon: '📧' },
  { value: 'social', label: 'Social', icon: '🌐' }
];

const iconTypes = [
  { value: 'link', label: 'Link', icon: LinkIcon },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'X', icon: XIcon },
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'dev-to', label: 'Dev.to', icon: BookOpen },
  { value: 'medium', label: 'Medium', icon: BookOpen },
  { value: 'hashnode', label: 'Hashnode', icon: BookOpen },
  { value: 'leetcode', label: 'LeetCode', icon: Award },
  { value: 'custom', label: 'Custom', icon: Upload }
];

export function AddLinkModal({ isOpen, onClose, onSuccess, userId, editLink, defaultCategory }: AddLinkModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: defaultCategory || 'contact',
    icon_type: 'link',
    live_project_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editLink) {
      setFormData({
        title: editLink.title,
        url: editLink.url,
        description: editLink.description || '',
        category: editLink.category,
        icon_type: editLink.icon_type || 'link',
        live_project_url: editLink.live_project_url || ''
      });
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        category: defaultCategory || 'contact',
        icon_type: 'link',
        live_project_url: ''
      });
    }
  }, [editLink, defaultCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate URL
    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (editLink) {
        result = await updateLink(userId, editLink.id, {
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          icon_type: formData.icon_type,
          live_project_url: formData.live_project_url.trim() || undefined
        });
      } else {
        result = await createLink(userId, {
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          icon_type: formData.icon_type,
          live_project_url: formData.live_project_url.trim() || undefined
        });
      }

      if (result.success) {
        toast.success(editLink ? 'Link updated successfully' : 'Link created successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to save link');
      }
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error('Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glassmorphic max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editLink ? 'Edit Link' : 'Add New Link'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editLink ? 'Update your link details' : 'Add a new link to your profile'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter link title"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              disabled={loading}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white">
              URL <span className="text-red-400">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter a brief description (optional)"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px]"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">
              Category <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={loading}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glassmorphic border-white/10">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Icon Type */}
          <div className="space-y-2">
            <Label htmlFor="icon_type" className="text-white">
              Icon Type
            </Label>
            <Select
              value={formData.icon_type}
              onValueChange={(value) => setFormData({ ...formData, icon_type: value })}
              disabled={loading}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glassmorphic border-white/10">
                {iconTypes.map((icon) => {
                  const IconComponent = icon.icon;
                  return (
                    <SelectItem key={icon.value} value={icon.value} className="text-white hover:bg-white/10">
                      <span className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {icon.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Live Project URL (only for projects category) */}
          {formData.category === 'projects' && (
            <div className="space-y-2">
              <Label htmlFor="live_project_url" className="text-white">
                Live Project URL
              </Label>
              <Input
                id="live_project_url"
                type="url"
                value={formData.live_project_url}
                onChange={(e) => setFormData({ ...formData, live_project_url: e.target.value })}
                placeholder="https://your-project-demo.com (optional)"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                disabled={loading}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-white/20 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
            >
              {loading ? 'Saving...' : editLink ? 'Update Link' : 'Add Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
