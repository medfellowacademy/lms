'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Video,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Edit,
  Copy,
  Play,
  CheckCircle2,
  X,
  Loader2,
  AlertTriangle,
  Layers,
  Brain,
  Zap,
} from 'lucide-react';

// Types
interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'DOCUMENT' | 'LINK' | 'IMAGE';
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'INTERACTIVE' | 'VR_SIMULATION' | 'CASE_STUDY';
  duration: number;
  videoUrl?: string;
  content?: string;
  order: number;
  xpReward: number;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  isExpanded?: boolean;
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo: string;
  category: string;
  difficulty: string;
  duration: number;
  price: number;
  isFree: boolean;
  status: string;
  xpReward: number;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: Module[];
}

const lessonTypes = [
  { value: 'VIDEO', label: 'Video Lesson', icon: Video, color: 'purple' },
  { value: 'TEXT', label: 'Text/Article', icon: FileText, color: 'blue' },
  { value: 'QUIZ', label: 'Quiz/Assessment', icon: Brain, color: 'green' },
  { value: 'INTERACTIVE', label: 'Interactive', icon: Zap, color: 'yellow' },
  { value: 'VR_SIMULATION', label: 'VR Simulation', icon: Play, color: 'red' },
  { value: 'CASE_STUDY', label: 'Case Study', icon: BookOpen, color: 'orange' },
];

const categories = ['Cardiology', 'Imaging', 'Electrophysiology', 'Heart Failure', 'Structural Heart'];
const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const isNew = courseId === 'new';

  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Module/Lesson management
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Form states
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [newLessonData, setNewLessonData] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    type: 'VIDEO',
    duration: 10,
    xpReward: 10,
    videoUrl: '',
    content: '',
    resources: [],
  });

  // Course data
  const [course, setCourse] = useState<CourseData>({
    id: isNew ? '' : courseId,
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    thumbnail: '',
    previewVideo: '',
    category: 'Cardiology',
    difficulty: 'BEGINNER',
    duration: 0,
    price: 0,
    isFree: true,
    status: 'DRAFT',
    xpReward: 100,
    prerequisites: [],
    learningOutcomes: [],
    modules: [],
  });

  // Load course data
  useEffect(() => {
    if (!isNew) {
      // Fetch course data
      fetchCourseData();
    }
  }, [courseId, isNew]);

  const fetchCourseData = async () => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Calculate total duration
  const calculateTotalDuration = () => {
    return course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.duration, 0);
    }, 0);
  };

  // Add module
  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;

    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: newModuleTitle,
      description: newModuleDescription,
      order: course.modules.length,
      lessons: [],
      isExpanded: true,
    };

    setCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));

    setNewModuleTitle('');
    setNewModuleDescription('');
    setShowAddModuleModal(false);
    setHasChanges(true);
  };

  // Delete module
  const handleDeleteModule = (moduleId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }));
    setHasChanges(true);
  };

  // Toggle module expand
  const toggleModule = (moduleId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      ),
    }));
  };

  // Add lesson
  const handleAddLesson = () => {
    if (!selectedModuleId || !newLessonData.title?.trim()) return;

    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: newLessonData.title || '',
      description: newLessonData.description || '',
      type: (newLessonData.type as Lesson['type']) || 'VIDEO',
      duration: newLessonData.duration || 10,
      xpReward: newLessonData.xpReward || 10,
      videoUrl: newLessonData.videoUrl,
      content: newLessonData.content,
      order: course.modules.find((m) => m.id === selectedModuleId)?.lessons.length || 0,
      resources: [],
    };

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === selectedModuleId
          ? { ...m, lessons: [...m.lessons, lesson] }
          : m
      ),
    }));

    setNewLessonData({
      title: '',
      description: '',
      type: 'VIDEO',
      duration: 10,
      xpReward: 10,
      videoUrl: '',
      content: '',
      resources: [],
    });
    setShowAddLessonModal(false);
    setSelectedModuleId(null);
    setHasChanges(true);
  };

  // Update lesson
  const handleUpdateLesson = () => {
    if (!selectedLesson || !selectedModuleId) return;

    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === selectedModuleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === selectedLesson.id ? { ...l, ...newLessonData } : l
              ),
            }
          : m
      ),
    }));

    setShowEditLessonModal(false);
    setSelectedLesson(null);
    setSelectedModuleId(null);
    setHasChanges(true);
  };

  // Delete lesson
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      ),
    }));
    setHasChanges(true);
  };

  // Save course
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = isNew ? '/api/admin/courses' : `/api/admin/courses/${courseId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          duration: calculateTotalDuration(),
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();
      
      if (isNew && data.data?.id) {
        router.push(`/admin/courses/${data.data.id}`);
      }

      showNotification('success', 'Course saved successfully!');
      setHasChanges(false);
    } catch (error) {
      showNotification('error', 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder modules
  const handleReorderModules = (newOrder: Module[]) => {
    setCourse((prev) => ({
      ...prev,
      modules: newOrder.map((m, i) => ({ ...m, order: i })),
    }));
    setHasChanges(true);
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/courses')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => {
                    setCourse((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    }));
                    setHasChanges(true);
                  }}
                  placeholder="Course Title"
                  className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                />
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    course.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {course.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.modules.length} modules • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons • {formatDuration(calculateTotalDuration())}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Unsaved changes
                </span>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => window.open(`/courses/${course.slug}`, '_blank')}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { id: 'content', label: 'Content', icon: Layers },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Modules & Lessons */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                <button
                  onClick={() => setShowAddModuleModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Module
                </button>
              </div>

              {course.modules.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first module</p>
                  <button
                    onClick={() => setShowAddModuleModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Module
                  </button>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={course.modules}
                  onReorder={handleReorderModules}
                  className="space-y-4"
                >
                  {course.modules.map((module, moduleIndex) => (
                    <Reorder.Item
                      key={module.id}
                      value={module}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      {/* Module Header */}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {module.isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            Module {moduleIndex + 1}: {module.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {module.lessons.length} lessons • {formatDuration(module.lessons.reduce((sum, l) => sum + l.duration, 0))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedModuleId(module.id);
                            setShowAddLessonModal(true);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg text-blue-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Lessons */}
                      <AnimatePresence>
                        {module.isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {module.lessons.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">
                                <p>No lessons in this module yet</p>
                                <button
                                  onClick={() => {
                                    setSelectedModuleId(module.id);
                                    setShowAddLessonModal(true);
                                  }}
                                  className="mt-2 text-blue-600 hover:underline"
                                >
                                  Add first lesson
                                </button>
                              </div>
                            ) : (
                              <div className="divide-y divide-gray-100">
                                {module.lessons.map((lesson, lessonIndex) => {
                                  const lessonType = lessonTypes.find((t) => t.value === lesson.type);
                                  return (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-3 p-4 hover:bg-gray-50"
                                    >
                                      <GripVertical className="w-4 h-4 text-gray-300" />
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${lessonType?.color || 'gray'}-100`}>
                                        {lessonType && <lessonType.icon className={`w-4 h-4 text-${lessonType.color}-600`} />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">
                                          {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                          <span>{lessonType?.label}</span>
                                          <span>•</span>
                                          <span>{lesson.duration} min</span>
                                          <span>•</span>
                                          <span>{lesson.xpReward} XP</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setSelectedLesson(lesson);
                                            setSelectedModuleId(module.id);
                                            setNewLessonData(lesson);
                                            setShowEditLessonModal(true);
                                          }}
                                          className="p-2 hover:bg-gray-200 rounded-lg"
                                        >
                                          <Edit className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                          className="p-2 hover:bg-red-50 rounded-lg"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Course Thumbnail</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                >
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    // Handle thumbnail upload
                    const file = e.target.files?.[0];
                    if (file) {
                      // Upload and set thumbnail URL
                    }
                  }}
                />
              </div>

              {/* Preview Video */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Preview Video</h3>
                <input
                  type="text"
                  value={course.previewVideo}
                  onChange={(e) => {
                    setCourse((prev) => ({ ...prev, previewVideo: e.target.value }));
                    setHasChanges(true);
                  }}
                  placeholder="Video URL or upload..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Course Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Duration</span>
                    <span className="text-sm font-medium">{formatDuration(calculateTotalDuration())}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Modules</span>
                    <span className="text-sm font-medium">{course.modules.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Lessons</span>
                    <span className="text-sm font-medium">{course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total XP</span>
                    <span className="text-sm font-medium text-purple-600">
                      {course.xpReward + course.modules.reduce((sum, m) => sum + m.lessons.reduce((ls, l) => ls + l.xpReward, 0), 0)} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => {
                      setCourse((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                      }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={course.slug}
                    onChange={(e) => {
                      setCourse((prev) => ({ ...prev, slug: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={course.shortDescription}
                    onChange={(e) => {
                      setCourse((prev) => ({ ...prev, shortDescription: e.target.value }));
                      setHasChanges(true);
                    }}
                    placeholder="Brief description for cards and previews"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => {
                      setCourse((prev) => ({ ...prev, description: e.target.value }));
                      setHasChanges(true);
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={course.category}
                      onChange={(e) => {
                        setCourse((prev) => ({ ...prev, category: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={course.difficulty}
                      onChange={(e) => {
                        setCourse((prev) => ({ ...prev, difficulty: e.target.value }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      {difficulties.map((diff) => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={course.isFree}
                    onChange={(e) => {
                      setCourse((prev) => ({
                        ...prev,
                        isFree: e.target.checked,
                        price: e.target.checked ? 0 : prev.price,
                      }));
                      setHasChanges(true);
                    }}
                    className="rounded"
                  />
                  <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                    This course is free
                  </label>
                </div>
                {!course.isFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={course.price}
                        onChange={(e) => {
                          setCourse((prev) => ({ ...prev, price: Number(e.target.value) }));
                          setHasChanges(true);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gamification */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Gamification</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Completion XP Reward
                </label>
                <input
                  type="number"
                  value={course.xpReward}
                  onChange={(e) => {
                    setCourse((prev) => ({ ...prev, xpReward: Number(e.target.value) }));
                    setHasChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publication Status</h3>
              <select
                value={course.status}
                onChange={(e) => {
                  setCourse((prev) => ({ ...prev, status: e.target.value }));
                  setHasChanges(true);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      <AnimatePresence>
        {showAddModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModuleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Module</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Title
                  </label>
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="e.g., Introduction to PCI"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newModuleDescription}
                    onChange={(e) => setNewModuleDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModule}
                  disabled={!newModuleTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Add Module
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Lesson Modal */}
      <AnimatePresence>
        {(showAddLessonModal || showEditLessonModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddLessonModal(false);
              setShowEditLessonModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {showEditLessonModal ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={newLessonData.title || ''}
                    onChange={(e) => setNewLessonData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Understanding Coronary Anatomy"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {lessonTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNewLessonData((prev) => ({ ...prev, type: type.value as Lesson['type'] }))}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          newLessonData.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <type.icon className={`w-4 h-4 text-${type.color}-600`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newLessonData.description || ''}
                    onChange={(e) => setNewLessonData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                {newLessonData.type === 'VIDEO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLessonData.videoUrl || ''}
                        onChange={(e) => setNewLessonData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                      />
                      <button
                        onClick={() => setShowMediaPicker(true)}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {(newLessonData.type === 'TEXT' || newLessonData.type === 'CASE_STUDY') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={newLessonData.content || ''}
                      onChange={(e) => setNewLessonData((prev) => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      placeholder="Write your lesson content here... (Markdown supported)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newLessonData.duration || 10}
                      onChange={(e) => setNewLessonData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                      min={1}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      value={newLessonData.xpReward || 10}
                      onChange={(e) => setNewLessonData((prev) => ({ ...prev, xpReward: Number(e.target.value) }))}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddLessonModal(false);
                    setShowEditLessonModal(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={showEditLessonModal ? handleUpdateLesson : handleAddLesson}
                  disabled={!newLessonData.title?.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {showEditLessonModal ? 'Update Lesson' : 'Add Lesson'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

