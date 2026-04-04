'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Activity,
  Stethoscope,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { useCourses, useProgress } from '@/lib/api';

/* ─── Constants ─── */
const categories = [
  { id: 'all',          label: 'All Programs',  count: 234 },
  { id: 'cardiology',   label: 'Cardiology',    count: 28,  icon: Heart },
  { id: 'neurology',    label: 'Neurology',     count: 22,  icon: Brain },
  { id: 'orthopedics',  label: 'Orthopedics',   count: 18,  icon: Bone },
  { id: 'ophthalmology',label: 'Ophthalmology', count: 15,  icon: Eye },
  { id: 'pediatrics',   label: 'Pediatrics',    count: 20,  icon: Baby },
  { id: 'emergency',    label: 'Emergency',     count: 25,  icon: Activity },
  { id: 'surgery',      label: 'Surgery',       count: 35,  icon: Stethoscope },
];

const mockCourses = [
  {
    id: 1,
    title: 'Interventional Cardiology Fellowship',
    category: 'cardiology',
    description: 'Master advanced PCI techniques, structural heart interventions, and hemodynamic support devices.',
    duration: '18 months', modules: 24, students: 2847, rating: 4.9, reviews: 1256, price: 2999,
    level: 'Advanced', icon: Heart,
    accent: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-600',
    instructor: 'Course Instructor', institution: 'Medical Center',
    enrolled: true, progress: 68,
    features: ['VR Surgery Lab', 'AI Tutor', 'Certificate', 'Live Sessions'],
    isPopular: true,
  },
  {
    id: 2,
    title: 'Neurosurgical Oncology',
    category: 'neurology',
    description: 'Awake craniotomy, intraoperative MRI navigation, and stereotactic radiosurgery from world-class neurosurgeons.',
    duration: '24 months', modules: 32, students: 1234, rating: 4.95, reviews: 892, price: 3999,
    level: 'Expert', icon: Brain,
    accent: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    bar: 'bg-gradient-to-r from-indigo-500 to-violet-600',
    instructor: 'Course Instructor', institution: 'Medical Center',
    enrolled: false, progress: 0,
    features: ['VR Surgery Lab', 'AI Tutor', 'Certificate', 'Research Track'],
    isNew: true,
  },
  {
    id: 3,
    title: 'Sports Medicine & Arthroscopy',
    category: 'orthopedics',
    description: 'ACL reconstruction, rotator cuff repair, and cartilage restoration with cutting-edge techniques.',
    duration: '12 months', modules: 18, students: 3456, rating: 4.85, reviews: 1567, price: 2499,
    level: 'Intermediate', icon: Bone,
    accent: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    instructor: 'Course Instructor', institution: 'Medical Center',
    enrolled: true, progress: 45,
    features: ['VR Surgery Lab', 'AI Tutor', 'Certificate'],
  },
  {
    id: 4,
    title: 'Retinal Surgery Excellence',
    category: 'ophthalmology',
    description: 'Vitreoretinal surgery, diabetic retinopathy management, and macular hole repair with microsurgery VR training.',
    duration: '15 months', modules: 20, students: 987, rating: 4.92, reviews: 654, price: 3499,
    level: 'Advanced', icon: Eye,
    accent: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    bar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    instructor: 'Course Instructor', institution: 'Medical Center',
    enrolled: false, progress: 0,
    features: ['VR Microsurgery', 'AI Tutor', 'Certificate', 'Live Cases'],
  },
  {
    id: 5,
    title: 'Pediatric Critical Care',
    category: 'pediatrics',
    description: 'PICU management protocols, pediatric ECMO, and neonatal resuscitation with realistic VR scenarios.',
    duration: '18 months', modules: 22, students: 1567, rating: 4.88, reviews: 789, price: 2799,
    level: 'Advanced', icon: Baby,
    accent: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-green-500',
    instructor: "Course Instructor", institution: "Medical Center",
    enrolled: false, progress: 0,
    features: ['VR Simulations', 'AI Tutor', 'Certificate', 'Mentorship'],
  },
  {
    id: 6,
    title: 'Emergency Medicine Leadership',
    category: 'emergency',
    description: 'Mass casualty management, toxicology emergencies, and trauma team leadership with disaster simulation VR.',
    duration: '12 months', modules: 16, students: 4123, rating: 4.87, reviews: 2134, price: 1999,
    level: 'Intermediate', icon: Activity,
    accent: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    instructor: 'Dr. Robert Kim', institution: 'Johns Hopkins',
    enrolled: false, progress: 0,
    features: ['VR Disaster Sim', 'AI Tutor', 'Certificate'],
    isPopular: true,
  },
];

/* ─── Level badge color ─── */
const levelColor: Record<string, string> = {
  Beginner:     'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  Intermediate: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  Advanced:     'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  Expert:       'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
};

/* ─── Grid Course Card ─── */
function CourseCard({ course, index }: { course: typeof mockCourses[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card-interactive group flex flex-col h-full"
    >
      {/* Card header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl ${course.accent} flex items-center justify-center flex-shrink-0`}>
            <course.icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {course.isPopular && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                Popular
              </span>
            )}
            {course.isNew && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                New
              </span>
            )}
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColor[course.level] ?? 'bg-slate-100 text-slate-500'}`}>
              {course.level}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules} modules</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students.toLocaleString()}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{course.rating}</span>
          <span className="text-xs text-slate-400">({course.reviews.toLocaleString()})</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.features.slice(0, 3).map((f) => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar (if enrolled) */}
      {course.enrolled && (
        <div className="px-5 pb-3">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className={`h-full rounded-full ${course.bar}`} style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      )}

      {/* Instructor + CTA */}
      <div className="mt-auto p-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{course.instructor}</p>
          <p className="text-[10px] text-slate-400 truncate">{course.institution}</p>
        </div>
        {course.enrolled ? (
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex-shrink-0"
          >
            <Play className="w-3 h-3" /> Continue
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition-colors flex-shrink-0"
          >
            Enroll · ${course.price.toLocaleString()}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ─── List Course Row ─── */
function CourseRow({ course, index }: { course: typeof mockCourses[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-interactive p-5 flex items-center gap-4 group"
    >
      <div className={`w-12 h-12 rounded-xl ${course.accent} flex items-center justify-center flex-shrink-0`}>
        <course.icon className="w-5.5 h-5.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
            {course.title}
          </h3>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${levelColor[course.level] ?? ''}`}>
            {course.level}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{course.instructor}</span>
          <span>·</span>
          <span>{course.duration}</span>
          <span>·</span>
          <span>{course.modules} modules</span>
          {course.enrolled && (
            <><span>·</span><span className="text-emerald-600 font-medium">{course.progress}% done</span></>
          )}
        </div>
      </div>

      {/* Progress */}
      {course.enrolled && (
        <div className="hidden sm:block w-28">
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className={`h-full rounded-full ${course.bar}`} style={{ width: `${course.progress}%` }} />
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="hidden md:flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{course.rating}</span>
      </div>

      {/* CTA */}
      {course.enrolled ? (
        <Link href={`/dashboard/courses/${course.id}`} className="flex-shrink-0 btn-primary px-4 py-2 text-xs">
          <Play className="w-3 h-3" /> Resume
        </Link>
      ) : (
        <Link href={`/dashboard/courses/${course.id}`} className="flex-shrink-0 btn-outline px-4 py-2 text-xs">
          ${course.price.toLocaleString()}
        </Link>
      )}
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function CoursesPage() {
  const [category,       setCategory]       = useState('all');
  const [view,           setView]           = useState<'grid'|'list'>('grid');
  const [search,         setSearch]         = useState('');
  const [enrolledOnly,   setEnrolledOnly]   = useState(false);
  const [filterOpen,     setFilterOpen]     = useState(false);

  const { data: coursesData, isLoading } = useCourses({
    category: category !== 'all' ? category : undefined,
    search:   search || undefined,
  });
  const { data: progressData } = useProgress();

  const allCourses = useMemo(() => {
    if (coursesData?.courses?.length) {
      return coursesData.courses.map((c: any, i: number) => ({
        id:          c.id,
        title:       c.title,
        category:    c.category?.toLowerCase() || 'other',
        description: c.shortDescription || c.description,
        duration:    `${Math.ceil(c.duration / 60)} hrs`,
        modules:     12,
        students:    c.enrollmentCount,
        rating:      c.averageRating || 4.8,
        reviews:     Math.floor(c.enrollmentCount * 0.3),
        price:       c.price || 999,
        level:       c.level || 'Intermediate',
        icon:        mockCourses[i % mockCourses.length].icon,
        accent:      mockCourses[i % mockCourses.length].accent,
        bar:         mockCourses[i % mockCourses.length].bar,
        instructor:  c.instructor?.name || 'Expert Instructor',
        institution: c.instructor?.title || '',
        enrolled:    progressData?.enrollments?.some((e: any) => e.courseId === c.id) || false,
        progress:    (progressData?.enrollments?.find((e: any) => e.courseId === c.id) as any)?.progressPercentage || 0,
        features:    ['AI Tutor', 'Certificate', 'HD Video'],
      }));
    }
    return mockCourses;
  }, [coursesData, progressData]);

  const filtered = useMemo(() =>
    allCourses.filter((c) => {
      const matchCat     = category === 'all' || c.category === category;
      const matchSearch  = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
      const matchEnroll  = !enrolledOnly || c.enrolled;
      return matchCat && matchSearch && matchEnroll;
    }),
    [allCourses, category, search, enrolledOnly]
  );

  const enrolledCount = allCourses.filter((c) => c.enrolled).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-slate-900 dark:text-white">
            Course Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {enrolledCount} enrolled · {allCourses.length} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnrolledOnly(!enrolledOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              enrolledOnly
                ? 'bg-primary text-white border-primary'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
            My Courses
          </button>
        </div>
      </div>

      {/* ── Search + controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, specialties…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
              {cat.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                category === cat.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No courses found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          <button onClick={() => { setSearch(''); setCategory('all'); setEnrolledOnly(false); }} className="btn-outline mt-4 text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400">
            Showing {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
          </p>
          {view === 'grid' ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course as any} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((course, i) => (
                <CourseRow key={course.id} course={course as any} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
