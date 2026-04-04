'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Activity,
  Clock,
  Zap,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Settings,
  RefreshCw,
  Server,
  Database,
  Cpu,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Calendar,
} from 'lucide-react';

// AI performance metrics
const aiMetrics = {
  totalConversations: 156780,
  activeNow: 342,
  avgResponseTime: '1.2s',
  satisfactionRate: 94.2,
  tokensUsed: '45.6M',
  costToday: '$234.56',
  errorRate: 0.3,
  modelVersion: 'GPT-4-Turbo + Claude 3',
};

// Real-time conversations
const liveConversations = [
  { id: 1, user: 'User Name', topic: 'PCI complications', model: 'GPT-4', duration: '5m 23s', messages: 12, status: 'active' },
  { id: 2, user: 'Dr. James M.', topic: 'ECG interpretation', model: 'Claude 3', duration: '3m 45s', messages: 8, status: 'active' },
  { id: 3, user: 'Dr. Elena K.', topic: 'Heart failure management', model: 'GPT-4', duration: '8m 12s', messages: 15, status: 'active' },
  { id: 4, user: 'Dr. Priya S.', topic: 'Electrophysiology basics', model: 'Claude 3', duration: '2m 30s', messages: 6, status: 'active' },
  { id: 5, user: 'Dr. Marcus J.', topic: 'TAVR procedure', model: 'GPT-4', duration: '12m 05s', messages: 24, status: 'idle' },
];

// Model performance comparison
const modelComparison = [
  { model: 'GPT-4-Turbo', usage: 65, satisfaction: 95.2, avgTokens: 850, cost: '$156.78' },
  { model: 'Claude 3 Opus', usage: 25, satisfaction: 93.8, avgTokens: 720, cost: '$67.34' },
  { model: 'Claude 3 Sonnet', usage: 10, satisfaction: 91.5, avgTokens: 580, cost: '$10.44' },
];

// Recent issues
const recentIssues = [
  { id: 1, type: 'error', message: 'API timeout on complex query', model: 'GPT-4', time: '15m ago', resolved: true },
  { id: 2, type: 'warning', message: 'High latency detected', model: 'Claude 3', time: '32m ago', resolved: true },
  { id: 3, type: 'error', message: 'Rate limit exceeded', model: 'GPT-4', time: '1h ago', resolved: true },
  { id: 4, type: 'warning', message: 'Low satisfaction score', model: 'Claude 3', time: '2h ago', resolved: false },
];

// Topic distribution
const topicDistribution = [
  { topic: 'Interventional Cardiology', conversations: 4523, percentage: 28 },
  { topic: 'ECG & Electrophysiology', conversations: 3890, percentage: 24 },
  { topic: 'Cardiac Imaging', conversations: 2876, percentage: 18 },
  { topic: 'Heart Failure', conversations: 2345, percentage: 15 },
  { topic: 'Structural Heart', conversations: 1234, percentage: 8 },
  { topic: 'General Questions', conversations: 1132, percentage: 7 },
];

export default function AITutorMonitorPage() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-400" />
            AI Tutor Monitor
          </h1>
          <p className="text-gray-500 text-sm">
            Real-time AI performance monitoring and conversation analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">{aiMetrics.activeNow} Active Conversations</span>
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }}
            className={`p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-sm flex items-center gap-2 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversations', value: (aiMetrics.totalConversations / 1000).toFixed(1) + 'K', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
          { label: 'Avg Response Time', value: aiMetrics.avgResponseTime, icon: Clock, color: 'from-green-500 to-emerald-500' },
          { label: 'Satisfaction Rate', value: aiMetrics.satisfactionRate + '%', icon: ThumbsUp, color: 'from-purple-500 to-pink-500' },
          { label: 'Cost Today', value: aiMetrics.costToday, icon: Zap, color: 'from-orange-500 to-red-500' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-3`}>
              <metric.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Conversations */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Live Conversations
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </h2>
          </div>
          <div className="space-y-3">
            {liveConversations.map((conv) => (
              <div key={conv.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{conv.user}</div>
                  <div className="text-xs text-gray-500">{conv.topic}</div>
                </div>
                <div className="text-xs text-gray-400">{conv.model}</div>
                <div className="text-xs text-gray-400">{conv.messages} msgs</div>
                <div className="text-xs text-gray-500">{conv.duration}</div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-blue-400" />
            System Status
          </h2>
          <div className="space-y-4">
            {[
              { name: 'OpenAI API', status: 'healthy', latency: '120ms' },
              { name: 'Anthropic API', status: 'healthy', latency: '95ms' },
              { name: 'Vector Database', status: 'healthy', latency: '15ms' },
              { name: 'Cache Layer', status: 'healthy', latency: '5ms' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm">{service.name}</span>
                </div>
                <span className="text-xs text-gray-400">{service.latency}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-xs text-gray-500 mb-2">Current Model</div>
            <div className="text-sm font-medium">{aiMetrics.modelVersion}</div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">Tokens Used Today</div>
            <div className="text-sm font-medium">{aiMetrics.tokensUsed}</div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">Error Rate</div>
            <div className="text-sm font-medium text-green-400">{aiMetrics.errorRate}%</div>
          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Comparison */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Model Performance
          </h2>
          <div className="space-y-4">
            {modelComparison.map((model) => (
              <div key={model.model} className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{model.model}</span>
                  <span className="text-xs text-gray-400">{model.usage}% usage</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${model.usage}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Satisfaction: {model.satisfaction}%</span>
                  <span>Avg Tokens: {model.avgTokens}</span>
                  <span>Cost: {model.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Topic Distribution
          </h2>
          <div className="space-y-3">
            {topicDistribution.map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{topic.topic}</span>
                  <span className="text-gray-400">{topic.conversations.toLocaleString()} ({topic.percentage}%)</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.percentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Recent Issues
        </h2>
        <div className="space-y-3">
          {recentIssues.map((issue) => (
            <div key={issue.id} className={`flex items-center gap-4 p-4 rounded-lg ${
              issue.type === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'
            }`}>
              {issue.type === 'error' ? (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-medium text-sm">{issue.message}</div>
                <div className="text-xs text-gray-500">{issue.model} • {issue.time}</div>
              </div>
              {issue.resolved ? (
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Resolved</span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Open</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

