'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  MessageSquare,
  User,
  FileText,
  Video,
  Image,
  Shield,
  Ban,
  ThumbsUp,
  Calendar,
} from 'lucide-react';

// Reports data
const reports = [
  {
    id: 'RPT-001',
    type: 'content',
    contentType: 'comment',
    reason: 'Inappropriate language',
    description: 'Comment contains offensive language targeting other users',
    reporter: { name: 'User Name', avatar: 'SC' },
    reported: { name: 'Anonymous User', avatar: 'AU' },
    status: 'pending',
    severity: 'high',
    createdAt: '2 hours ago',
    content: 'This comment has been flagged for review...',
  },
  {
    id: 'RPT-002',
    type: 'user',
    contentType: 'profile',
    reason: 'Fake credentials',
    description: 'User claims to be a board-certified cardiologist but credentials could not be verified',
    reporter: { name: 'System', avatar: 'SY' },
    reported: { name: 'John Smith', avatar: 'JS' },
    status: 'under_review',
    severity: 'critical',
    createdAt: '5 hours ago',
    content: null,
  },
  {
    id: 'RPT-003',
    type: 'content',
    contentType: 'post',
    reason: 'Misinformation',
    description: 'Post contains medically inaccurate information about heart disease treatment',
    reporter: { name: 'User Name', avatar: 'JM' },
    reported: { name: 'Dr. Ahmed Hassan', avatar: 'AH' },
    status: 'resolved',
    severity: 'medium',
    createdAt: '1 day ago',
    resolution: 'Content removed and user warned',
    content: 'Treatment for heart disease should include...',
  },
  {
    id: 'RPT-004',
    type: 'content',
    contentType: 'video',
    reason: 'Copyright violation',
    description: 'Video appears to be copyrighted material from another platform',
    reporter: { name: 'Content Team', avatar: 'CT' },
    reported: { name: 'User Name', avatar: 'EK' },
    status: 'pending',
    severity: 'medium',
    createdAt: '3 hours ago',
    content: null,
  },
  {
    id: 'RPT-005',
    type: 'user',
    contentType: 'behavior',
    reason: 'Harassment',
    description: 'User has been sending unwanted messages to multiple members',
    reporter: { name: 'Multiple Users', avatar: 'MU' },
    reported: { name: 'Unknown User', avatar: 'UU' },
    status: 'escalated',
    severity: 'critical',
    createdAt: '6 hours ago',
    content: null,
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  under_review: { bg: 'bg-blue-100', text: 'text-blue-600' },
  resolved: { bg: 'bg-green-100', text: 'text-green-600' },
  escalated: { bg: 'bg-red-100', text: 'text-red-600' },
  dismissed: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const severityColors: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  high: { bg: 'bg-orange-100', text: 'text-orange-600' },
  critical: { bg: 'bg-red-100', text: 'text-red-600' },
};

const contentTypeIcons: Record<string, typeof MessageSquare> = {
  comment: MessageSquare,
  post: FileText,
  video: Video,
  image: Image,
  profile: User,
  behavior: AlertTriangle,
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const criticalCount = reports.filter(r => r.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Flag className="w-7 h-7 text-red-500" />
            Reports & Flags
          </h1>
          <p className="text-gray-500 text-sm">
            Review and resolve user reports and flagged content
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-yellow-100 border border-yellow-200">
              <span className="text-sm font-medium text-yellow-700">{pendingCount} pending</span>
            </div>
          )}
          {criticalCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-200">
              <span className="text-sm font-medium text-red-700">{criticalCount} critical</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Reports', value: reports.length.toString(), icon: Flag, color: 'text-red-500' },
          { label: 'Pending', value: pendingCount.toString(), icon: Clock, color: 'text-yellow-500' },
          { label: 'Under Review', value: reports.filter(r => r.status === 'under_review').length.toString(), icon: Eye, color: 'text-blue-500' },
          { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length.toString(), icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Critical', value: criticalCount.toString(), icon: AlertTriangle, color: 'text-red-500' },
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
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const ContentIcon = contentTypeIcons[report.contentType] || FileText;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severityColors[report.severity].bg}`}>
                    <ContentIcon className={`w-5 h-5 ${severityColors[report.severity].text}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{report.reason}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[report.severity].bg} ${severityColors[report.severity].text}`}>
                        {report.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{report.id}</span>
                      <span>•</span>
                      <span>{report.contentType}</span>
                      <span>•</span>
                      <span>{report.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[report.status].bg} ${statusColors[report.status].text}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{report.description}</p>

              <div className="flex items-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Reported by:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                      {report.reporter.avatar}
                    </div>
                    <span className="text-gray-700">{report.reporter.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Against:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-xs">
                      {report.reported.avatar}
                    </div>
                    <span className="text-gray-700">{report.reported.name}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {report.status === 'pending' && (
                    <>
                      <button className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Dismiss
                      </button>
                    </>
                  )}
                  {report.status === 'under_review' && (
                    <>
                      <button className="px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Resolve
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-sm hover:bg-red-200 transition-colors flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Escalate
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-600 text-sm hover:bg-orange-200 transition-colors flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Warn User
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-sm hover:bg-red-200 transition-colors flex items-center gap-1">
                    <Ban className="w-4 h-4" />
                    Ban User
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

