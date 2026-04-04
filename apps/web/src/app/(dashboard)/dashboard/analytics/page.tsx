'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Brain,
  Target,
  Zap,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  Flame,
  Users,
  Trophy,
} from 'lucide-react';

// Mock chart data
const learningHoursData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.1 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 1.5 },
  { day: 'Sun', hours: 2.8 },
];

const performanceData = [
  { topic: 'Coronary Anatomy', score: 95, change: 5 },
  { topic: 'ECG Interpretation', score: 88, change: 3 },
  { topic: 'PCI Techniques', score: 76, change: -2 },
  { topic: 'Hemodynamics', score: 82, change: 8 },
  { topic: 'Arrhythmias', score: 71, change: 5 },
];

const weeklyStats = [
  { label: 'Learning Hours', value: '17.9h', change: '+23%', positive: true, icon: Clock },
  { label: 'Lessons Completed', value: '12', change: '+4', positive: true, icon: BookOpen },
  { label: 'Quiz Average', value: '88%', change: '+5%', positive: true, icon: Target },
  { label: 'XP Earned', value: '1,850', change: '+15%', positive: true, icon: Zap },
];

const skillProgress = [
  { skill: 'Clinical Knowledge', current: 78, previous: 72 },
  { skill: 'Procedural Skills', current: 65, previous: 58 },
  { skill: 'Diagnostic Reasoning', current: 82, previous: 80 },
  { skill: 'Patient Communication', current: 71, previous: 65 },
  { skill: 'Research Methodology', current: 45, previous: 40 },
];

const activityLog = [
  { action: 'Completed lesson', item: 'Rotational Atherectomy', xp: 150, time: '2 hours ago' },
  { action: 'Passed quiz', item: 'Complex PCI Assessment', xp: 200, score: 92, time: '5 hours ago' },
  { action: 'VR surgery', item: 'Balloon Angioplasty', xp: 300, grade: 'A', time: 'Yesterday' },
  { action: 'Asked Dr. Nexus', item: 'CTO Techniques', xp: 25, time: 'Yesterday' },
  { action: 'Earned badge', item: '7-Day Streak', xp: 500, time: '2 days ago' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');
  const maxHours = Math.max(...learningHoursData.map((d) => d.hours));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-ibmp-500" />
            Learning Analytics
          </h1>
          <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-border bg-card text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-outline flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {weeklyStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-elevated p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-ibmp-500/10 flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-ibmp-500" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-health-500' : 'text-critical-500'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Hours Chart */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-ibmp-500" />
              Learning Hours
            </h2>
            <div className="text-sm text-muted-foreground">
              Total: <span className="font-semibold text-foreground">17.9 hours</span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {learningHoursData.map((data, index) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.hours / maxHours) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-ibmp-500 to-ibmp-400 relative group cursor-pointer hover:from-ibmp-600 hover:to-ibmp-500 transition-colors"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.hours}h
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Ranking */}
        <div className="space-y-6">
          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-critical-500" />
              Learning Streak
            </h2>
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-critical-500 mb-2">7</div>
              <div className="text-muted-foreground mb-4">days in a row</div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      day <= 7
                        ? 'bg-critical-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][day - 1]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Personal best: <span className="font-semibold text-foreground">21 days</span>
              </p>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-achievement-500" />
              Global Ranking
            </h2>
            <div className="text-center">
              <div className="text-4xl font-display font-bold gradient-text mb-2">#127</div>
              <div className="text-muted-foreground mb-2">out of 52,847 learners</div>
              <div className="flex items-center justify-center gap-1 text-health-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>Up 23 places this week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topic Performance */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-neural-500" />
            Topic Performance
          </h2>
          <div className="space-y-4">
            {performanceData.map((topic) => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{topic.score}%</span>
                    <span className={`text-xs flex items-center ${
                      topic.change >= 0 ? 'text-health-500' : 'text-critical-500'
                    }`}>
                      {topic.change >= 0 ? '+' : ''}{topic.change}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.score}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      topic.score >= 90 ? 'bg-health-500' :
                      topic.score >= 70 ? 'bg-ibmp-500' :
                      'bg-achievement-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Radar */}
        <div className="card-elevated p-6">
          <h2 className="font-semibold mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-bio-500" />
            Skill Development
          </h2>
          <div className="space-y-4">
            {skillProgress.map((skill) => {
              const improvement = skill.current - skill.previous;
              return (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{skill.previous}%</span>
                      <span className="text-sm font-semibold">{skill.current}%</span>
                      <span className={`text-xs ${improvement >= 0 ? 'text-health-500' : 'text-critical-500'}`}>
                        {improvement >= 0 ? '+' : ''}{improvement}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className="absolute h-full bg-muted-foreground/30 rounded-full"
                      style={{ width: `${skill.previous}%` }}
                    />
                    <motion.div
                      initial={{ width: `${skill.previous}%` }}
                      animate={{ width: `${skill.current}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute h-full bg-bio-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Compared to last month
          </p>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-achievement-500" />
            Recent Activity
          </h2>
          <button className="text-sm text-primary hover:underline">View all</button>
        </div>
        <div className="space-y-4">
          {activityLog.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                activity.action.includes('lesson') ? 'bg-ibmp-500/10' :
                activity.action.includes('quiz') ? 'bg-health-500/10' :
                activity.action.includes('VR') ? 'bg-neural-500/10' :
                activity.action.includes('badge') ? 'bg-achievement-500/10' :
                'bg-bio-500/10'
              }`}>
                {activity.action.includes('lesson') ? <BookOpen className="w-5 h-5 text-ibmp-500" /> :
                 activity.action.includes('quiz') ? <Target className="w-5 h-5 text-health-500" /> :
                 activity.action.includes('VR') ? <Brain className="w-5 h-5 text-neural-500" /> :
                 activity.action.includes('badge') ? <Award className="w-5 h-5 text-achievement-500" /> :
                 <Brain className="w-5 h-5 text-bio-500" />}
              </div>
              <div className="flex-1">
                <div className="font-medium">{activity.item}</div>
                <div className="text-sm text-muted-foreground">{activity.action}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-achievement-500">+{activity.xp} XP</div>
                {activity.score && (
                  <div className="text-xs text-muted-foreground">Score: {activity.score}%</div>
                )}
                {activity.grade && (
                  <div className="text-xs text-muted-foreground">Grade: {activity.grade}</div>
                )}
              </div>
              <div className="text-xs text-muted-foreground w-24 text-right">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card-elevated p-6 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Dr. Nexus Insights</h3>
            <p className="text-muted-foreground mb-4">
              Based on your learning patterns, I notice you perform best in the morning hours. 
              Your PCI Techniques score dropped slightly - consider reviewing Module 4.3 on Complex Lesions. 
              Your 7-day streak is impressive! You're on track to earn the "Unstoppable" badge in 7 more days.
            </p>
            <button className="btn-secondary text-sm py-2">
              Get Personalized Study Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

