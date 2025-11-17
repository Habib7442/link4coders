'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Link as LinkIcon, Github, Linkedin, Globe, Mail, BookOpen, Award, Upload, Image as ImageIcon } from 'lucide-react';
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
import { createClient } from '@/lib/supabase-client';
import Image from 'next/image';

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
    link_image?: string;
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
    live_project_url: '',
    link_image: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editLink) {
      setFormData({
        title: editLink.title,
        url: editLink.url,
        description: editLink.description || '',
        category: editLink.category,
        icon_type: editLink.icon_type || 'link',
        live_project_url: editLink.live_project_url || '',
        link_image: editLink.link_image || ''
      });
      setImagePreview(editLink.link_image || '');
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
        category: defaultCategory || 'contact',
        icon_type: 'link',
        live_project_url: '',
        link_image: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [editLink, defaultCategory, isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, link_image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToSupabase = async (): Promise<string | null> => {
    if (!imageFile) return formData.link_image || null;

    try {
      setUploadingImage(true);
      const supabase = createClient();
      
      // Generate unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('link-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('link-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

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
      // Upload image if there's a new file
      let imageUrl = formData.link_image;
      if (imageFile) {
        const uploadedUrl = await uploadImageToSupabase();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      } else if (!imagePreview && editLink?.link_image) {
        // If image was removed (no preview and edit had image), set to empty string
        imageUrl = '';
      }

      let result;
      
      if (editLink) {
        result = await updateLink(userId, editLink.id, {
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          icon_type: formData.icon_type,
          live_project_url: formData.live_project_url.trim() || undefined,
          link_image: imageUrl === '' ? null : (imageUrl || undefined)
        });
      } else {
        result = await createLink(userId, {
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim() || undefined,
          category: formData.category,
          icon_type: formData.icon_type,
          live_project_url: formData.live_project_url.trim() || undefined,
          link_image: imageUrl || undefined
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
      <DialogContent className="glassmorphic max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editLink ? 'Edit Link' : 'Add New Link'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {editLink ? 'Update your link details' : 'Add a new link to your profile'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 overflow-y-auto pr-2">
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

          {/* Image Upload (optional for all categories except contact) */}
          {formData.category !== 'contact' && (
            <div className="space-y-2">
              <Label htmlFor="link_image" className="text-white">
                Link Image (Optional)
              </Label>
              <div className="space-y-3">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={imagePreview}
                      alt="Link preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading || uploadingImage}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                {!imagePreview && (
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      id="link_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={loading || uploadingImage}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading || uploadingImage}
                      className="border-white/20 text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <span className="text-xs text-gray-400">
                      Max 5MB • JPG, PNG, GIF
                    </span>
                  </div>
                )}
              </div>
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
              disabled={loading || uploadingImage}
              className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
            >
              {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : editLink ? 'Update Link' : 'Add Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
