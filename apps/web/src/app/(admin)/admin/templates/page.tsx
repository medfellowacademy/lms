'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  TrendingUp,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Heart,
  Activity,
  Brain,
  Target,
} from 'lucide-react';
import {
  getAllTemplates,
  getPopularTemplates,
  getTemplatesByCategory,
  searchTemplates,
  type CourseTemplate,
} from '@/lib/course-templates';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Cardiology: Heart,
  Imaging: Activity,
  Electrophysiology: Zap,
  'Heart Failure': Heart,
  General: BookOpen,
};

const difficultyColors: Record<string, string> = {
  BEGINNER: 'text-green-600 bg-green-100',
  INTERMEDIATE: 'text-yellow-600 bg-yellow-100',
  ADVANCED: 'text-orange-600 bg-orange-100',
  EXPERT: 'text-red-600 bg-red-100',
};

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CourseTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Get templates
  const allTemplates = getAllTemplates();
  const popularTemplates = getPopularTemplates();

  // Filter templates
  const filteredTemplates = searchQuery
    ? searchTemplates(searchQuery)
    : selectedCategory === 'all'
    ? allTemplates
    : getTemplatesByCategory(selectedCategory);

  const categories = ['all', ...new Set(allTemplates.map((t) => t.category))];

  const handleUseTemplate = async (template: CourseTemplate) => {
    try {
      const response = await fetch('/api/admin/courses/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          title: template.name,
          instructorId: 'admin-001', // Get from session
        }),
      });

      if (!response.ok) throw new Error('Failed to create course');

      const data = await response.json();
      router.push(`/admin/courses/${data.data.id}`);
    } catch (error) {
      console.error('Error creating course from template:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-500" />
          Course Templates
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Start with pre-built templates to create courses faster
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'all' ? 'All Templates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Templates */}
      {!searchQuery && selectedCategory === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Popular Templates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTemplates.slice(0, 3).map((template) => {
              const CategoryIcon = categoryIcons[template.category] || BookOpen;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <CategoryIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                      <TrendingUp className="w-3 h-3 text-orange-600" />
                      <span className="text-xs font-medium text-orange-600">
                        {template.usageCount} uses
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(template.estimatedDuration)}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Templates Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchQuery ? 'Search Results' : 'All Templates'} ({filteredTemplates.length})
          </h2>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => {
              const CategoryIcon = categoryIcons[template.category] || BookOpen;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center relative">
                    <CategoryIcon className="w-12 h-12 text-white/80" />
                    {template.isPopular && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="text-xs font-medium text-white">Popular</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {template.modules.length} modules
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(template.estimatedDuration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                        {template.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {template.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowPreview(true);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                      >
                        Use Template
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[selectedTemplate.difficulty]}`}>
                      {selectedTemplate.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTemplate.modules.length} modules •{' '}
                      {selectedTemplate.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons •{' '}
                      {formatDuration(selectedTemplate.estimatedDuration)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Structure</h3>
              <div className="space-y-4">
                {selectedTemplate.modules.map((module, mIndex) => (
                  <div key={mIndex} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {mIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2 ml-11">
                      {module.lessons.map((lesson, lIndex) => (
                        <div
                          key={lIndex}
                          className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                          <span className="flex-1 text-gray-700">{lesson.title}</span>
                          <span className="text-xs text-gray-500">{lesson.duration} min</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {lesson.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Use This Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

