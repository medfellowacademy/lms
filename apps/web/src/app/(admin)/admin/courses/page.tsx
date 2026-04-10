'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
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
  ChevronDown,
  ChevronRight,
  GripVertical,
  BookMarked,
  Link as LinkIcon,
} from 'lucide-react';
import { useAdminCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/lib/api';

type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'PENDING_REVIEW' | 'ARCHIVED';
type LessonContentType = 'VIDEO' | 'PPT' | 'EBOOK' | 'TEXT';

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

const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const contentTypeConfig: Record<LessonContentType, { label: string; icon: React.ComponentType<{ className?: string }>; accept: string; color: string }> = {
  VIDEO: { label: 'Video', icon: Video, accept: 'video/*', color: 'text-blue-500 bg-blue-50 border-blue-200' },
  PPT:   { label: 'Presentation', icon: FileText, accept: '.ppt,.pptx,.pdf', color: 'text-orange-500 bg-orange-50 border-orange-200' },
  EBOOK: { label: 'eBook / PDF', icon: BookOpen, accept: '.pdf,.epub', color: 'text-purple-500 bg-purple-50 border-purple-200' },
  TEXT:  { label: 'Text / Notes', icon: FileText, accept: '*', color: 'text-gray-500 bg-gray-50 border-gray-200' },
};

interface LessonForm {
  id: string;
  title: string;
  contentTypes: LessonContentType[];
  videoFile?: File;
  videoUrl?: string;
  pptFile?: File;
  pptUrl?: string;
  ebookFile?: File;
  ebookUrl?: string;
  textContent?: string;
}

interface ModuleForm {
  id: string;
  title: string;
  expanded: boolean;
  lessons: LessonForm[];
}

interface CourseFormData {
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  modules: ModuleForm[];
}

// ---- Fellowship in Emergency Medicine template ----
const FELLOWSHIP_TEMPLATE: ModuleForm[] = [
  {
    id: 'm1', title: 'Introduction and Overview', expanded: false, lessons: [
      { id: 'l1', title: 'Organisation of the Emergency Medicine Department', contentTypes: [] },
      { id: 'l2', title: 'Organisation of Emergency Medical Services', contentTypes: [] },
      { id: 'l3', title: 'Disaster Management', contentTypes: [] },
      { id: 'l4', title: 'Legal Aspects of Emergency Medicine', contentTypes: [] },
    ],
  },
  {
    id: 'm2', title: 'Airway Management', expanded: false, lessons: [
      { id: 'l5', title: 'Introduction', contentTypes: [] },
      { id: 'l6', title: 'Airway Management', contentTypes: [] },
      { id: 'l7', title: 'Assisted Ventilation', contentTypes: [] },
      { id: 'l8', title: 'Pulse Oximetry', contentTypes: [] },
      { id: 'l9', title: 'Ventilator Basics', contentTypes: [] },
      { id: 'l10', title: 'Nastro Gastric Tube', contentTypes: [] },
    ],
  },
  {
    id: 'm3', title: 'Trauma', expanded: false, lessons: [
      { id: 'l11', title: 'Trauma', contentTypes: [] },
      { id: 'l12', title: 'Emergency Department Imaging', contentTypes: [] },
      { id: 'l13', title: 'Neurology in Trauma', contentTypes: [] },
    ],
  },
  {
    id: 'm4', title: 'Orthopedic Emergencies', expanded: false, lessons: [
      { id: 'l14', title: 'Orthopedic Emergencies', contentTypes: [] },
      { id: 'l15', title: 'Types of Orthopaedic Emergencies', contentTypes: [] },
      { id: 'l16', title: 'Basic Management of Orthopaedic Emergencies', contentTypes: [] },
      { id: 'l17', title: 'Fractures', contentTypes: [] },
      { id: 'l18', title: 'Hand and Wrist Injuries', contentTypes: [] },
      { id: 'l19', title: 'Forearm, Elbow, Upper Arm and Shoulder Injuries', contentTypes: [] },
      { id: 'l20', title: 'Pelvis, Hip and Femur Injuries', contentTypes: [] },
      { id: 'l21', title: 'Lower Leg and Ankle Injuries', contentTypes: [] },
      { id: 'l22', title: 'Complications of Orthopaedic Injuries', contentTypes: [] },
    ],
  },
  {
    id: 'm5', title: 'Wounds and Analgesia', expanded: false, lessons: [
      { id: 'l23', title: 'Wound Assessment and Management', contentTypes: [] },
      { id: 'l24', title: 'Local and Regional Anaesthesia', contentTypes: [] },
      { id: 'l25', title: 'Chronic Pain Management', contentTypes: [] },
    ],
  },
  {
    id: 'm6', title: 'Cardiac and Respiratory Emergencies', expanded: false, lessons: [
      { id: 'l26', title: 'Cardiac Emergencies', contentTypes: [] },
      { id: 'l27', title: 'Respiratory Emergencies', contentTypes: [] },
      { id: 'l28', title: 'Cardiogenic Shock', contentTypes: [] },
      { id: 'l29', title: 'Segment Elevation Myocardial Infarction', contentTypes: [] },
      { id: 'l30', title: 'Myocardial Infarction', contentTypes: [] },
      { id: 'l31', title: 'Asthma', contentTypes: [] },
      { id: 'l32', title: 'Deep Vein Thrombosis', contentTypes: [] },
    ],
  },
  {
    id: 'm7', title: 'Endocrine and Neurologic Emergencies', expanded: false, lessons: [
      { id: 'l33', title: 'Endocrine Emergencies', contentTypes: [] },
      { id: 'l34', title: 'Neurology', contentTypes: [] },
      { id: 'l35', title: 'Psychiatric', contentTypes: [] },
      { id: 'l36', title: 'Shock', contentTypes: [] },
    ],
  },
  {
    id: 'm8', title: 'Renal, Gastric, and Hepatic Emergencies', expanded: false, lessons: [
      { id: 'l37', title: 'Renal Emergencies', contentTypes: [] },
      { id: 'l38', title: 'Gastrointestinal and Hepatobiliary Emergencies', contentTypes: [] },
      { id: 'l39', title: 'Liver Cirrhosis', contentTypes: [] },
    ],
  },
  {
    id: 'm9', title: 'Surgical and Transfusion Emergencies', expanded: false, lessons: [
      { id: 'l40', title: 'Surgical Emergencies', contentTypes: [] },
      { id: 'l41', title: 'Urogenital Emergencies', contentTypes: [] },
      { id: 'l42', title: 'Transfusion Emergencies', contentTypes: [] },
      { id: 'l43', title: 'Blood Transfusion', contentTypes: [] },
    ],
  },
  {
    id: 'm10', title: 'Obstetric, Gynecologic, and Pediatric Emergencies', expanded: false, lessons: [
      { id: 'l44', title: 'Obstetric and Gynecologic Emergencies', contentTypes: [] },
      { id: 'l45', title: 'Paediatric Emergencies', contentTypes: [] },
      { id: 'l46', title: 'Female Reproductive Tract', contentTypes: [] },
      { id: 'l47', title: 'Endometriosis', contentTypes: [] },
      { id: 'l48', title: 'IUCD', contentTypes: [] },
      { id: 'l49', title: 'PCOD', contentTypes: [] },
      { id: 'l50', title: 'Preeclampsia', contentTypes: [] },
    ],
  },
  {
    id: 'm11', title: 'Ear and Eye Emergencies', expanded: false, lessons: [
      { id: 'l51', title: 'Otolaryngeal Emergencies', contentTypes: [] },
      { id: 'l52', title: 'Ophthalmic Emergencies', contentTypes: [] },
    ],
  },
  {
    id: 'm12', title: 'Toxicology', expanded: false, lessons: [
      { id: 'l53', title: 'Approach to the Poisoned Patient', contentTypes: [] },
      { id: 'l54', title: 'Antidotes Commonly Used in Overdose', contentTypes: [] },
      { id: 'l55', title: 'Treatment of Hypotension Associated With Drug Poisoning', contentTypes: [] },
      { id: 'l56', title: 'Carbon Monoxide Poisoning', contentTypes: [] },
      { id: 'l57', title: 'Illicit Drugs and Controlled Substances of Abuse', contentTypes: [] },
      { id: 'l58', title: 'Alcohol Withdrawal', contentTypes: [] },
      { id: 'l59', title: 'Digitalis Toxicity', contentTypes: [] },
      { id: 'l60', title: 'Calcium Channel Blocker Toxicity', contentTypes: [] },
      { id: 'l61', title: 'Acetaminophen Hepatotoxicity', contentTypes: [] },
      { id: 'l62', title: 'Salicylate Overdose', contentTypes: [] },
      { id: 'l63', title: 'Tricyclic Antidepressant Overdose', contentTypes: [] },
      { id: 'l64', title: 'Monoamino Oxidase Inhibitor Overdose', contentTypes: [] },
      { id: 'l65', title: 'Arsenic Poisoning', contentTypes: [] },
      { id: 'l66', title: 'Cyanide Poisoning', contentTypes: [] },
      { id: 'l67', title: 'Iron Poisoning', contentTypes: [] },
      { id: 'l68', title: 'Lithium Carbonate Overdose', contentTypes: [] },
      { id: 'l69', title: 'Serum Osmolality', contentTypes: [] },
      { id: 'l70', title: 'Ethanol Poisoning', contentTypes: [] },
      { id: 'l71', title: 'Ethylene Glycol Poisoning', contentTypes: [] },
      { id: 'l72', title: 'Organophosphate and Organocarbomate Poisoning - Management', contentTypes: [] },
    ],
  },
  {
    id: 'm13', title: 'Environmental Emergencies', expanded: false, lessons: [
      { id: 'l73', title: 'Environmental Emergencies', contentTypes: [] },
      { id: 'l74', title: 'Burns', contentTypes: [] },
      { id: 'l75', title: 'Dive Emergencies', contentTypes: [] },
      { id: 'l76', title: 'Emergency Department - Anaphylaxis', contentTypes: [] },
      { id: 'l77', title: 'Emergency Department - Bites and Stings', contentTypes: [] },
    ],
  },
];

const defaultFormData: CourseFormData = {
  title: '',
  description: '',
  difficulty: 'BEGINNER',
  xpReward: 100,
  modules: [],
};

const uid = () => Math.random().toString(36).substring(2, 9);

// ---- Lesson Row Component ----
function LessonRow({
  lesson,
  onUpdate,
  onDelete,
}: {
  lesson: LessonForm;
  onUpdate: (updated: LessonForm) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fileRefs = {
    VIDEO: useRef<HTMLInputElement>(null),
    PPT: useRef<HTMLInputElement>(null),
    EBOOK: useRef<HTMLInputElement>(null),
  };

  const toggleContentType = (type: LessonContentType) => {
    const has = lesson.contentTypes.includes(type);
    onUpdate({
      ...lesson,
      contentTypes: has ? lesson.contentTypes.filter(t => t !== type) : [...lesson.contentTypes, type],
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
          placeholder="Lesson title..."
          className="flex-1 text-sm text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
        />
        {/* Content type toggles */}
        <div className="flex items-center gap-1">
          {(['VIDEO', 'PPT', 'EBOOK'] as LessonContentType[]).map(type => {
            const cfg = contentTypeConfig[type];
            const active = lesson.contentTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleContentType(type)}
                title={cfg.label}
                className={`px-2 py-1 rounded text-xs font-medium border transition-all ${
                  active ? cfg.color : 'text-gray-400 bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                {type === 'VIDEO' ? '▶ Video' : type === 'PPT' ? '📊 PPT' : '📖 eBook'}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} className="p-1 hover:bg-red-50 rounded text-red-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload slots (expanded) */}
      {expanded && lesson.contentTypes.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-3 space-y-3">
          {lesson.contentTypes.map(type => {
            const cfg = contentTypeConfig[type];
            const fileKey = type.toLowerCase() as 'video' | 'ppt' | 'ebook';
            const urlKey = `${fileKey}Url` as 'videoUrl' | 'pptUrl' | 'ebookUrl';
            const fileVal = lesson[`${fileKey}File` as 'videoFile' | 'pptFile' | 'ebookFile'];
            const urlVal = lesson[urlKey];

            return (
              <div key={type} className={`rounded-lg border p-3 ${cfg.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">{cfg.label}</span>
                  {fileVal && (
                    <span className="text-xs truncate max-w-[160px] opacity-70">{fileVal.name}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => type !== 'TEXT' && (fileRefs as any)[type]?.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-current border-opacity-30 text-xs font-medium hover:opacity-80 transition-opacity"
                  >
                    <Upload className="w-3 h-3" />
                    {fileVal ? 'Change file' : 'Upload file'}
                  </button>
                  <input
                    ref={(fileRefs as any)[type]}
                    type="file"
                    accept={cfg.accept}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUpdate({ ...lesson, [`${fileKey}File`]: f, [urlKey]: undefined });
                    }}
                  />
                  <div className="flex-1 flex items-center gap-1 px-2 py-1 bg-white border border-current border-opacity-30 rounded-lg">
                    <LinkIcon className="w-3 h-3 flex-shrink-0 opacity-50" />
                    <input
                      type="url"
                      value={urlVal || ''}
                      onChange={(e) => onUpdate({ ...lesson, [urlKey]: e.target.value, [`${fileKey}File`]: undefined })}
                      placeholder="or paste URL..."
                      className="flex-1 text-xs bg-transparent outline-none placeholder-current placeholder-opacity-40"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- Module Section Component ----
function ModuleSection({
  module,
  index,
  onUpdate,
  onDelete,
}: {
  module: ModuleForm;
  index: number;
  onUpdate: (updated: ModuleForm) => void;
  onDelete: () => void;
}) {
  const addLesson = () => {
    onUpdate({
      ...module,
      lessons: [...module.lessons, { id: uid(), title: '', contentTypes: [] }],
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Module header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => onUpdate({ ...module, expanded: !module.expanded })}
      >
        <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
          {index + 1}
        </span>
        <input
          type="text"
          value={module.title}
          onChange={(e) => { e.stopPropagation(); onUpdate({ ...module, title: e.target.value }); }}
          onClick={(e) => e.stopPropagation()}
          placeholder="Module title..."
          className="flex-1 font-medium text-sm text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
        />
        <span className="text-xs text-gray-400">{module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}</span>
        {module.expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 hover:bg-red-100 rounded text-red-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Lessons */}
      {module.expanded && (
        <div className="p-3 space-y-2 bg-white">
          {module.lessons.map((lesson, li) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onUpdate={(updated) => {
                const lessons = [...module.lessons];
                lessons[li] = updated;
                onUpdate({ ...module, lessons });
              }}
              onDelete={() => {
                onUpdate({ ...module, lessons: module.lessons.filter((_, i) => i !== li) });
              }}
            />
          ))}
          <button
            onClick={addLesson}
            className="w-full py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Lesson
          </button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [createStep, setCreateStep] = useState<1 | 2>(1);

  // Import/Export states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<string[]>([]);

  // API hooks
  const { data: coursesData, isLoading, refetch } = useAdminCourses({
    search: searchQuery || undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  });

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const courses = coursesData?.data?.courses || [];
  const totalEnrollments = courses.reduce((sum: number, c: any) => sum + (c.stats?.enrollments || 0), 0);
  const avgRating = courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).length > 0
    ? courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).reduce((sum: number, c: any) => sum + parseFloat(c.stats?.avgRating), 0) /
      courses.filter((c: any) => parseFloat(c.stats?.avgRating) > 0).length
    : 0;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateModule = (index: number, updated: ModuleForm) => {
    const modules = [...formData.modules];
    modules[index] = updated;
    setFormData(prev => ({ ...prev, modules }));
  };

  const deleteModule = (index: number) => {
    setFormData(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { id: uid(), title: '', expanded: true, lessons: [] }],
    }));
  };

  const loadFellowshipTemplate = () => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || 'Fellowship in Emergency Medicine',
      description: prev.description || 'A comprehensive fellowship program covering all aspects of emergency medicine including airway management, trauma, cardiac emergencies, toxicology, and more.',
      difficulty: 'ADVANCED',
      modules: FELLOWSHIP_TEMPLATE.map(m => ({ ...m, expanded: false })),
    }));
  };

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
      const payload = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        xpReward: formData.xpReward,
        modules: formData.modules.map((m, mi) => ({
          title: m.title,
          order: mi,
          lessons: m.lessons.map((l, li) => ({
            title: l.title,
            order: li,
            contentTypes: l.contentTypes,
            videoUrl: l.videoUrl,
            pptUrl: l.pptUrl,
            ebookUrl: l.ebookUrl,
          })),
        })),
      };

      await createCourseMutation.mutateAsync(payload);
      setShowCreateModal(false);
      setFormData(defaultFormData);
      setCreateStep(1);
      showNotification('success', 'Course created successfully!');
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to create course');
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse || !formData.title.trim()) {
      showNotification('error', 'Course title is required');
      return;
    }
    try {
      await updateCourseMutation.mutateAsync({ id: selectedCourse.id, data: formData });
      setShowEditModal(false);
      setSelectedCourse(null);
      setFormData(defaultFormData);
      showNotification('success', 'Course updated successfully!');
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update course');
    }
  };

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

  const handleStatusChange = async (courseId: string, newStatus: CourseStatus) => {
    try {
      await updateCourseMutation.mutateAsync({ id: courseId, data: { status: newStatus } });
      showNotification('success', `Course status changed to ${newStatus}`);
      refetch();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update status');
    }
  };

  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      difficulty: course.difficulty,
      xpReward: course.xpReward,
      modules: [],
    });
    setShowEditModal(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedForExport.length > 0) params.append('ids', selectedForExport.join(','));
      else params.append('all', 'true');
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
    } catch {
      showNotification('error', 'Failed to export courses');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setIsImporting(true);
    try {
      const fileContent = await importFile.text();
      const data = JSON.parse(fileContent);
      if (!data.courses || !Array.isArray(data.courses)) throw new Error('Invalid file format');
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

  const totalLessonsInForm = formData.modules.reduce((sum, m) => sum + m.lessons.length, 0);

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
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
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
          <p className="text-gray-500 text-sm">Manage courses, modules, and content</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowImportModal(true)} className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />Import
          </button>
          <button onClick={handleExport} disabled={isExporting} className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm flex items-center gap-2 transition-colors disabled:opacity-50">
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}Export
          </button>
          <button onClick={() => { setFormData(defaultFormData); setCreateStep(1); setShowCreateModal(true); }} className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />Create Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-orange-500' },
          { label: 'Published', value: courses.filter((c: any) => c.status === 'PUBLISHED').length.toString(), icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Total Enrollments', value: totalEnrollments.toLocaleString(), icon: Users, color: 'text-blue-500' },
          { label: 'Avg. Rating', value: avgRating.toFixed(1), icon: Star, color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
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

      {/* Loading */}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course: any) => {
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
                            <FileText className="w-3 h-3" />{course.stats?.modules || 0} modules
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3" />{course.stats?.lessons || 0} lessons
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-800">{(course.stats?.enrollments || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{(course.stats?.completions || 0).toLocaleString()} completed</div>
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
                          <button onClick={() => { setSelectedCourse(course); setShowViewModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="View">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button onClick={() => openEditModal(course)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button onClick={() => { setSelectedCourse(course); setShowDeleteModal(true); }} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
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
              <button onClick={() => { setFormData(defaultFormData); setCreateStep(1); setShowCreateModal(true); }} className="mt-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors">
                Create your first course
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== CREATE COURSE MODAL ===================== */}
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Create New Course</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${createStep === 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>1 Course Info</span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${createStep === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>2 Modules & Content</span>
                  </div>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto">

                {/* ---- STEP 1: Course Info ---- */}
                {createStep === 1 && (
                  <div className="p-6 space-y-5">
                    {/* Thumbnail */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload course thumbnail</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Title <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Fellowship in Emergency Medicine"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="What will students learn in this course?"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        >
                          {levels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
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
                  </div>
                )}

                {/* ---- STEP 2: Modules & Content ---- */}
                {createStep === 2 && (
                  <div className="p-6 space-y-4">
                    {/* Quick summary bar */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="text-sm text-orange-700 font-medium">{formData.title}</div>
                      <div className="text-xs text-orange-600">{formData.modules.length} modules · {totalLessonsInForm} lessons</div>
                    </div>

                    {/* Load template button */}
                    <button
                      onClick={loadFellowshipTemplate}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-orange-200 text-sm text-orange-600 font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <BookMarked className="w-4 h-4" />
                      Load Fellowship in Emergency Medicine template ({FELLOWSHIP_TEMPLATE.length} modules, {FELLOWSHIP_TEMPLATE.reduce((s, m) => s + m.lessons.length, 0)} lessons)
                    </button>

                    {/* Content type legend */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="font-medium">Add to each lesson:</span>
                      {(['VIDEO', 'PPT', 'EBOOK'] as LessonContentType[]).map(type => (
                        <span key={type} className={`px-2 py-0.5 rounded border font-medium ${contentTypeConfig[type].color}`}>
                          {type === 'VIDEO' ? '▶ Video' : type === 'PPT' ? '📊 PPT' : '📖 eBook'}
                        </span>
                      ))}
                      <span className="text-gray-400">— click a badge on any lesson to attach content</span>
                    </div>

                    {/* Modules list */}
                    <div className="space-y-3">
                      {formData.modules.map((mod, mi) => (
                        <ModuleSection
                          key={mod.id}
                          module={mod}
                          index={mi}
                          onUpdate={(updated) => updateModule(mi, updated)}
                          onDelete={() => deleteModule(mi)}
                        />
                      ))}
                    </div>

                    <button
                      onClick={addModule}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Module
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => createStep === 1 ? setShowCreateModal(false) : setCreateStep(1)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
                >
                  {createStep === 1 ? 'Cancel' : '← Back'}
                </button>
                {createStep === 1 ? (
                  <button
                    onClick={() => {
                      if (!formData.title.trim()) { showNotification('error', 'Course title is required'); return; }
                      if (!formData.description.trim()) { showNotification('error', 'Description is required'); return; }
                      setCreateStep(2);
                    }}
                    className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    Next: Add Modules →
                  </button>
                ) : (
                  <button
                    onClick={handleCreateCourse}
                    disabled={createCourseMutation.isPending}
                    className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {createCourseMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                    ) : (
                      <><Save className="w-4 h-4" />Create Course</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== EDIT MODAL ===================== */}
      <AnimatePresence>
        {showEditModal && selectedCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Edit Course</h2>
                  <p className="text-sm text-gray-500">Update course details</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4} className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select value={formData.difficulty} onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50">
                      {levels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                    <input type="number" value={formData.xpReward} onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 100 }))}
                      min="0" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleEditCourse} disabled={updateCourseMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {updateCourseMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Changes</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== DELETE MODAL ===================== */}
      <AnimatePresence>
        {showDeleteModal && selectedCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}
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
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={handleDeleteCourse} disabled={deleteCourseMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {deleteCourseMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : <><Trash2 className="w-4 h-4" />Delete</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== VIEW MODAL ===================== */}
      <AnimatePresence>
        {showViewModal && selectedCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedCourse.title}</h2>
                  <p className="text-sm text-gray-500">{selectedCourse.difficulty}</p>
                </div>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Enrollments', value: (selectedCourse.stats?.enrollments || 0).toLocaleString(), icon: Users, color: 'text-blue-500' },
                    { label: 'Completions', value: (selectedCourse.stats?.completions || 0).toLocaleString(), icon: CheckCircle2, color: 'text-green-500' },
                    { label: 'Rating', value: selectedCourse.stats?.avgRating || '-', icon: Star, color: 'text-yellow-500' },
                  ].map(s => (
                    <div key={s.label} className="p-4 rounded-xl bg-gray-50">
                      <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                      <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedCourse.description || 'No description'}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />{selectedCourse.stats?.modules || 0} Modules</div>
                  <div className="flex items-center gap-2"><Video className="w-4 h-4 text-gray-400" />{selectedCourse.stats?.lessons || 0} Lessons</div>
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" />XP: {selectedCourse.xpReward}</div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button onClick={() => { setShowViewModal(false); openEditModal(selectedCourse); }}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />Edit Course
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== IMPORT MODAL ===================== */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !isImporting && setShowImportModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Import Courses</h2>
                <button onClick={() => !isImporting && setShowImportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${importFile ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-orange-300'}`}>
                  <input type="file" accept=".json" onChange={(e) => setImportFile(e.target.files?.[0] || null)} className="hidden" />
                  <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {importFile ? <p className="text-sm text-green-600 font-medium">{importFile.name}</p> : <><p className="text-sm text-gray-600">Click to select JSON file</p><p className="text-xs text-gray-400 mt-1">Exported courses JSON format</p></>}
                </label>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button onClick={() => { setShowImportModal(false); setImportFile(null); }} disabled={isImporting} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={handleImport} disabled={!importFile || isImporting} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isImporting ? <><Loader2 className="w-4 h-4 animate-spin" />Importing...</> : <><Upload className="w-4 h-4" />Import</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
