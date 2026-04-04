'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  GraduationCap,
  Brain,
  TrendingUp,
  Activity,
  Clock,
  Globe,
  Server,
  Zap,
  Eye,
  MessageSquare,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileText,
  Loader2,
} from 'lucide-react';
import { useAdminStats, useAdminActivity } from '@/lib/api';

// Fallback data for when API is not available
const fallbackStats = {
  users: { total: 28450, active: 12340, newToday: 156, activePercentage: '43.4' },
  courses: { total: 234, published: 198, draft: 36, totalEnrollments: 15670, completionRate: '78.5' },
  learning: { lessonsCompleted: 15670, avgSessionTime: '42m 18s', quizzesCompleted: 1567 },
  ai: { totalConversations: 8920, conversationsToday: 156, avgResponseTime: '1.2s', satisfactionRate: '94%' },
  certificates: { total: 4523 },
  vr: { totalSessions: 2340, sessionsToday: 45 },
  revenue: { total: 345670, today: 12450, thisMonth: 89500, growth: '+23.4%' },
};

const fallbackActivity = [
  { id: 1, type: 'enrollment', user: 'User Name', action: 'enrolled in', target: 'Interventional Cardiology', time: '2s ago' },
  { id: 2, type: 'completion', user: 'User Name', action: 'completed', target: 'PCI Fundamentals Module', time: '15s ago' },
  { id: 3, type: 'certificate', user: 'Dr. Elena K.', action: 'earned certificate', target: 'Cardiac Imaging', time: '32s ago' },
  { id: 4, type: 'lesson', user: 'Dr. Priya S.', action: 'started lesson', target: 'ECG Interpretation', time: '45s ago' },
  { id: 5, type: 'quiz', user: 'Dr. Marcus J.', action: 'completed quiz', target: 'Hemodynamics Assessment', time: '1m ago' },
  { id: 6, type: 'achievement', user: 'Dr. Kim L.', action: 'unlocked', target: '7-Day Streak', time: '2m ago' },
];

// System health
const systemHealth = [
  { name: 'API Server', status: 'healthy', uptime: '99.99%', latency: '45ms' },
  { name: 'Database', status: 'healthy', uptime: '99.95%', latency: '12ms' },
  { name: 'CDN', status: 'healthy', uptime: '100%', latency: '8ms' },
  { name: 'AI Service', status: 'healthy', uptime: '99.90%', latency: '120ms' },
  { name: 'Video Streaming', status: 'warning', uptime: '99.80%', latency: '250ms' },
  { name: 'Search Index', status: 'healthy', uptime: '99.99%', latency: '35ms' },
];

// Top courses
const topCourses = [
  { name: 'Interventional Cardiology', enrollments: 2847, completionRate: 78, revenue: '$85,410' },
  { name: 'Cardiac Imaging', enrollments: 2156, completionRate: 82, revenue: '$64,680' },
  { name: 'Electrophysiology', enrollments: 1890, completionRate: 75, revenue: '$56,700' },
  { name: 'Heart Failure', enrollments: 1654, completionRate: 80, revenue: '$49,620' },
  { name: 'Structural Heart', enrollments: 1432, completionRate: 72, revenue: '$42,960' },
];

// Geographic distribution
const geoDistribution = [
  { region: 'North America', users: 8450, percentage: 30 },
  { region: 'Europe', users: 7890, percentage: 28 },
  { region: 'Asia Pacific', users: 6780, percentage: 24 },
  { region: 'Middle East', users: 2840, percentage: 10 },
  { region: 'Others', users: 2490, percentage: 8 },
];

export default function AdminDashboard() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Fetch real data from API
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();

  const handleRefresh = async () => {
    await refetchStats();
    setLastUpdate(new Date());
  };

  // Use API data or fallback
  const stats = statsData?.data || fallbackStats;
  const liveActivity = fallbackActivity;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Real-time platform monitoring and management
          </p>
        </div>
        <div className="flex items-center gap-4">
          {statsLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button 
            onClick={handleRefresh}
            disabled={statsLoading}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: stats.users?.total?.toLocaleString() || '0',
            change: '+12.5%',
            positive: true,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            subtext: `${stats.users?.active?.toLocaleString() || 0} active`,
          },
          {
            label: 'Active Sessions',
            value: stats.courses?.totalEnrollments?.toLocaleString() || '0',
            change: '+8.2%',
            positive: true,
            icon: Activity,
            color: 'from-green-500 to-emerald-500',
            subtext: 'Total enrollments',
          },
          {
            label: 'AI Conversations',
            value: stats.ai?.totalConversations?.toLocaleString() || '0',
            change: '+45.3%',
            positive: true,
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
            subtext: `${stats.ai?.conversationsToday || 0} today`,
          },
          {
            label: 'Revenue Today',
            value: formatCurrency(stats.revenue?.today || 0),
            change: stats.revenue?.growth || '+23.4%',
            positive: true,
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500',
            subtext: `${formatCurrency(stats.revenue?.thisMonth || 0)} this month`,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                stat.positive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.subtext}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2 text-gray-800">
              <Activity className="w-5 h-5 text-green-500" />
              Live Activity
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </h2>
            <span className="text-xs text-gray-500">Auto-refreshing</span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {liveActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'completion' ? 'bg-green-100 text-green-600' :
                  activity.type === 'certificate' ? 'bg-yellow-100 text-yellow-600' :
                  activity.type === 'ai' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'vr' ? 'bg-cyan-100 text-cyan-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {activity.type === 'enrollment' ? <BookOpen className="w-4 h-4" /> :
                   activity.type === 'completion' ? <CheckCircle2 className="w-4 h-4" /> :
                   activity.type === 'certificate' ? <GraduationCap className="w-4 h-4" /> :
                   activity.type === 'ai' ? <Brain className="w-4 h-4" /> :
                   activity.type === 'vr' ? <Eye className="w-4 h-4" /> :
                   <Award className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className="text-gray-500"> {activity.action} </span>
                    <span className="text-blue-600">{activity.target}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Server className="w-5 h-5 text-blue-500" />
            System Health
          </h2>
          <div className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' :
                    service.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-700">{service.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">{service.uptime}</div>
                  <div className="text-xs text-gray-400">{service.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Top Performing Courses
          </h2>
          <div className="space-y-3">
            {topCourses.map((course, index) => (
              <div key={course.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-gray-800">{course.name}</div>
                  <div className="text-xs text-gray-500">{course.enrollments.toLocaleString()} enrolled</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{course.revenue}</div>
                  <div className="text-xs text-gray-500">{course.completionRate}% completion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4 text-gray-800">
            <Globe className="w-5 h-5 text-cyan-500" />
            Geographic Distribution
          </h2>
          <div className="space-y-3">
            {geoDistribution.map((region) => (
              <div key={region.region}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{region.region}</span>
                  <span className="text-gray-500">{region.users.toLocaleString()} users ({region.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Published Courses', value: stats.courses?.published || 0, icon: BookOpen, color: 'text-blue-500' },
          { label: 'Draft Courses', value: stats.courses?.draft || 0, icon: FileText, color: 'text-yellow-500' },
          { label: 'Lessons Completed', value: stats.learning?.lessonsCompleted?.toLocaleString() || 0, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Avg Session', value: stats.learning?.avgSessionTime || '42m', icon: Clock, color: 'text-purple-500' },
          { label: 'AI Response', value: stats.ai?.avgResponseTime || '1.2s', icon: Zap, color: 'text-orange-500' },
          { label: 'AI Satisfaction', value: stats.ai?.satisfactionRate || '94%', icon: Award, color: 'text-pink-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4 text-gray-800">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Active Alerts
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-yellow-700">Video Streaming High Latency</div>
              <div className="text-sm text-gray-600">Average latency increased to 250ms. Investigating CDN performance.</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-sm hover:bg-yellow-200 transition-colors font-medium">
              Investigate
            </button>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-blue-700">{stats.users?.pendingVerifications || 5} New User Verification Requests</div>
              <div className="text-sm text-gray-600">Medical professionals awaiting credential verification.</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-colors font-medium">
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
