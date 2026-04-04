'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  DollarSign,
  Star,
  Video,
  FileText,
  X,
  Upload,
  Save,
  AlertTriangle,
  Loader2,
  Download,
  FileUp,
} from 'lucide-react';
import { useAdminCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/lib/api';

type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'PENDING_REVIEW' | 'ARCHIVED';

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  PUBLISHED: { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  DRAFT: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock },
  PENDING_REVIEW: { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Eye },
  ARCHIVED: { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: XCircle },
};

const levelColors: Record<string, string> = {
  BEGINNER: 'text-green-600',
  INTERMEDIATE: 'text-yellow-600',
  ADVANCED: 'text-red-600',
  EXPERT: 'text-purple-600',
};

const categories = ['Cardiology', 'Imaging', 'Electrophysiology', 'Heart Failure', 'Structural Heart'];
const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  price: number;
  duration: number;
  xpReward: number;
}

const defaultFormData: CourseFormData = {
  title: '',
  description: '',
  shortDescription: '',
  category: 'Cardiology',
  difficulty: 'BEGINNER',
  price: 999,
  duration: 600,
  xpReward: 100,
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Import/Export states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);

  // API hooks
  const { data: coursesData, isLoading, refetch } = useAdminCourses({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  });

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const courses = coursesData?.data?.courses || [];
  const totalRevenue = courses.reduce((sum: number, c: any) => sum + (c.stats?.revenue || 0), 0);
  const totalEnrollments = courses.reduce((sum: number, c: any) => sum + (c.stats?.enrollments || 0), 0);
  const avgRating = courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).length > 0
    ? courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).reduce((sum: number, c: any) => sum + parseFloat(c.stats?.avgRating), 0) / 
      courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).length
    : 0;

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle create course
  const handleCreateCourse = async () => {
    if (!formData.title.trim()) {
      showNotification('error', 'Course title is required');
      return;
    }

    if (!formData.description.trim()) {
      showNotification('error', 'Course description is required');
      return;
    }

    try {
      await createCourseMutation.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData(defaultFormData);
      showNotification('success', 'Course created successfully!');
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to create course');
    }
  };

  // Handle edit course
  const handleEditCourse = async () => {
    if (!selectedCourse || !formData.title.trim()) {
      showNotification('error', 'Course title is required');
      return;
    }

    try {
      await updateCourseMutation.mutateAsync({
        id: selectedCourse.id,
        data: formData,
      });
      setShowEditModal(false);
      setSelectedCourse(null);
      setFormData(defaultFormData);
      showNotification('success', 'Course updated successfully!');
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update course');
    }
  };

  // Handle delete course
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await deleteCourseMutation.mutateAsync(selectedCourse.id);
      setShowDeleteModal(false);
      setSelectedCourse(null);
      showNotification('success', 'Course deleted successfully!');
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete course');
    }
  };

  // Handle status change
  const handleStatusChange = async (courseId: string, newStatus: CourseStatus) => {
    try {
      await updateCourseMutation.mutateAsync({
        id: courseId,
        data: { status: newStatus },
      });
      showNotification('success', `Course status changed to ${newStatus}`);
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update status');
    }
  };

  // Open edit modal with course data
  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      category: course.category,
      difficulty: course.difficulty,
      price: course.price,
      duration: course.duration,
      xpReward: course.xpReward,
    });
    setShowEditModal(true);
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedForExport.length > 0) {
        params.append('ids', selectedForExport.join(','));
      } else {
        params.append('all', 'true');
      }

      const response = await fetch(`/api/admin/courses/export?${params.toString()}`);
      
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medfellow-courses-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showNotification('success', `Exported ${selectedForExport.length || courses.length} course(s)`);
      setSelectedForExport([]);
    } catch (error) {
      showNotification('error', 'Failed to export courses');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);

      if (!data.courses || !Array.isArray(data.courses)) {
        throw new Error('Invalid file format');
      }

      const response = await fetch('/api/admin/courses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses: data.courses }),
      });

      if (!response.ok) throw new Error('Import failed');

      const result = await response.json();
      
      showNotification('success', `Imported ${result.data.imported} course(s). Failed: ${result.data.failed}`);
      setShowImportModal(false);
      setImportFile(null);
      refetch();
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

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
              notification.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <BookOpen className="w-7 h-7 text-orange-500" />
            Course Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage courses, modules, and content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={() => handleExport()}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-orange-500' },
          { label: 'Published', value: courses.filter((c: any) => c.status === 'PUBLISHED').length.toString(), icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Total Enrollments', value: totalEnrollments.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: 'Total Revenue', value: `$${(totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
          { label: 'Avg. Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_REVIEW">Under Review</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Courses Table */}
      {!isLoading && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollments</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course: any) => {
                  const StatusIcon = statusConfig[course.status]?.icon || Clock;
                  const statusStyle = statusConfig[course.status];
                  return (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{course.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span className={levelColors[course.difficulty] || 'text-gray-600'}>{course.difficulty}</span>
                              <span>•</span>
                              <span>{course.category}</span>
                              <span>•</span>
                              <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={course.status}
                          onChange={(e) => handleStatusChange(course.id, e.target.value as CourseStatus)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusStyle?.bgColor || 'bg-gray-100'} ${statusStyle?.color || 'text-gray-600'}`}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PENDING_REVIEW">Review</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {course.stats?.modules || 0} modules
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {course.stats?.lessons || 0} lessons
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-800">{(course.stats?.enrollments || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{(course.stats?.completions || 0).toLocaleString()} completed</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-green-600">${(course.stats?.revenue || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">${course.price} per user</div>
                      </td>
                      <td className="px-4 py-4">
                        {parseFloat(course.stats?.avgRating) > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium text-gray-800">{course.stats?.avgRating}</span>
                            <span className="text-xs text-gray-500">({course.stats?.reviewCount || 0})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No ratings</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowViewModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" 
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button 
                            onClick={() => openEditModal(course)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" 
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No courses found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors"
              >
                Create your first course
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Create New Course</h2>
                  <p className="text-sm text-gray-500">Fill in the details to create a new course</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload course thumbnail</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Advanced Cardiac Imaging"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Detailed description of the course..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 100 }))}
                    min="0"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={createCourseMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {createCourseMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Course Modal */}
      <AnimatePresence>
        {showEditModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Edit Course</h2>
                  <p className="text-sm text-gray-500">Update course details</p>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCourse}
                  disabled={updateCourseMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {updateCourseMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Delete Course</h2>
                <p className="text-gray-500 text-center mb-6">
                  Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    disabled={deleteCourseMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deleteCourseMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Course Modal */}
      <AnimatePresence>
        {showViewModal && selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-500">{selectedCourse.category} • {selectedCourse.difficulty}</p>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <Users className="w-5 h-5 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{(selectedCourse.stats?.enrollments || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Enrollments</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{(selectedCourse.stats?.completions || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Completions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <DollarSign className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">${(selectedCourse.stats?.revenue || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <Star className="w-5 h-5 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{selectedCourse.stats?.avgRating || '-'}</div>
                    <div className="text-xs text-gray-500">Rating ({selectedCourse.stats?.reviewCount || 0} reviews)</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedCourse.description || 'No description'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Course Content</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {selectedCourse.stats?.modules || 0} Modules
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-gray-400" />
                        {selectedCourse.stats?.lessons || 0} Lessons
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Duration: {Math.floor(selectedCourse.duration / 60)}h {selectedCourse.duration % 60}m</div>
                      <div>Price: ${selectedCourse.price}</div>
                      <div>XP Reward: {selectedCourse.xpReward}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedCourse);
                  }}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !isImporting && setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Import Courses</h2>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isImporting}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a JSON file containing course data
                </p>
              </div>

              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    {importFile ? importFile.name : 'Choose a JSON file or drag it here'}
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="import-file"
                    disabled={isImporting}
                  />
                  <label
                    htmlFor="import-file"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Select File
                  </label>
                </div>

                {importFile && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Ready to import: <span className="font-medium">{importFile.name}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  disabled={isImporting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
