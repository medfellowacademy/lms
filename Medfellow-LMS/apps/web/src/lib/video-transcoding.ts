// Video transcoding utilities using FFmpeg or cloud services

export interface TranscodingOptions {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: 'mp4' | 'webm' | 'hls';
  resolution?: '360p' | '480p' | '720p' | '1080p' | '4k';
  generateThumbnails?: boolean;
  thumbnailCount?: number;
}

export interface TranscodingProgress {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep?: string;
  outputUrl?: string;
  thumbnails?: string[];
  duration?: number;
}

// Quality presets
export const QUALITY_PRESETS: Record<TranscodingOptions['quality'], {
  videoBitrate: string;
  audioBitrate: string;
  resolution: string;
}> = {
  low: {
    videoBitrate: '500k',
    audioBitrate: '96k',
    resolution: '640x360',
  },
  medium: {
    videoBitrate: '1000k',
    audioBitrate: '128k',
    resolution: '1280x720',
  },
  high: {
    videoBitrate: '2500k',
    audioBitrate: '192k',
    resolution: '1920x1080',
  },
  ultra: {
    videoBitrate: '5000k',
    audioBitrate: '256k',
    resolution: '3840x2160',
  },
};

// Start transcoding job
export async function startTranscoding(
  videoUrl: string,
  options: TranscodingOptions
): Promise<{ jobId: string }> {
  try {
    const response = await fetch('/api/video/transcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoUrl,
        options,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start transcoding');
    }

    const data = await response.json();
    return { jobId: data.jobId };
  } catch (error) {
    console.error('Transcoding error:', error);
    throw error;
  }
}

// Check transcoding progress
export async function getTranscodingProgress(
  jobId: string
): Promise<TranscodingProgress> {
  try {
    const response = await fetch(`/api/video/transcode/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get transcoding status');
    }

    const data = await response.json();
    return data.progress;
  } catch (error) {
    console.error('Get progress error:', error);
    throw error;
  }
}

// Poll for transcoding completion
export async function waitForTranscoding(
  jobId: string,
  onProgress?: (progress: TranscodingProgress) => void
): Promise<TranscodingProgress> {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const progress = await getTranscodingProgress(jobId);
        
        if (onProgress) {
          onProgress(progress);
        }

        if (progress.status === 'completed') {
          clearInterval(pollInterval);
          resolve(progress);
        } else if (progress.status === 'failed') {
          clearInterval(pollInterval);
          reject(new Error('Transcoding failed'));
        }
      } catch (error) {
        clearInterval(pollInterval);
        reject(error);
      }
    }, 2000); // Poll every 2 seconds
  });
}

// Generate adaptive bitrate streaming (HLS)
export async function generateHLS(videoUrl: string): Promise<{
  masterPlaylistUrl: string;
  variants: Array<{ resolution: string; url: string }>;
}> {
  try {
    const response = await fetch('/api/video/hls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate HLS');
    }

    return await response.json();
  } catch (error) {
    console.error('HLS generation error:', error);
    throw error;
  }
}

// Extract metadata from video
export async function extractVideoMetadata(videoUrl: string): Promise<{
  duration: number;
  width: number;
  height: number;
  codec: string;
  bitrate: number;
  fps: number;
  size: number;
}> {
  try {
    const response = await fetch('/api/video/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract metadata');
    }

    return await response.json();
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw error;
  }
}

// Generate video thumbnails
export async function generateThumbnails(
  videoUrl: string,
  count: number = 10
): Promise<string[]> {
  try {
    const response = await fetch('/api/video/thumbnails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, count }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate thumbnails');
    }

    const data = await response.json();
    return data.thumbnails;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw error;
  }
}

// Client-side video compression (for smaller files)
export async function compressVideo(
  file: File,
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<Blob> {
  // This would use browser APIs or WebAssembly FFmpeg
  // For now, return original file
  console.warn('Client-side compression not implemented, using cloud transcoding');
  return file;
}

// Estimate transcoding time
export function estimateTranscodingTime(
  fileSizeInMB: number,
  quality: TranscodingOptions['quality']
): number {
  // Rough estimates in seconds
  const baseTime = fileSizeInMB * 2; // 2 seconds per MB base
  const qualityMultiplier = {
    low: 0.5,
    medium: 1,
    high: 1.5,
    ultra: 2,
  }[quality];

  return Math.ceil(baseTime * qualityMultiplier);
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Check if video needs transcoding
export function needsTranscoding(
  metadata: { codec?: string; bitrate?: number; width?: number }
): boolean {
  // Check if video is in optimal format
  const optimalCodecs = ['h264', 'vp9', 'av1'];
  const maxBitrate = 5000000; // 5 Mbps
  const maxWidth = 1920;

  if (metadata.codec && !optimalCodecs.includes(metadata.codec.toLowerCase())) {
    return true;
  }

  if (metadata.bitrate && metadata.bitrate > maxBitrate) {
    return true;
  }

  if (metadata.width && metadata.width > maxWidth) {
    return true;
  }

  return false;
}

