'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Brain,
  Clock,
  DollarSign,
  Globe,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from 'lucide-react';

// Time periods
const timePeriods = ['24h', '7d', '30d', '90d', '1y', 'All'];

// Engagement data by hour
const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  users: Math.floor(Math.random() * 1000) + 200,
  sessions: Math.floor(Math.random() * 2000) + 500,
}));

// Daily metrics
const dailyMetrics = [
  { date: 'Mon', users: 3420, sessions: 8450, revenue: 12450, completions: 234 },
  { date: 'Tue', users: 3890, sessions: 9120, revenue: 15670, completions: 287 },
  { date: 'Wed', users: 4120, sessions: 10230, revenue: 18920, completions: 312 },
  { date: 'Thu', users: 3980, sessions: 9870, revenue: 16540, completions: 298 },
  { date: 'Fri', users: 4560, sessions: 11340, revenue: 21230, completions: 345 },
  { date: 'Sat', users: 2890, sessions: 7230, revenue: 9870, completions: 189 },
  { date: 'Sun', users: 2560, sessions: 6450, revenue: 8340, completions: 156 },
];

// Top performing content
const topContent = [
  { name: 'PCI Fundamentals Module', type: 'Lesson', views: 4523, completions: 3456, avgTime: '32m' },
  { name: 'Coronary Anatomy VR', type: 'VR', views: 3890, completions: 2987, avgTime: '45m' },
  { name: 'ECG Interpretation Quiz', type: 'Quiz', views: 3456, completions: 2876, avgTime: '18m' },
  { name: 'Heart Failure Case Study', type: 'Case', views: 3123, completions: 2543, avgTime: '28m' },
  { name: 'TAVR Procedure Simulation', type: 'VR', views: 2987, completions: 2345, avgTime: '52m' },
];

// User retention cohorts
const retentionData = [
  { cohort: 'Week 1', d1: 85, d7: 68, d14: 54, d30: 42, d60: 35, d90: 28 },
  { cohort: 'Week 2', d1: 82, d7: 65, d14: 52, d30: 40, d60: 33, d90: 26 },
  { cohort: 'Week 3', d1: 88, d7: 72, d14: 58, d30: 45, d60: 38, d90: 31 },
  { cohort: 'Week 4', d1: 86, d7: 70, d14: 56, d30: 43, d60: 36, d90: 29 },
];

// Conversion funnel
const funnelData = [
  { stage: 'Visitors', count: 45000, percentage: 100 },
  { stage: 'Sign Ups', count: 12450, percentage: 27.7 },
  { stage: 'Enrolled', count: 8920, percentage: 19.8 },
  { stage: 'Active Learners', count: 5670, percentage: 12.6 },
  { stage: 'Completed Course', count: 2340, percentage: 5.2 },
  { stage: 'Certified', count: 1890, percentage: 4.2 },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-purple-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Platform performance metrics and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg">
            {timePeriods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  selectedPeriod === period
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: '$345,670',
            change: '+23.4%',
            positive: true,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500',
            detail: 'vs last period',
          },
          {
            label: 'Active Users',
            value: '12,340',
            change: '+12.5%',
            positive: true,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            detail: 'Daily active users',
          },
          {
            label: 'Course Completions',
            value: '1,821',
            change: '+8.2%',
            positive: true,
            icon: Award,
            color: 'from-purple-500 to-pink-500',
            detail: 'This month',
          },
          {
            label: 'Avg. Session Time',
            value: '42m 18s',
            change: '-2.3%',
            positive: false,
            icon: Clock,
            color: 'from-orange-500 to-red-500',
            detail: 'Per user',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                metric.positive ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.label}</div>
            <div className="text-xs text-gray-600 mt-1">{metric.detail}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Metrics Chart */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Daily Overview</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-400">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-400">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {dailyMetrics.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.users / 5000) * 100}%` }}
                    className="w-full bg-blue-500/50 rounded-t"
                    style={{ height: `${(day.users / 5000) * 150}px` }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.revenue / 25000) * 100}%` }}
                    className="w-full bg-green-500/50 rounded-t"
                    style={{ height: `${(day.revenue / 25000) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold mb-6">Conversion Funnel</h2>
          <div className="space-y-3">
            {funnelData.map((stage, index) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{stage.stage}</span>
                  <span className="text-gray-400">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="h-8 bg-gray-50 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-end pr-2"
                  >
                    {stage.percentage > 10 && (
                      <span className="text-xs text-white font-medium">{stage.percentage}%</span>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Content */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold mb-4">Top Performing Content</h2>
          <div className="space-y-3">
            {topContent.map((content, index) => (
              <div key={content.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{content.name}</div>
                  <div className="text-xs text-gray-500">{content.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3 text-gray-400" />
                    {content.views.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{content.avgTime} avg</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Heatmap */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold mb-4">User Retention</h2>
          <div className="space-y-2">
            <div className="flex text-xs text-gray-500">
              <div className="w-16" />
              <div className="flex-1 grid grid-cols-6 gap-1 text-center">
                <span>D1</span>
                <span>D7</span>
                <span>D14</span>
                <span>D30</span>
                <span>D60</span>
                <span>D90</span>
              </div>
            </div>
            {retentionData.map((row) => (
              <div key={row.cohort} className="flex items-center">
                <div className="w-16 text-xs text-gray-500">{row.cohort}</div>
                <div className="flex-1 grid grid-cols-6 gap-1">
                  {[row.d1, row.d7, row.d14, row.d30, row.d60, row.d90].map((value, i) => (
                    <div
                      key={i}
                      className="h-8 rounded flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(168, 85, 247, ${value / 100})`,
                        color: value > 50 ? 'white' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {value}%
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Activity */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h2 className="font-semibold mb-6">Hourly Activity (UTC)</h2>
        <div className="h-32 flex items-end gap-1">
          {hourlyData.map((hour) => (
            <div key={hour.hour} className="flex-1 group relative">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(hour.users / 1200) * 100}%` }}
                className="w-full bg-gradient-to-t from-blue-500/50 to-cyan-500/50 rounded-t cursor-pointer hover:from-blue-500 hover:to-cyan-500 transition-colors"
                style={{ height: `${(hour.users / 1200) * 100}px` }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {hour.hour}:00 - {hour.users} users
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>
    </div>
  );
}

