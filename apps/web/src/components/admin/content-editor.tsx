'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Video,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Edit,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { uploadImage } from '@/lib/storage/client';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  onImageUpload?: (url: string) => void;
}

const toolbarGroups = [
  {
    name: 'history',
    buttons: [
      { icon: Undo, command: 'undo', title: 'Undo' },
      { icon: Redo, command: 'redo', title: 'Redo' },
    ],
  },
  {
    name: 'text',
    buttons: [
      { icon: Bold, command: 'bold', title: 'Bold' },
      { icon: Italic, command: 'italic', title: 'Italic' },
      { icon: Underline, command: 'underline', title: 'Underline' },
    ],
  },
  {
    name: 'heading',
    buttons: [
      { icon: Heading1, command: 'formatBlock', value: 'H1', title: 'Heading 1' },
      { icon: Heading2, command: 'formatBlock', value: 'H2', title: 'Heading 2' },
      { icon: Heading3, command: 'formatBlock', value: 'H3', title: 'Heading 3' },
    ],
  },
  {
    name: 'list',
    buttons: [
      { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
      { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    ],
  },
  {
    name: 'align',
    buttons: [
      { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
      { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
      { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    ],
  },
  {
    name: 'insert',
    buttons: [
      { icon: Link, command: 'link', title: 'Insert Link' },
      { icon: Quote, command: 'formatBlock', value: 'BLOCKQUOTE', title: 'Quote' },
      { icon: Code, command: 'formatBlock', value: 'PRE', title: 'Code Block' },
    ],
  },
];

export function ContentEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '300px',
  onImageUpload,
}: ContentEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'html'>('edit');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Update parent state
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleToolbarClick = (command: string, value?: string) => {
    if (command === 'link') {
      setShowLinkModal(true);
      return;
    }

    if (value) {
      execCommand(command, value);
    } else {
      execCommand(command);
    }
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const anchor = linkText 
        ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
        : `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
      execCommand('insertHTML', anchor);
    }
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const imgTag = `<img src="${result.url}" alt="${file.name}" class="max-w-full h-auto rounded-lg my-4" />`;
      execCommand('insertHTML', imgTag);
      onImageUpload?.(result.url);
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={group.name} className="flex items-center">
            {groupIndex > 0 && (
              <div className="w-px h-6 bg-gray-300 mx-1" />
            )}
            {group.buttons.map((button) => (
              <button
                key={button.command + (button.value || '')}
                onClick={() => handleToolbarClick(button.command, button.value)}
                title={button.title}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
              >
                <button.icon className="w-4 h-4 text-gray-700" />
              </button>
            ))}
          </div>
        ))}

        {/* Image upload */}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Insert Image"
          className="p-2 hover:bg-gray-200 rounded transition-colors"
        >
          <Image className={`w-4 h-4 ${isUploading ? 'animate-pulse text-blue-500' : 'text-gray-700'}`} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Mode toggle */}
        <div className="ml-auto flex items-center gap-1 border-l border-gray-300 pl-2">
          <button
            onClick={() => setMode('edit')}
            className={`p-2 rounded transition-colors ${
              mode === 'edit' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`p-2 rounded transition-colors ${
              mode === 'preview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('html')}
            className={`p-2 rounded transition-colors ${
              mode === 'html' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="HTML"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div style={{ minHeight }}>
        {mode === 'edit' && (
          <div
            ref={editorRef}
            contentEditable
            className="p-4 focus:outline-none prose prose-sm max-w-none"
            onInput={handleEditorInput}
            dangerouslySetInnerHTML={{ __html: value || `<p>${placeholder}</p>` }}
            style={{ minHeight }}
          />
        )}

        {mode === 'preview' && (
          <div
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value || `<p class="text-gray-400">${placeholder}</p>` }}
            style={{ minHeight }}
          />
        )}

        {mode === 'html' && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 font-mono text-sm focus:outline-none resize-none"
            style={{ minHeight }}
            placeholder={placeholder}
          />
        )}
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Insert Link</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple markdown editor alternative
export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write in Markdown...',
  minHeight = '300px',
}: ContentEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Simple markdown to HTML converter (for preview)
  const renderMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg" />')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          Markdown supported: **bold**, *italic*, `code`, [link](url), ![image](url)
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('edit')}
            className={`p-2 rounded transition-colors ${
              mode === 'edit' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`p-2 rounded transition-colors ${
              mode === 'preview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div style={{ minHeight }}>
        {mode === 'edit' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 font-mono text-sm focus:outline-none resize-none"
            style={{ minHeight }}
          />
        ) : (
          <div
            className="p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(value) || `<p class="text-gray-400">${placeholder}</p>` 
            }}
            style={{ minHeight }}
          />
        )}
      </div>
    </div>
  );
}

