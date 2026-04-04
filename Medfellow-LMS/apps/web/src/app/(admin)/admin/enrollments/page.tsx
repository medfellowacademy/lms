'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Award,
  Eye,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Play,
  Video,
  FileText,
  AlertTriangle,
  Download,
  RefreshCw,
  Loader2,
  Users,
  Clock,
  MoreHorizontal,
  GraduationCap,
  Ban,
  UserCheck,
  Shield,
  Calendar,
  TrendingUp,
  Mail,
} from 'lucide-react';

/* ─── Types ─── */
type AccessStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'PENDING';
type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';

interface LessonLock {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'INTERACTIVE';
  order: number;
  isLocked: boolean;
  duration: string;
}

interface ModuleLock {
  id: string;
  title: string;
  lessons: LessonLock[];
}

interface Enrollment {
  id: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    specialty: string;
    institution: string;
    isVerified: boolean;
  };
  course: {
    id: string;
    title: string;
    category: string;
    modules: number;
    lessons: number;
  };
  enrolledAt: string;
  lastAccessed: string;
  progress: number;
  status: AccessStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  credentialIssued: boolean;
  credentialId: string | null;
  modules: ModuleLock[];
}

/* ─── Mock data ─── */
const mockModules = (courseTitle: string): ModuleLock[] => [
  {
    id: 'm1',
    title: 'Module 1: Fundamentals',
    lessons: [
      { id: 'l1', title: 'Introduction & Overview',         type: 'VIDEO',       order: 1, isLocked: false, duration: '18 min' },
      { id: 'l2', title: 'Core Anatomy Review',             type: 'VIDEO',       order: 2, isLocked: false, duration: '24 min' },
      { id: 'l3', title: 'Case Study: Basic Assessment',    type: 'INTERACTIVE', order: 3, isLocked: false, duration: '35 min' },
      { id: 'l4', title: 'Module 1 Assessment',             type: 'QUIZ',        order: 4, isLocked: false, duration: '20 min' },
    ],
  },
  {
    id: 'm2',
    title: 'Module 2: Intermediate Techniques',
    lessons: [
      { id: 'l5', title: 'Advanced Procedural Skills',      type: 'VIDEO',       order: 1, isLocked: true,  duration: '42 min' },
      { id: 'l6', title: 'Hemodynamic Interpretation',      type: 'VIDEO',       order: 2, isLocked: true,  duration: '38 min' },
      { id: 'l7', title: 'Hands-on Lab Simulation',         type: 'INTERACTIVE', order: 3, isLocked: true,  duration: '60 min' },
    ],
  },
  {
    id: 'm3',
    title: 'Module 3: Advanced Practice',
    lessons: [
      { id: 'l8',  title: 'Complex Case Management',        type: 'VIDEO',       order: 1, isLocked: true,  duration: '50 min' },
      { id: 'l9',  title: 'Certification Prep Exam',        type: 'QUIZ',        order: 2, isLocked: true,  duration: '90 min' },
      { id: 'l10', title: 'Live Session Recording',         type: 'VIDEO',       order: 3, isLocked: true,  duration: '75 min' },
    ],
  },
];

const mockEnrollments: Enrollment[] = [
  {
    id: 'enr-001',
    doctor: { id: 'u1', name: 'User Name',    email: 'priya.sharma@hospital.in',   avatar: 'PS', specialty: 'Interventional Cardiology', institution: 'AIIMS Delhi',         isVerified: true  },
    course:  { id: 'c1', title: 'Interventional Cardiology Fellowship', category: 'Cardiology',   modules: 3, lessons: 10 },
    enrolledAt: '2024-03-01', lastAccessed: '2024-03-14', progress: 68, status: 'ACTIVE',    paymentStatus: 'COMPLETED', paidAmount: 2999, credentialIssued: false, credentialId: null,
    modules: mockModules('Cardiology'),
  },
  {
    id: 'enr-002',
    doctor: { id: 'u2', name: 'Dr. James Mitchell',  email: 'j.mitchell@stanford.edu',    avatar: 'JM', specialty: 'Neurosurgery',              institution: 'Stanford Medical',    isVerified: true  },
    course:  { id: 'c2', title: 'Neurosurgical Oncology',                category: 'Neurology',    modules: 3, lessons: 10 },
    enrolledAt: '2024-02-15', lastAccessed: '2024-03-13', progress: 32, status: 'ACTIVE',    paymentStatus: 'COMPLETED', paidAmount: 3999, credentialIssued: false, credentialId: null,
    modules: mockModules('Neurology'),
  },
  {
    id: 'enr-003',
    doctor: { id: 'u3', name: 'Dr. Aisha Karimi',    email: 'a.karimi@aga-khan.pk',       avatar: 'AK', specialty: 'Emergency Medicine',         institution: 'Aga Khan University', isVerified: false },
    course:  { id: 'c6', title: 'Emergency Medicine Leadership',         category: 'Emergency',    modules: 3, lessons: 10 },
    enrolledAt: '2024-03-10', lastAccessed: '2024-03-10', progress: 5,  status: 'PENDING',   paymentStatus: 'PENDING',   paidAmount: 1999, credentialIssued: false, credentialId: null,
    modules: mockModules('Emergency'),
  },
  {
    id: 'enr-004',
    doctor: { id: 'u4', name: 'Dr. Riku Yamamoto',   email: 'riku.y@keio.ac.jp',          avatar: 'RY', specialty: 'Pediatric Surgery',          institution: 'Keio University',     isVerified: true  },
    course:  { id: 'c5', title: 'Pediatric Critical Care',               category: 'Pediatrics',   modules: 3, lessons: 10 },
    enrolledAt: '2024-01-20', lastAccessed: '2024-03-01', progress: 100, status: 'ACTIVE',   paymentStatus: 'COMPLETED', paidAmount: 2799, credentialIssued: true,  credentialId: 'MF-CERT-RY-2024',
    modules: mockModules('Pediatrics'),
  },
  {
    id: 'enr-005',
    doctor: { id: 'u5', name: 'User Name',  email: 'e.kowalski@uw.edu.pl',       avatar: 'EK', specialty: 'Orthopedic Surgery',         institution: 'Warsaw University',   isVerified: true  },
    course:  { id: 'c3', title: 'Sports Medicine & Arthroscopy',         category: 'Orthopedics',  modules: 3, lessons: 10 },
    enrolledAt: '2024-02-01', lastAccessed: '2024-03-12', progress: 45, status: 'PAUSED',    paymentStatus: 'COMPLETED', paidAmount: 2499, credentialIssued: false, credentialId: null,
    modules: mockModules('Orthopedics'),
  },
  {
    id: 'enr-006',
    doctor: { id: 'u6', name: 'Dr. Marcus Johnson',  email: 'm.johnson@clevelandclinic.org', avatar: 'MJ', specialty: 'Cardiovascular Surgery', institution: 'Cleveland Clinic',    isVerified: true  },
    course:  { id: 'c1', title: 'Interventional Cardiology Fellowship', category: 'Cardiology',   modules: 3, lessons: 10 },
    enrolledAt: '2024-01-10', lastAccessed: '2024-03-14', progress: 89, status: 'ACTIVE',    paymentStatus: 'COMPLETED', paidAmount: 2999, credentialIssued: false, credentialId: null,
    modules: mockModules('Cardiology'),
  },
];

/* ─── Helpers ─── */
const statusConfig: Record<AccessStatus, { label: string; bg: string; text: string; dot: string }> = {
  ACTIVE:    { label: 'Access Granted', bg: 'bg-emerald-50 dark:bg-emerald-900/20',  text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  PAUSED:    { label: 'Locked',         bg: 'bg-amber-50  dark:bg-amber-900/20',     text: 'text-amber-700  dark:text-amber-400',   dot: 'bg-amber-500'   },
  CANCELLED: { label: 'Revoked',        bg: 'bg-rose-50   dark:bg-rose-900/20',      text: 'text-rose-700   dark:text-rose-400',    dot: 'bg-rose-500'    },
  PENDING:   { label: 'Pending',        bg: 'bg-blue-50   dark:bg-blue-900/20',      text: 'text-blue-700   dark:text-blue-400',    dot: 'bg-blue-500'    },
};

const paymentConfig: Record<PaymentStatus, { label: string; cls: string }> = {
  COMPLETED: { label: 'Paid',    cls: 'text-emerald-600 dark:text-emerald-400' },
  PENDING:   { label: 'Pending', cls: 'text-amber-600   dark:text-amber-400'  },
  FAILED:    { label: 'Failed',  cls: 'text-rose-600    dark:text-rose-400'   },
  REFUNDED:  { label: 'Refunded',cls: 'text-slate-500   dark:text-slate-400'  },
};

const lessonTypeIcon: Record<string, any> = {
  VIDEO:       Video,
  TEXT:        FileText,
  QUIZ:        CheckCircle2,
  INTERACTIVE: Play,
};

/* ─── Credential modal ─── */
function CredentialModal({
  enrollment,
  onClose,
  onIssued,
}: {
  enrollment: Enrollment;
  onClose: () => void;
  onIssued: (id: string, credId: string) => void;
}) {
  const [issuing, setIssuing] = useState(false);
  const credId = `MF-CERT-${enrollment.doctor.avatar}-${new Date().getFullYear()}`;

  const handleIssue = async () => {
    setIssuing(true);
    await new Promise((r) => setTimeout(r, 1400)); // simulate API
    onIssued(enrollment.id, credId);
    setIssuing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Issue Credential</h3>
              <p className="text-white/70 text-xs">Generate a verified certificate</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Doctor + course info */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                {enrollment.doctor.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{enrollment.doctor.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{enrollment.doctor.specialty} · {enrollment.doctor.institution}</p>
              </div>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-600" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Course Completed</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{enrollment.course.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Progress</p>
                <p className="text-sm font-semibold text-emerald-600">{enrollment.progress}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Credential ID</p>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300">{credId}</p>
              </div>
            </div>
          </div>

          {enrollment.progress < 80 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Course progress is {enrollment.progress}%. Credentials are typically issued at ≥80% completion.
                You can still issue it manually.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleIssue}
              disabled={issuing}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              {issuing ? 'Issuing…' : 'Issue Credential'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Lesson lock row ─── */
function LessonRow({
  lesson,
  enrollmentId,
  moduleId,
  onToggle,
}: {
  lesson: LessonLock;
  enrollmentId: string;
  moduleId: string;
  onToggle: (enrollmentId: string, moduleId: string, lessonId: string) => void;
}) {
  const Icon = lessonTypeIcon[lesson.type] ?? Video;
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        lesson.type === 'VIDEO'       ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'  :
        lesson.type === 'QUIZ'        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
        lesson.type === 'INTERACTIVE' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-500' :
        'bg-slate-100 dark:bg-slate-700 text-slate-500'
      }`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${lesson.isLocked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
          {lesson.order}. {lesson.title}
        </p>
        <p className="text-[10px] text-slate-400">{lesson.duration}</p>
      </div>
      <button
        onClick={() => onToggle(enrollmentId, moduleId, lesson.id)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
          lesson.isLocked
            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
        }`}
      >
        {lesson.isLocked ? <><Lock className="w-3 h-3" /> Locked</> : <><Unlock className="w-3 h-3" /> Open</>}
      </button>
    </div>
  );
}

/* ─── Enrollment row ─── */
function EnrollmentRow({
  enrollment,
  onStatusChange,
  onCredentialModal,
  onLessonToggle,
}: {
  enrollment: Enrollment;
  onStatusChange: (id: string, status: AccessStatus) => void;
  onCredentialModal: (enrollment: Enrollment) => void;
  onLessonToggle: (enrollmentId: string, moduleId: string, lessonId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [actionMenu, setActionMenu] = useState(false);
  const sc = statusConfig[enrollment.status];

  const lockedCount = enrollment.modules.flatMap((m) => m.lessons).filter((l) => l.isLocked).length;
  const totalLessons = enrollment.modules.flatMap((m) => m.lessons).length;

  return (
    <>
      <tr className="border-b border-slate-100 dark:border-slate-700/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">

        {/* Expand */}
        <td className="py-3.5 pl-4 pr-2 w-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </td>

        {/* Doctor */}
        <td className="py-3.5 pr-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {enrollment.doctor.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{enrollment.doctor.name}</p>
                {enrollment.doctor.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{enrollment.doctor.email}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{enrollment.doctor.specialty}</p>
            </div>
          </div>
        </td>

        {/* Course */}
        <td className="py-3.5 pr-4 hidden md:table-cell">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{enrollment.course.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{enrollment.course.category}</span>
            <span className="text-[10px] text-slate-400">{enrollment.course.modules} modules · {enrollment.course.lessons} lessons</span>
          </div>
        </td>

        {/* Progress */}
        <td className="py-3.5 pr-4 hidden lg:table-cell w-32">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Progress</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <div
                className={`h-full rounded-full ${enrollment.progress === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`}
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {lockedCount > 0 ? (
              <span className="text-amber-500">{lockedCount}/{totalLessons} lessons locked</span>
            ) : (
              <span className="text-emerald-500">All lessons open</span>
            )}
          </p>
        </td>

        {/* Payment */}
        <td className="py-3.5 pr-4 hidden xl:table-cell">
          <p className={`text-xs font-semibold ${paymentConfig[enrollment.paymentStatus].cls}`}>
            {paymentConfig[enrollment.paymentStatus].label}
          </p>
          <p className="text-[11px] text-slate-400">${enrollment.paidAmount.toLocaleString()}</p>
        </td>

        {/* Access status */}
        <td className="py-3.5 pr-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </td>

        {/* Credential */}
        <td className="py-3.5 pr-4 hidden sm:table-cell">
          {enrollment.credentialIssued ? (
            <div>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Award className="w-3 h-3" /> Issued
              </p>
              <p className="text-[10px] font-mono text-slate-400">{enrollment.credentialId}</p>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="py-3.5 pl-2 pr-4">
          <div className="flex items-center gap-1.5">
            {/* Quick access toggle */}
            {enrollment.status === 'ACTIVE' && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'PAUSED')}
                title="Lock access"
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
            {enrollment.status === 'PAUSED' && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'ACTIVE')}
                title="Unlock access"
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5" />
              </button>
            )}
            {enrollment.status === 'PENDING' && (
              <button
                onClick={() => onStatusChange(enrollment.id, 'ACTIVE')}
                title="Approve access"
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Issue credential */}
            {!enrollment.credentialIssued && (
              <button
                onClick={() => onCredentialModal(enrollment)}
                title="Issue credential"
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-violet-50 dark:bg-violet-900/20 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
              </button>
            )}

            {/* View doctor */}
            <Link
              href={`/admin/users/${enrollment.doctor.id}`}
              title="View doctor profile"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>

            {/* More actions */}
            <div className="relative">
              <button
                onClick={() => setActionMenu(!actionMenu)}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {actionMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-20 overflow-hidden"
                    onMouseLeave={() => setActionMenu(false)}
                  >
                    {[
                      { icon: Mail,        label: 'Email Doctor',    action: () => window.open(`mailto:${enrollment.doctor.email}`) },
                      { icon: UserCheck,   label: 'Grant Access',    action: () => { onStatusChange(enrollment.id, 'ACTIVE');    setActionMenu(false); } },
                      { icon: Lock,        label: 'Lock Access',     action: () => { onStatusChange(enrollment.id, 'PAUSED');    setActionMenu(false); } },
                      { icon: Ban,         label: 'Revoke Access',   action: () => { onStatusChange(enrollment.id, 'CANCELLED'); setActionMenu(false); } },
                      { icon: Award,       label: 'Issue Credential',action: () => { onCredentialModal(enrollment); setActionMenu(false); } },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <item.icon className="w-3.5 h-3.5 text-slate-400" />
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </td>
      </tr>

      {/* ── Expanded: lesson-level lock controls ── */}
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={9} className="p-0 border-b border-slate-100 dark:border-slate-700/60">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-slate-50/80 dark:bg-slate-800/40"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                      Content Access Control — {enrollment.doctor.name}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          enrollment.modules.forEach((m) =>
                            m.lessons.forEach((l) => {
                              if (l.isLocked) onLessonToggle(enrollment.id, m.id, l.id);
                            })
                          );
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        <Unlock className="w-3 h-3" /> Unlock All
                      </button>
                      <button
                        onClick={() => {
                          enrollment.modules.forEach((m) =>
                            m.lessons.forEach((l) => {
                              if (!l.isLocked) onLessonToggle(enrollment.id, m.id, l.id);
                            })
                          );
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Lock All
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {enrollment.modules.map((mod) => {
                      const modLocked = mod.lessons.filter((l) => l.isLocked).length;
                      return (
                        <div key={mod.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          {/* Module header */}
                          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{mod.title}</p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              modLocked === 0
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                                : modLocked === mod.lessons.length
                                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                            }`}>
                              {modLocked === 0 ? 'All open' : `${modLocked}/${mod.lessons.length} locked`}
                            </span>
                          </div>
                          {/* Lessons */}
                          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {mod.lessons.map((lesson) => (
                              <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                enrollmentId={enrollment.id}
                                moduleId={mod.id}
                                onToggle={onLessonToggle}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function EnrollmentsPage() {
  const [enrollments, setEnrollments]         = useState<Enrollment[]>(mockEnrollments);
  const [search,      setSearch]              = useState('');
  const [statusFilter,setStatusFilter]        = useState<AccessStatus | 'all'>('all');
  const [courseFilter,setCourseFilter]        = useState('all');
  const [credModal,   setCredModal]           = useState<Enrollment | null>(null);
  const [saving,      setSaving]              = useState<string | null>(null);

  /* ── Computed stats ── */
  const stats = useMemo(() => ({
    total:    enrollments.length,
    active:   enrollments.filter((e) => e.status === 'ACTIVE').length,
    pending:  enrollments.filter((e) => e.status === 'PENDING').length,
    locked:   enrollments.filter((e) => e.status === 'PAUSED').length,
    revenue:  enrollments.filter((e) => e.paymentStatus === 'COMPLETED').reduce((a, e) => a + e.paidAmount, 0),
    credIssued: enrollments.filter((e) => e.credentialIssued).length,
  }), [enrollments]);

  /* ── Filtered list ── */
  const filtered = useMemo(() =>
    enrollments.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.doctor.name.toLowerCase().includes(q) || e.doctor.email.toLowerCase().includes(q) || e.course.title.toLowerCase().includes(q) || e.doctor.specialty.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchCourse = courseFilter === 'all' || e.course.title === courseFilter;
      return matchSearch && matchStatus && matchCourse;
    }),
    [enrollments, search, statusFilter, courseFilter]
  );

  /* ── Unique courses for filter ── */
  const courses = useMemo(() => [...new Set(enrollments.map((e) => e.course.title))], [enrollments]);

  /* ── Handlers ── */
  const handleStatusChange = useCallback(async (id: string, status: AccessStatus) => {
    setSaving(id);
    await new Promise((r) => setTimeout(r, 600)); // simulate API call
    setEnrollments((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    setSaving(null);
  }, []);

  const handleCredentialIssued = useCallback((enrollmentId: string, credId: string) => {
    setEnrollments((prev) =>
      prev.map((e) => e.id === enrollmentId ? { ...e, credentialIssued: true, credentialId: credId } : e)
    );
  }, []);

  const handleLessonToggle = useCallback((enrollmentId: string, moduleId: string, lessonId: string) => {
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id !== enrollmentId ? e : {
          ...e,
          modules: e.modules.map((m) =>
            m.id !== moduleId ? m : {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id !== lessonId ? l : { ...l, isLocked: !l.isLocked }
              ),
            }
          ),
        }
      )
    );
  }, []);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold text-gray-800">Enrollment Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Control doctor access, lock content, and issue credentials from one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Sync
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total',       value: stats.total,               icon: Users,          bg: 'bg-slate-50',    icon_c: 'text-slate-500' },
          { label: 'Active',      value: stats.active,              icon: CheckCircle2,   bg: 'bg-emerald-50',  icon_c: 'text-emerald-600' },
          { label: 'Pending',     value: stats.pending,             icon: Clock,          bg: 'bg-blue-50',     icon_c: 'text-blue-600' },
          { label: 'Locked',      value: stats.locked,              icon: Lock,           bg: 'bg-amber-50',    icon_c: 'text-amber-600' },
          { label: 'Credentials', value: stats.credIssued,          icon: Award,          bg: 'bg-violet-50',   icon_c: 'text-violet-600' },
          { label: 'Revenue',     value: `$${(stats.revenue/1000).toFixed(1)}k`, icon: TrendingUp, bg: 'bg-teal-50', icon_c: 'text-teal-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4.5 h-4.5 ${s.icon_c}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800 leading-none">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor, course…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-gray-50 transition-all"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Access Granted</option>
          <option value="PENDING">Pending</option>
          <option value="PAUSED">Locked</option>
          <option value="CANCELLED">Revoked</option>
        </select>

        {/* Course filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="ml-auto text-xs text-gray-400 self-center">
          {filtered.length} of {enrollments.length} enrollments
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-amber-500" /> Lock = pause course access</span>
        <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-teal-500" /> Expand row = lesson-level control</span>
        <span className="flex items-center gap-1"><Award className="w-3 h-3 text-violet-500" /> Issue credential per enrollment</span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 pl-4 pr-2 w-8" />
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Course</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell w-32">Progress</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Payment</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Access</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Credential</th>
                <th className="py-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400 text-sm">
                    No enrollments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((enrollment) => (
                  <EnrollmentRow
                    key={enrollment.id}
                    enrollment={enrollment}
                    onStatusChange={handleStatusChange}
                    onCredentialModal={setCredModal}
                    onLessonToggle={handleLessonToggle}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Credential modal ── */}
      <AnimatePresence>
        {credModal && (
          <CredentialModal
            enrollment={credModal}
            onClose={() => setCredModal(null)}
            onIssued={handleCredentialIssued}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

