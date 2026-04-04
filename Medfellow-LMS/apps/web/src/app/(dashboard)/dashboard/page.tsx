'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  Trophy,
  Target,
  Flame,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Heart,
  Activity,
  Loader2,
} from 'lucide-react';
import { useUser, useProgress, useAchievements } from '@/lib/api';

/* ─── Mock data (fallback) ─── */
const currentCourses = [
  {
    id: 1,
    title: 'Interventional Cardiology Fellowship',
    progress: 68,
    totalModules: 24,
    completedModules: 16,
    nextLesson: 'Coronary Stent Placement Techniques',
    timeRemaining: '4h 30m',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-rose-600',
    icon: Heart,
  },
  {
    id: 2,
    title: 'Advanced Cardiac Imaging',
    progress: 45,
    totalModules: 18,
    completedModules: 8,
    nextLesson: 'Echocardiography Interpretation',
    timeRemaining: '2h 15m',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-600',
    icon: Activity,
  },
];

const recentActivity = [
  { type: 'lesson',      title: 'Completed: PCI Fundamentals',          time: '2 hours ago',  xp: 150 },
  { type: 'quiz',        title: 'Scored 92% on Hemodynamics Quiz',       time: '4 hours ago',  xp: 200 },
  { type: 'achievement', title: 'Unlocked: 7-Day Streak Badge',          time: 'Yesterday',    xp: 500 },
];

const weeklyGoals = [
  { label: 'Study Hours', current: 12, target: 15, unit: 'hrs' },
  { label: 'Lessons',     current: 8,  target: 10, unit: '' },
  { label: 'Quiz Score',  current: 88, target: 85,  unit: '%' },
  { label: 'Modules',     current: 2,  target: 3,  unit: '' },
];

const upcomingEvents = [
  { title: 'Live Lecture: Complex PCI Cases',   date: 'Today, 3:00 PM',     type: 'live',  instructor: 'User Name' },
  { title: 'Study Group: Cardiology Fellows',   date: 'Tomorrow, 5:00 PM',  type: 'group' },
  { title: 'Certification Exam Practice',       date: 'Friday, 10:00 AM',   type: 'exam' },
];

const leaderboard = [
  { rank: 1, name: 'User Name',    xp: 15420, change:  2 },
  { rank: 2, name: 'Dr. Marcus Johnson',  xp: 14890, change:  0 },
  { rank: 3, name: 'You',                 xp: 14350, change:  1, isUser: true },
  { rank: 4, name: 'User Name',  xp: 13980, change: -2 },
  { rank: 5, name: 'Dr. Takeshi Yamamoto',xp: 13450, change:  0 },
];

/* ─── Activity icon helper ─── */
function ActivityIcon({ type }: { type: string }) {
  if (type === 'lesson')
    return <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center"><BookOpen className="w-4 h-4 text-teal-600" /></div>;
  if (type === 'quiz')
    return <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>;
  return <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center"><Trophy className="w-4 h-4 text-amber-500" /></div>;
}

/* ─── Circular goal ring ─── */
function GoalRing({ current, target, label, unit, isComplete }: {
  current: number; target: number; label: string; unit: string; isComplete: boolean;
}) {
  const pct   = Math.min((current / target) * 100, 100);
  const r     = 34;
  const circ  = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className={isComplete ? 'text-emerald-500' : 'text-teal-500'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete
            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            : <span className="text-sm font-bold">{current}</span>}
        </div>
      </div>
      <p className="text-xs font-medium text-center text-slate-700 dark:text-slate-200">{label}</p>
      <p className="text-[10px] text-slate-400">{current}/{target}{unit}</p>
    </div>
  );
}

/* ─── Main dashboard ─── */
export default function DashboardPage() {
  const [period, setPeriod] = useState<'week'|'month'>('week');

  const { data: userData,    isLoading: userLoading }    = useUser();
  const { data: progressData }                           = useProgress();
  const { data: achievementData }                        = useAchievements();

  const user       = userData?.user;
  const userStats  = userData?.stats;
  const userName   = user?.firstName || 'Doctor';
  const streak     = user?.streak    || 7;
  const level      = user?.level     || 1;
  const xp         = user?.xp        || 0;
  const rank       = userStats?.rank || 'Intern';

  const statsCards = [
    { label: 'Total XP',    value: xp.toLocaleString(),                               icon: Zap,     bg: 'bg-amber-50 dark:bg-amber-900/20',  iconColor: 'text-amber-500',  sub: `Level ${level}` },
    { label: 'Courses',     value: String(progressData?.stats?.totalCourses    || 0), icon: BookOpen,bg: 'bg-teal-50 dark:bg-teal-900/20',   iconColor: 'text-teal-600',   sub: `${progressData?.stats?.inProgressCourses || 0} in progress` },
    { label: 'Certificates',value: String(progressData?.stats?.completedCourses|| 0), icon: Award,   bg: 'bg-violet-50 dark:bg-violet-900/20',iconColor: 'text-violet-600', sub: 'Earned' },
    { label: 'Rank',        value: rank,                                               icon: Trophy,  bg: 'bg-emerald-50 dark:bg-emerald-900/20',iconColor:'text-emerald-600',sub: `Level ${level}` },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ─── Welcome header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl lg:text-2xl font-display font-bold text-slate-900 dark:text-white"
          >
            {userLoading ? (
              <span className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</span>
            ) : (
              <>Welcome back, <span className="gradient-text">Dr. {userName}</span> 👋</>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            {streak}-day streak · keep it up!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link href="/dashboard/courses" className="btn-primary px-5 py-2.5">
            <Play className="w-3.5 h-3.5" />
            Continue Learning
          </Link>
        </motion.div>
      </div>

      {/* ─── Stats strip ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-interactive p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-tight">{s.sub}</span>
            </div>
            <p className="text-xl font-display font-bold text-slate-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Main 2-col grid ─── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: courses + goals */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Continue Learning
              </h2>
              <Link href="/dashboard/courses" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {currentCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="card-interactive p-5 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Course icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradientFrom} ${course.gradientTo} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <course.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1 truncate group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        Next: {course.nextLesson}
                      </p>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${course.gradientFrom} ${course.gradientTo}`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{course.completedModules}/{course.totalModules} modules</span>
                          <span>{course.progress}% complete</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {course.timeRemaining}
                      </div>
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all"
                      >
                        <Play className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly goals */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Weekly Goals
              </h2>
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                {(['week','month'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 text-xs rounded-md capitalize transition-all font-medium ${
                      period === p
                        ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {weeklyGoals.map((g) => (
                <GoalRing
                  key={g.label}
                  current={g.current}
                  target={g.target}
                  label={g.label}
                  unit={g.unit}
                  isComplete={g.current >= g.target}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Study tips banner */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">Study Tip</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                Complete one module at a time for better retention and consistent progress.
              </p>
              <Link
                href="/dashboard/courses"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-teal-700 font-semibold text-xs hover:bg-white/90 transition-colors"
              >
                Browse Courses
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          {/* Upcoming events */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Upcoming
              </h2>
              <Link href="/dashboard/events" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    e.type === 'live'  ? 'bg-rose-500 animate-pulse' :
                    e.type === 'group' ? 'bg-teal-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">{e.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{e.date}</p>
                    {e.instructor && <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">{e.instructor}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Leaderboard
              </h2>
              <span className="text-[10px] text-slate-400">This Week</span>
            </div>
            <div className="space-y-1.5">
              {leaderboard.map((u) => (
                <div
                  key={u.rank}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    u.isUser
                      ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    u.rank === 1 ? 'bg-amber-400 text-white' :
                    u.rank === 2 ? 'bg-slate-400 text-white' :
                    u.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {u.rank}
                  </div>
                  <p className={`flex-1 text-xs font-medium truncate ${u.isUser ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {u.name}
                  </p>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{u.xp.toLocaleString()}</span>
                  <span className={`text-[10px] font-medium w-5 text-right ${
                    u.change > 0 ? 'text-emerald-500' :
                    u.change < 0 ? 'text-rose-500' :
                    'text-slate-400'
                  }`}>
                    {u.change > 0 ? `↑${u.change}` : u.change < 0 ? `↓${Math.abs(u.change)}` : '–'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-500" />
                Recent Activity
              </h2>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ActivityIcon type={a.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-100 leading-snug">{a.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                      <span>{a.time}</span>
                      <span>·</span>
                      <span className="text-amber-500 font-semibold">+{a.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
