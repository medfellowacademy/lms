'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  BookOpen,
  Brain,
  Award,
  Eye,
  MessageSquare,
  Play,
  Pause,
  Filter,
  Search,
  Globe,
  Clock,
  TrendingUp,
  LogIn,
  LogOut,
  GraduationCap,
  Video,
  FileText,
  Heart,
  Share2,
  Download,
  Zap,
} from 'lucide-react';

// Activity types configuration
const activityTypes = {
  login: { icon: LogIn, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Login' },
  logout: { icon: LogOut, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Logout' },
  enrollment: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Enrollment' },
  lesson_start: { icon: Play, color: 'text-cyan-400', bg: 'bg-cyan-500/20', label: 'Lesson Start' },
  lesson_complete: { icon: GraduationCap, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Lesson Complete' },
  ai_chat: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'AI Chat' },
  vr_session: { icon: Eye, color: 'text-pink-400', bg: 'bg-pink-500/20', label: 'VR Session' },
  quiz_complete: { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Quiz Complete' },
  achievement: { icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Achievement' },
  certificate: { icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Certificate' },
  post: { icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/20', label: 'Post' },
  like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Like' },
  share: { icon: Share2, color: 'text-teal-400', bg: 'bg-teal-500/20', label: 'Share' },
};

// Generate mock activities
const generateActivity = (id: number) => {
  const types = Object.keys(activityTypes) as Array<keyof typeof activityTypes>;
  const type = types[Math.floor(Math.random() * types.length)];
  const users = [
    'User Name', 'User Name', 'Dr. Elena K.', 'User Name',
    'Dr. Marcus J.', 'Dr. Yuki Tanaka', 'Dr. Ahmed Hassan', 'Dr. Maria Garcia',
  ];
  const courses = [
    'Interventional Cardiology', 'Cardiac Imaging', 'Electrophysiology',
    'Heart Failure', 'Structural Heart', 'PCI Fundamentals',
  ];
  const countries = ['USA', 'Germany', 'India', 'Japan', 'UK', 'Canada', 'Australia'];

  return {
    id,
    type,
    user: users[Math.floor(Math.random() * users.length)],
    details: type === 'enrollment' ? `Enrolled in ${courses[Math.floor(Math.random() * courses.length)]}` :
             type === 'lesson_complete' ? `Completed lesson in ${courses[Math.floor(Math.random() * courses.length)]}` :
             type === 'ai_chat' ? 'Started conversation with Dr. Nexus' :
             type === 'vr_session' ? 'Entered VR Surgery Lab' :
             type === 'achievement' ? 'Unlocked "7-Day Streak" achievement' :
             type === 'certificate' ? 'Earned certificate in Cardiology' :
             `${type.replace('_', ' ')} activity`,
    country: countries[Math.floor(Math.random() * countries.length)],
    timestamp: new Date(Date.now() - Math.random() * 60000),
  };
};

// Initial activities
const initialActivities = Array.from({ length: 20 }, (_, i) => generateActivity(i));

export default function ActivityPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate real-time updates
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity(Date.now());
        return [newActivity, ...prev.slice(0, 49)];
      });
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          activity.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    activeUsers: 342,
    activeSessions: 1256,
    eventsToday: 15670,
    peakUsers: 456,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Activity className="w-7 h-7 text-green-400" />
            Live Activity
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 text-sm">
            Real-time platform activity and user actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              isPaused
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users Now', value: stats.activeUsers, icon: Users, color: 'text-green-400', live: true },
          { label: 'Active Sessions', value: stats.activeSessions.toLocaleString(), icon: Activity, color: 'text-blue-400' },
          { label: 'Events Today', value: stats.eventsToday.toLocaleString(), icon: Zap, color: 'text-purple-400' },
          { label: 'Peak Users (24h)', value: stats.peakUsers, icon: TrendingUp, color: 'text-orange-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.live && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All Activities</option>
          {Object.entries(activityTypes).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Activity Feed */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 shadow-sm flex items-center justify-between">
          <h2 className="font-semibold">Activity Stream</h2>
          <span className="text-xs text-gray-500">{filteredActivities.length} events</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {filteredActivities.map((activity) => {
              const config = activityTypes[activity.type as keyof typeof activityTypes];
              const Icon = config?.icon || Activity;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="border-b border-gray-200 shadow-sm last:border-0"
                >
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config?.bg}`}>
                      <Icon className={`w-5 h-5 ${config?.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${config?.bg} ${config?.color}`}>
                          {config?.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">{activity.details}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Globe className="w-3 h-3" />
                        {activity.country}
                      </div>
                      <div className="text-xs text-gray-600">
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity by Type */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold mb-4">Activity by Type</h2>
          <div className="space-y-3">
            {Object.entries(activityTypes).slice(0, 8).map(([key, config]) => {
              const count = activities.filter(a => a.type === key).length;
              const percentage = (count / activities.length) * 100;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <config.icon className={`w-4 h-4 ${config.color}`} />
                      <span>{config.label}</span>
                    </div>
                    <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${config.bg.replace('/20', '')}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold mb-4">Geographic Distribution</h2>
          <div className="space-y-3">
            {['USA', 'Germany', 'India', 'Japan', 'UK', 'Canada', 'Australia'].map((country) => {
              const count = activities.filter(a => a.country === country).length;
              const percentage = (count / activities.length) * 100;
              return (
                <div key={country}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span>{country}</span>
                    </div>
                    <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

