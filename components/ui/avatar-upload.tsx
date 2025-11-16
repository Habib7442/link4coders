'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-client'
import { useAuthStore } from '@/stores/useAuthStore'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  onAvatarUpdate: (avatarUrl: string | null) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  onAvatarUpdate, 
  className,
  size = 'lg' 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()

  // Create authenticated Supabase client
  const supabase = createClient()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  }

  // Validate image file
  const validateImage = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)'
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size must be less than 5MB'
      }
    }

    return { isValid: true }
  }

  // Resize and crop image to square
  const resizeImage = (file: File, size: number = 200): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Set canvas size to desired dimensions
        canvas.width = size
        canvas.height = size

        // Calculate crop dimensions to maintain aspect ratio
        const minDimension = Math.min(img.width, img.height)
        const cropX = (img.width - minDimension) / 2
        const cropY = (img.height - minDimension) / 2

        // Draw cropped and resized image
        ctx?.drawImage(
          img,
          cropX, cropY, minDimension, minDimension, // Source crop
          0, 0, size, size // Destination
        )

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to process image'))
            }
          },
          'image/jpeg',
          0.9 // Quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Generate preview URL from file
  const generatePreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Clean up preview URL
  const revokePreview = (url: string): void => {
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    
    console.log('Starting file upload...', { fileName: file.name, fileSize: file.size, userId: user?.id });
    
    // Validate image
    const validation = validateImage(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid image file')
      return
    }

    try {
      setIsUploading(true)
      
      // Generate preview
      const preview = generatePreview(file)
      setPreviewUrl(preview)

      // Process image
      console.log('Resizing image...');
      const processedBlob = await resizeImage(file, 200)
      console.log('Image resized successfully');
      
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      // Upload to Supabase Storage
      const fileName = `${user.id}/avatar-${Date.now()}.jpg`
      console.log('Uploading to Supabase...', fileName);
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedBlob, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError
      }
      
      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      console.log('Public URL:', publicUrl);

      // Update user's avatar_url in database
      console.log('Updating user profile...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError
      }
      
      console.log('Profile updated successfully');

      // Clean up old preview
      if (previewUrl) {
        revokePreview(previewUrl)
      }

      onAvatarUpdate(publicUrl)
      setPreviewUrl(null)
      
    } catch (err) {
      console.error('Avatar upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
      
      // Clean up preview on error
      if (previewUrl) {
        revokePreview(previewUrl)
        setPreviewUrl(null)
      }
    } finally {
      setIsUploading(false)
    }
  }, [user?.id, supabase, onAvatarUpdate, previewUrl])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const displayUrl = previewUrl || currentAvatarUrl
  const hasAvatar = Boolean(displayUrl)

  return (
    <div className={cn('relative group', className)}>
      {/* Avatar Display */}
      <div 
        className={cn(
          'relative rounded-full overflow-hidden border-2 border-white/20 bg-gradient-to-br from-blue-500 to-purple-600',
          sizeClasses[size],
          dragActive && 'border-blue-400 scale-105',
          'transition-all duration-200'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {hasAvatar ? (
          <img 
            src={displayUrl} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        )}

        {/* Upload Overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer',
          dragActive && 'opacity-100',
          isUploading && 'opacity-100'
        )}
        onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Upload Instructions */}
      {dragActive && (
        <div className="absolute top-full mt-2 left-0 right-0 text-blue-400 text-sm bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center">
          Drop image here to upload
        </div>
      )}
    </div>
  )
}