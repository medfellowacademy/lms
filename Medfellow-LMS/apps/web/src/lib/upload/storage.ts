import { createClient } from '@/lib/supabase/client';

// File upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxVideoSize: 500 * 1024 * 1024, // 500MB for videos
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  buckets: {
    avatars: 'avatars',
    courses: 'courses',
    videos: 'videos',
    thumbnails: 'thumbnails',
    documents: 'documents',
    certificates: 'certificates',
  },
};

// Upload result type
export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  size?: number;
  type?: string;
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Upload a file to Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;
    const path = folder ? `${folder}/${filename}` : filename;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const url = getPublicUrl(bucket, data.path);

    return {
      success: true,
      url,
      path: data.path,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}

// Delete a file from Supabase Storage
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return !error;
  } catch {
    return false;
  }
}

// Upload image with validation
export async function uploadImage(
  file: File,
  bucket: string = UPLOAD_CONFIG.buckets.thumbnails,
  folder?: string
): Promise<UploadResult> {
  // Validate file type
  if (!UPLOAD_CONFIG.allowedImageTypes.includes(file.type)) {
    return { 
      success: false, 
      error: 'Invalid image type. Allowed: JPG, PNG, GIF, WebP' 
    };
  }

  // Validate file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return { 
      success: false, 
      error: `File too large. Maximum size: ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB` 
    };
  }

  return uploadFile(file, bucket, folder);
}

// Upload video with validation
export async function uploadVideo(
  file: File,
  folder?: string
): Promise<UploadResult> {
  // Validate file type
  if (!UPLOAD_CONFIG.allowedVideoTypes.includes(file.type)) {
    return { 
      success: false, 
      error: 'Invalid video type. Allowed: MP4, WebM, MOV' 
    };
  }

  // Validate file size
  if (file.size > UPLOAD_CONFIG.maxVideoSize) {
    return { 
      success: false, 
      error: `Video too large. Maximum size: ${UPLOAD_CONFIG.maxVideoSize / 1024 / 1024}MB` 
    };
  }

  return uploadFile(file, UPLOAD_CONFIG.buckets.videos, folder);
}

// Upload document with validation
export async function uploadDocument(
  file: File,
  folder?: string
): Promise<UploadResult> {
  // Validate file type
  if (!UPLOAD_CONFIG.allowedDocTypes.includes(file.type)) {
    return { 
      success: false, 
      error: 'Invalid document type. Allowed: PDF, DOC, DOCX' 
    };
  }

  // Validate file size
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return { 
      success: false, 
      error: `File too large. Maximum size: ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB` 
    };
  }

  return uploadFile(file, UPLOAD_CONFIG.buckets.documents, folder);
}

// Create storage buckets (run once during setup)
export async function createStorageBuckets() {
  const supabase = createClient();
  
  const buckets = Object.values(UPLOAD_CONFIG.buckets);
  
  for (const bucket of buckets) {
    const { error } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: UPLOAD_CONFIG.maxVideoSize,
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error(`Failed to create bucket ${bucket}:`, error);
    }
  }
}

// List files in a bucket/folder
export async function listFiles(bucket: string, folder?: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder || '', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('List files error:', error);
    return [];
  }

  return data.map(file => ({
    name: file.name,
    size: file.metadata?.size,
    type: file.metadata?.mimetype,
    createdAt: file.created_at,
    url: getPublicUrl(bucket, folder ? `${folder}/${file.name}` : file.name),
  }));
}

