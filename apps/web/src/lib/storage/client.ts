import { createClient } from '@/lib/supabase/client';

// Storage buckets
export const STORAGE_BUCKETS = {
  VIDEOS: 'videos',
  IMAGES: 'images',
  DOCUMENTS: 'documents',
  THUMBNAILS: 'thumbnails',
  AVATARS: 'avatars',
  CERTIFICATES: 'certificates',
} as const;

// Allowed file types
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  VIDEO: 500 * 1024 * 1024, // 500MB
  IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 50 * 1024 * 1024, // 50MB
  AVATAR: 5 * 1024 * 1024, // 5MB
};

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
  name: string;
}

// Generate unique file path
function generateFilePath(bucket: string, fileName: string, userId?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  
  if (userId) {
    return `${userId}/${timestamp}-${randomString}-${sanitizedName}`;
  }
  return `${timestamp}-${randomString}-${sanitizedName}`;
}

// Validate file before upload
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  options?: {
    userId?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  const supabase = createClient();
  
  const filePath = generateFilePath(bucket, file.name, options?.userId);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
    size: file.size,
    type: file.type,
    name: file.name,
  };
}

// Upload video with validation
export async function uploadVideo(
  file: File,
  options?: {
    userId?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  const validation = validateFile(file, ALLOWED_VIDEO_TYPES, MAX_FILE_SIZES.VIDEO);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return uploadFile(file, STORAGE_BUCKETS.VIDEOS, options);
}

// Upload image with validation
export async function uploadImage(
  file: File,
  options?: {
    userId?: string;
    bucket?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  const validation = validateFile(file, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES.IMAGE);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return uploadFile(file, options?.bucket || STORAGE_BUCKETS.IMAGES, options);
}

// Upload document with validation
export async function uploadDocument(
  file: File,
  options?: {
    userId?: string;
    onProgress?: (progress: UploadProgress) => void;
  }
): Promise<UploadResult> {
  const validation = validateFile(file, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZES.DOCUMENT);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return uploadFile(file, STORAGE_BUCKETS.DOCUMENTS, options);
}

// Upload avatar with validation
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  const validation = validateFile(file, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZES.AVATAR);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return uploadFile(file, STORAGE_BUCKETS.AVATARS, { userId });
}

// Delete file from storage
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

// List files in a bucket/folder
export async function listFiles(
  bucket: string,
  folder?: string
): Promise<{ name: string; id: string; created_at: string; metadata: Record<string, unknown> }[]> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || '', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data || [];
}

// Get signed URL for private files
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Signed URL failed: ${error.message}`);
  }

  return data.signedUrl;
}

// Create thumbnail from video (client-side)
export async function createVideoThumbnail(videoFile: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadeddata = () => {
      video.currentTime = 1; // Seek to 1 second
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create thumbnail'));
        }
        URL.revokeObjectURL(video.src);
      }, 'image/jpeg', 0.8);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(videoFile);
  });
}

// Get video duration
export async function getVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      resolve(Math.round(video.duration));
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(videoFile);
  });
}

