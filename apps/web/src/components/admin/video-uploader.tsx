'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Video,
  X,
  Play,
  Pause,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import {
  uploadVideo,
  uploadImage,
  createVideoThumbnail,
  getVideoDuration,
  deleteFile,
  STORAGE_BUCKETS,
} from '@/lib/storage/client';

interface VideoUploaderProps {
  value?: string;
  onChange: (url: string, metadata?: { duration?: number; thumbnail?: string }) => void;
  onDelete?: () => void;
  showUrlInput?: boolean;
  placeholder?: string;
}

export function VideoUploader({
  value,
  onChange,
  onDelete,
  showUrlInput = true,
  placeholder = 'Upload a video or paste URL',
}: VideoUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get video duration
      const duration = await getVideoDuration(file);

      // Create and upload thumbnail to Supabase
      let thumbnailUrl: string | undefined;
      try {
        const thumbnailBlob = await createVideoThumbnail(file);
        const thumbnailFile = new File([thumbnailBlob], `thumb-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const thumbResult = await uploadImage(thumbnailFile, { bucket: 'thumbnails' });
        thumbnailUrl = thumbResult.url;
      } catch (e) {
        console.warn('Could not create thumbnail:', e);
      }

      // Upload video to Supabase with progress
      const result = await uploadVideo(file, {
        onProgress: (progress) => setUploadProgress(progress.percentage),
      });

      setUploadProgress(100);

      onChange(result.url, { duration, thumbnail: thumbnailUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      setUrlInput('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const handleDelete = async () => {
    if (!value) return;

    try {
      // Try to delete from storage (if it's our URL)
      const url = new URL(value);
      if (url.hostname.includes('supabase')) {
        const path = url.pathname.split('/').slice(-1)[0];
        await deleteFile(STORAGE_BUCKETS.VIDEOS, path);
      }
    } catch (e) {
      // Ignore errors - URL might be external
    }

    onDelete?.();
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-3">
      {/* Current Video Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video group">
          <video
            ref={videoRef}
            src={value}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play/Pause Overlay */}
          <div
            onClick={togglePlayback}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-900" />
              ) : (
                <Play className="w-8 h-8 text-gray-900 ml-1" />
              )}
            </div>
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <>
          {/* Mode Toggle */}
          {showUrlInput && (
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
              <button
                onClick={() => setMode('upload')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  mode === 'upload'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setMode('url')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  mode === 'url'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                URL
              </button>
            </div>
          )}

          {mode === 'upload' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : isUploading
                  ? 'border-blue-300 bg-blue-50/50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin" />
                  <div className="text-sm font-medium text-gray-700">
                    Uploading... {uploadProgress}%
                  </div>
                  <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Video className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? 'Drop video here' : 'Drag and drop a video'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse • MP4, WebM, MOV up to 500MB
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                Add
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Thumbnail uploader component
interface ThumbnailUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onDelete?: () => void;
  aspectRatio?: string;
}

export function ThumbnailUploader({
  value,
  onChange,
  onDelete,
  aspectRatio = '16/9',
}: ThumbnailUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload to storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'thumbnails');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onChange(result.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => !value && fileInputRef.current?.click()}
        className={`relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer group`}
        style={{ aspectRatio }}
      >
        {value ? (
          <>
            <img src={value} alt="Thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-2 bg-white rounded-lg text-sm font-medium"
              >
                Change
              </button>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Upload thumbnail</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = '';
        }}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

