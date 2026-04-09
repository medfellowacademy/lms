'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Award,
  BookOpen,
  Clock,
  Mail,
  MapPin,
  Briefcase,
  Shield,
  GraduationCap,
  Play,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Ban,
  Loader2,
  AlertTriangle,
  Edit,
  ExternalLink,
  BarChart3,
  Calendar,
  Zap,
  Star,
  Activity,
} from 'lucide-react';

/* ─── Types ─── */
type AccessStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'PENDING';

interface LessonAccess {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'INTERACTIVE';
  order: number;
  isLocked: boolean;
  duration: string;
  completedAt?: string;
}

interface ModuleAccess {
  id: string;
  title: string;
  isLocked: boolean;
  lessons: LessonAccess[];
}

interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  category: string;
  instructor: string;
  enrolledAt: string;
  lastAccessed: string;
  progress: number;
  status: AccessStatus;
  credentialIssued: boolean;
  credentialId: string | null;
  modules: ModuleAccess[];
}

/* ─── Doctor data will be loaded from database ─── */
const mockDoctor: any = null;

const mockCourses: EnrolledCourse[] = [];

/* ─── Helpers ─── */
const statusConfig: Record<AccessStatus, { label: string; bg: string; text: string; dot: string }> = {
  ACTIVE:    { label: 'Access Granted', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  PAUSED:    { label: 'Locked',         bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  CANCELLED: { label: 'Revoked',        bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  PENDING:   { label: 'Pending',        bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
};

const lessonTypeIcon: Record<string, any> = {
  VIDEO: Video, TEXT: FileText, QUIZ: CheckCircle2, INTERACTIVE: Play,
};

/* ─── Credential Issue Modal ─── */
function CredentialModal({
  course,
  doctorName,
  onClose,
  onIssued,
}: {
  course: EnrolledCourse;
  doctorName: string;
  onClose: () => void;
  onIssued: (enrollmentId: string, credId: string) => void;
}) {
  const [issuing, setIssuing] = useState(false);
  const credId = `MF-CERT-${course.title.split(' ').map((w) => w[0]).join('').slice(0, 4).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;

  const handleIssue = async () => {
    setIssuing(true);
    try {
      await fetch(`/api/admin/enrollments/${course.enrollmentId}/credential`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId: credId }),
      });
    } catch {/* use optimistic update */}
    await new Promise((r) => setTimeout(r, 1000));
    onIssued(course.enrollmentId, credId);
    setIssuing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Issue Credential</h3>
              <p className="text-white/70 text-xs">Digitally verified certificate</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 space-y-3 text-sm">
            <div><p className="text-xs text-gray-500">Recipient</p><p className="font-semibold">{doctorName}</p></div>
            <div><p className="text-xs text-gray-500">Course</p><p className="font-semibold">{course.title}</p></div>
            <div><p className="text-xs text-gray-500">Progress</p><p className={`font-bold ${course.progress >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{course.progress}%</p></div>
            <div><p className="text-xs text-gray-500">Credential ID</p><p className="font-mono text-xs text-gray-600">{credId}</p></div>
          </div>

          {course.progress < 80 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Progress is {course.progress}%. Standard threshold is 80%. Issuing manually overrides this requirement.</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={handleIssue} disabled={issuing} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-60">
              {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              {issuing ? 'Issuing…' : 'Issue Now'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Course access panel ─── */
function CourseAccessPanel({
  course,
  onStatusChange,
  onLessonToggle,
  onModuleToggle,
  onIssueCredential,
}: {
  course: EnrolledCourse;
  onStatusChange: (enrollmentId: string, status: AccessStatus) => void;
  onLessonToggle: (enrollmentId: string, moduleId: string, lessonId: string) => void;
  onModuleToggle: (enrollmentId: string, moduleId: string) => void;
  onIssueCredential: (course: EnrolledCourse) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const sc = statusConfig[course.status];
  const totalLessons = course.modules.flatMap((m) => m.lessons).length;
  const lockedLessons = course.modules.flatMap((m) => m.lessons).filter((l) => l.isLocked).length;
  const completedLessons = course.modules.flatMap((m) => m.lessons).filter((l) => l.completedAt).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Course header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 truncate">{course.title}</p>
            <p className="text-xs text-gray-500">{course.category} · {course.instructor} · Enrolled {course.enrolledAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-xs font-semibold text-gray-600">{course.progress}%</span>
          </div>

          {/* Status badge */}
          <span className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>

          {/* Lock / Unlock */}
          {course.status === 'ACTIVE' ? (
            <button
              onClick={() => onStatusChange(course.enrollmentId, 'PAUSED')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Lock Course
            </button>
          ) : course.status === 'PAUSED' ? (
            <button
              onClick={() => onStatusChange(course.enrollmentId, 'ACTIVE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" /> Unlock Course
            </button>
          ) : course.status === 'PENDING' ? (
            <button
              onClick={() => onStatusChange(course.enrollmentId, 'ACTIVE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" /> Approve Access
            </button>
          ) : null}

          {/* Credential */}
          {course.credentialIssued ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" /> {course.credentialId}
            </div>
          ) : (
            <button
              onClick={() => onIssueCredential(course)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold hover:bg-violet-100 transition-colors"
            >
              <Award className="w-3.5 h-3.5" /> Issue Credential
            </button>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 border-b border-gray-100 text-center divide-x divide-gray-100">
        <div className="px-4 py-2.5">
          <p className="text-sm font-bold text-gray-800">{completedLessons}/{totalLessons}</p>
          <p className="text-[10px] text-gray-400">Lessons Done</p>
        </div>
        <div className="px-4 py-2.5">
          <p className={`text-sm font-bold ${lockedLessons > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{lockedLessons}</p>
          <p className="text-[10px] text-gray-400">Locked Lessons</p>
        </div>
        <div className="px-4 py-2.5">
          <p className="text-sm font-bold text-gray-800">{course.lastAccessed}</p>
          <p className="text-[10px] text-gray-400">Last Accessed</p>
        </div>
      </div>

      {/* Module + lesson tree */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Bulk controls */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Access Control</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => course.modules.forEach((m) => m.lessons.forEach((l) => { if (l.isLocked) onLessonToggle(course.enrollmentId, m.id, l.id); }))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Unlock className="w-3 h-3" /> Unlock All
                  </button>
                  <button
                    onClick={() => course.modules.forEach((m) => m.lessons.forEach((l) => { if (!l.isLocked) onLessonToggle(course.enrollmentId, m.id, l.id); }))}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" /> Lock All
                  </button>
                </div>
              </div>

              {course.modules.map((mod) => {
                const modLockedCount = mod.lessons.filter((l) => l.isLocked).length;
                return (
                  <div key={mod.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Module header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-700">{mod.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          modLockedCount === 0 ? 'bg-emerald-50 text-emerald-600' :
                          modLockedCount === mod.lessons.length ? 'bg-rose-50 text-rose-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {modLockedCount === 0 ? 'All open' : `${modLockedCount}/${mod.lessons.length} locked`}
                        </span>
                        {/* Module-level toggle */}
                        <button
                          onClick={() => onModuleToggle(course.enrollmentId, mod.id)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors ${
                            mod.isLocked
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {mod.isLocked ? <><Lock className="w-2.5 h-2.5" /> Module Locked</> : <><Unlock className="w-2.5 h-2.5" /> Toggle All</>}
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="divide-y divide-gray-100">
                      {mod.lessons.map((lesson) => {
                        const Icon = lessonTypeIcon[lesson.type] ?? Video;
                        return (
                          <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            {/* Type icon */}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              lesson.type === 'VIDEO'       ? 'bg-blue-50 text-blue-500'   :
                              lesson.type === 'QUIZ'        ? 'bg-amber-50 text-amber-500' :
                              lesson.type === 'INTERACTIVE' ? 'bg-violet-50 text-violet-500' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-xs font-medium truncate ${lesson.isLocked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                  {lesson.order}. {lesson.title}
                                </p>
                                {lesson.completedAt && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400">{lesson.type} · {lesson.duration}</p>
                            </div>

                            {/* Completed badge */}
                            {lesson.completedAt && (
                              <span className="text-[10px] text-emerald-500 hidden sm:block flex-shrink-0">✓ Done</span>
                            )}

                            {/* Lock toggle */}
                            <button
                              onClick={() => onLessonToggle(course.enrollmentId, mod.id, lesson.id)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all flex-shrink-0 ${
                                lesson.isLocked
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              {lesson.isLocked
                                ? <><Lock className="w-2.5 h-2.5" /> Locked</>
                                : <><Unlock className="w-2.5 h-2.5" /> Open</>}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [courses, setCourses]     = useState<EnrolledCourse[]>(mockCourses);
  const [credModal, setCredModal] = useState<EnrolledCourse | null>(null);
  const [saving, setSaving]       = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'activity' | 'credentials'>('courses');

  const doc = mockDoctor; // in production: fetch by `id`

  /* ── Handlers ── */
  const handleStatusChange = async (enrollmentId: string, status: AccessStatus) => {
    setSaving(enrollmentId);
    try {
      await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {/* optimistic */}
    setCourses((prev) => prev.map((c) => c.enrollmentId === enrollmentId ? { ...c, status } : c));
    setSaving(null);
  };

  const handleLessonToggle = (enrollmentId: string, moduleId: string, lessonId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.enrollmentId !== enrollmentId ? c : {
          ...c,
          modules: c.modules.map((m) =>
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
  };

  const handleModuleToggle = (enrollmentId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.enrollmentId !== enrollmentId ? c : {
          ...c,
          modules: c.modules.map((m) =>
            m.id !== moduleId ? m : {
              ...m,
              isLocked: !m.isLocked,
              lessons: m.lessons.map((l) => ({ ...l, isLocked: !m.isLocked })),
            }
          ),
        }
      )
    );
  };

  const handleCredentialIssued = (enrollmentId: string, credId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.enrollmentId === enrollmentId ? { ...c, credentialIssued: true, credentialId: credId } : c
      )
    );
  };

  const issuedCredentials = courses.filter((c) => c.credentialIssued);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/users" className="hover:text-gray-700 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> All Users
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{doc.name}</span>
      </div>

      {/* ── Doctor profile card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {doc.avatar}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">{doc.name}</h1>
                  {doc.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{doc.medicalTitle} · {doc.specialty}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.institution}, {doc.country}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{doc.email}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {doc.joinedAt}</span>
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" />Last active {doc.lastActive}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit Profile
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 hover:bg-red-100 transition-colors">
                  <Ban className="w-3.5 h-3.5" /> Suspend
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Zap,          label: 'Total XP',    value: doc.xp.toLocaleString(), color: 'text-amber-500' },
                { icon: GraduationCap,label: 'Courses',     value: courses.length,           color: 'text-teal-500' },
                { icon: Award,        label: 'Credentials', value: issuedCredentials.length,  color: 'text-violet-500' },
                { icon: Activity,     label: 'Streak',      value: `${doc.streak} days`,      color: 'text-emerald-500' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
                  <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{s.value}</p>
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: 'courses',     label: 'Course Access Control',  icon: BookOpen },
          { id: 'credentials', label: 'Credentials',            icon: Award },
          { id: 'activity',    label: 'Activity',               icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Course Access Control ── */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Manage per-course and per-lesson access for {doc.name}.
              Changes take effect immediately.
            </p>
          </div>
          {courses.map((course) => (
            <CourseAccessPanel
              key={course.enrollmentId}
              course={course}
              onStatusChange={handleStatusChange}
              onLessonToggle={handleLessonToggle}
              onModuleToggle={handleModuleToggle}
              onIssueCredential={setCredModal}
            />
          ))}
        </div>
      )}

      {/* ── Tab: Credentials ── */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Issued Credentials</h2>
              <span className="text-xs text-gray-400">{issuedCredentials.length} issued</span>
            </div>
            {issuedCredentials.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No credentials issued yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {issuedCredentials.map((c) => (
                  <div key={c.enrollmentId} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.category} · Completed {c.lastAccessed}</p>
                      <p className="text-xs font-mono text-violet-600 mt-0.5">{c.credentialId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                        <ExternalLink className="w-3 h-3" /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending credentials */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Pending — Issue Credential</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {courses.filter((c) => !c.credentialIssued).map((c) => (
                <div key={c.enrollmentId} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.category} · Progress: {c.progress}%</p>
                  </div>
                  <button
                    onClick={() => setCredModal(c)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" /> Issue
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Activity ── */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, text: 'Completed: PCI Fundamentals',        time: '2024-03-14 09:12', color: 'text-emerald-500 bg-emerald-50' },
              { icon: Play,        text: 'Started: Bifurcation Stenting',       time: '2024-03-13 18:45', color: 'text-blue-500 bg-blue-50' },
              { icon: Star,        text: 'Scored 94% on Hemodynamics Quiz',    time: '2024-03-12 14:30', color: 'text-amber-500 bg-amber-50' },
              { icon: Award,       text: 'Earned: 7-Day Streak Achievement',    time: '2024-03-11 08:00', color: 'text-violet-500 bg-violet-50' },
              { icon: BookOpen,    text: 'Enrolled: Interventional Cardiology', time: '2024-03-01 10:15', color: 'text-teal-500 bg-teal-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credential modal */}
      <AnimatePresence>
        {credModal && (
          <CredentialModal
            course={credModal}
            doctorName={doc.name}
            onClose={() => setCredModal(null)}
            onIssued={handleCredentialIssued}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
