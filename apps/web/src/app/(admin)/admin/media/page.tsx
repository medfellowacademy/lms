'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  X,
  Play,
  Loader2,
  FolderOpen,
  HardDrive,
  Eye,
  Link as LinkIcon,
} from 'lucide-react';
import {
  uploadVideo,
  uploadImage,
  uploadDocument,
  deleteFile,
  STORAGE_BUCKETS,
  createVideoThumbnail,
  getVideoDuration,
  type UploadResult,
} from '@/lib/storage/client';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  type: 'video' | 'image' | 'document';
  size: number;
  duration?: number;
  thumbnail?: string;
  uploadedAt: Date;
}

const tabs = [
  { id: 'all', label: 'All Files', icon: FolderOpen },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'image', label: 'Images', icon: ImageIcon },
  { id: 'document', label: 'Documents', icon: FileText },
];

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Media files will be loaded from the database/storage
  const [files, setFiles] = useState<MediaFile[]>([]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    await uploadFiles(Array.from(selectedFiles));
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: MediaFile[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const progress = Math.round(((i + 1) / filesToUpload.length) * 100);
        setUploadProgress(progress);

        let result: UploadResult;
        let thumbnail: string | undefined;
        let duration: number | undefined;

        if (file.type.startsWith('video/')) {
          // Get video duration and create thumbnail
          try {
            duration = await getVideoDuration(file);
            const thumbnailBlob = await createVideoThumbnail(file);
            // Would upload thumbnail here in production
          } catch (e) {
            console.error('Error processing video:', e);
          }
          result = await uploadVideo(file);
        } else if (file.type.startsWith('image/')) {
          result = await uploadImage(file);
        } else {
          result = await uploadDocument(file);
        }

        const mediaFile: MediaFile = {
          id: Date.now().toString() + i,
          name: result.name,
          url: result.url,
          path: result.path,
          type: file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : 'document',
          size: result.size,
          duration,
          thumbnail,
          uploadedAt: new Date(),
        };

        uploadedFiles.push(mediaFile);
      }

      setFiles((prev) => [...uploadedFiles, ...prev]);
      showNotification('success', `Successfully uploaded ${uploadedFiles.length} file(s)`);
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('error', error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles);
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

  const handleDelete = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    try {
      const bucket = file.type === 'video' ? STORAGE_BUCKETS.VIDEOS : 
                     file.type === 'image' ? STORAGE_BUCKETS.IMAGES : 
                     STORAGE_BUCKETS.DOCUMENTS;
      
      await deleteFile(bucket, file.path);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
      showNotification('success', 'File deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete file');
    }
  };

  const handleBulkDelete = async () => {
    for (const fileId of selectedFiles) {
      await handleDelete(fileId);
    }
    setSelectedFiles([]);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification('success', 'URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredFiles = files.filter((file) => {
    const matchesTab = activeTab === 'all' || file.type === activeTab;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalStorage = files.reduce((sum, f) => sum + f.size, 0);
  const videoCount = files.filter((f) => f.type === 'video').length;
  const imageCount = files.filter((f) => f.type === 'image').length;
  const docCount = files.filter((f) => f.type === 'document').length;

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500">Manage all your videos, images, and documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Files
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Storage</div>
              <div className="text-xl font-bold text-gray-900">{formatFileSize(totalStorage)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Videos</div>
              <div className="text-xl font-bold text-gray-900">{videoCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Images</div>
              <div className="text-xl font-bold text-gray-900">{imageCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Documents</div>
              <div className="text-xl font-bold text-gray-900">{docCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-gray-700">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:underline"
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports: MP4, WebM, JPG, PNG, GIF, PDF, DOC, PPT (Max 500MB for videos)
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedFiles.length})
            </button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-white rounded-xl border-2 overflow-hidden group cursor-pointer transition-all ${
                selectedFiles.includes(file.id) ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setPreviewFile(file);
                setShowPreview(true);
              }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                {file.type === 'video' && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    {file.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                        {formatDuration(file.duration)}
                      </div>
                    )}
                  </>
                )}
                {file.type === 'image' && (
                  <ImageIcon className="absolute inset-0 m-auto w-12 h-12 text-gray-300" />
                )}
                {file.type === 'document' && (
                  <FileText className="absolute inset-0 m-auto w-12 h-12 text-gray-300" />
                )}

                {/* Selection checkbox */}
                <div
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFiles((prev) =>
                      prev.includes(file.id)
                        ? prev.filter((id) => id !== file.id)
                        : [...prev, file.id]
                    );
                  }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedFiles.includes(file.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedFiles.includes(file.id) && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(file.url);
                    }}
                    className="p-1.5 bg-white rounded shadow hover:bg-gray-50"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="p-1.5 bg-white rounded shadow hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === filteredFiles.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(filteredFiles.map((f) => f.id));
                      } else {
                        setSelectedFiles([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th className="w-20 p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles((prev) => [...prev, file.id]);
                        } else {
                          setSelectedFiles((prev) => prev.filter((id) => id !== file.id));
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        {file.type === 'video' && <Video className="w-5 h-5 text-purple-600" />}
                        {file.type === 'image' && <ImageIcon className="w-5 h-5 text-green-600" />}
                        {file.type === 'document' && <FileText className="w-5 h-5 text-orange-600" />}
                      </div>
                      <span className="font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      file.type === 'video' ? 'bg-purple-100 text-purple-700' :
                      file.type === 'image' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {file.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                  <td className="p-4 text-sm text-gray-600">{file.uploadedAt.toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPreviewFile(file);
                          setShowPreview(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => copyUrl(file.url)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <LinkIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{previewFile.name}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {previewFile.type === 'video' && (
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={previewFile.url}
                  />
                )}
                {previewFile.type === 'image' && (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="w-full rounded-lg"
                  />
                )}
                {previewFile.type === 'document' && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Document preview not available</p>
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </a>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Size:</span> {formatFileSize(previewFile.size)}
                    {previewFile.duration && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Duration:</span> {formatDuration(previewFile.duration)}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyUrl(previewFile.url)}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </button>
                    <a
                      href={previewFile.url}
                      download
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

