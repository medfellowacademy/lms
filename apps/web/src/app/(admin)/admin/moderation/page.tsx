'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flag,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  User,
  FileText,
  Image,
  Video,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Ban,
  Shield,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
} from 'lucide-react';

// Reports will be loaded from database
const reports: any[] = [];

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  under_review: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  dismissed: 'bg-gray-500/20 text-gray-400',
};

const typeIcons = {
  post: FileText,
  comment: MessageSquare,
  profile: User,
  media: Image,
  video: Video,
} as const;

export default function ModerationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.reportedItem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Flag className="w-7 h-7 text-red-400" />
            Content Moderation
          </h1>
          <p className="text-gray-500 text-sm">
            Review and manage reported content across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Pending Reviews', value: '23', icon: Clock, color: 'text-yellow-400', urgent: true },
          { label: 'Under Review', value: '8', icon: Eye, color: 'text-blue-400' },
          { label: 'Resolved Today', value: '45', icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Dismissed', value: '12', icon: XCircle, color: 'text-gray-400' },
          { label: 'Critical', value: '3', icon: AlertTriangle, color: 'text-red-400', urgent: true },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl bg-white border ${stat.urgent ? 'border-red-500/30' : 'border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.urgent && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
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
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredReports.map((report) => {
            const IconComponent = typeIcons[report.type as keyof typeof typeIcons] || FileText;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedReport(report)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-white border-gray-200 shadow-sm hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    report.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    report.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    report.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-medium">{report.reportedItem.title}</div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${severityColors[report.severity]}`}>
                          {report.severity}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[report.status]}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 line-clamp-2 mb-2">{report.details}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {report.reason}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {report.reporter}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.reportedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Report Details Panel */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm h-fit sticky top-24">
          {selectedReport ? (
            <>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Report Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Reported Content</div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="font-medium mb-1">{selectedReport.reportedItem.title}</div>
                    <div className="text-sm text-gray-400">By: {selectedReport.reportedItem.author}</div>
                    <div className="text-xs text-gray-500">{selectedReport.reportedItem.type}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Report Reason</div>
                  <div className={`inline-flex px-3 py-1.5 rounded-lg text-sm border ${severityColors[selectedReport.severity]}`}>
                    {selectedReport.reason}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Details</div>
                  <div className="text-sm text-gray-300">{selectedReport.details}</div>
                </div>

                {selectedReport.resolution && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Resolution</div>
                    <div className="text-sm text-green-400">{selectedReport.resolution}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500 mb-1">Reported By</div>
                  <div className="text-sm">{selectedReport.reporter}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Reported At</div>
                  <div className="text-sm">{selectedReport.reportedAt}</div>
                </div>

                {selectedReport.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                      <Ban className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}

                {selectedReport.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">
                      Mark as Under Review
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-gray-500/20 text-gray-400 text-sm hover:bg-gray-500/30 transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}

                <button className="w-full px-4 py-2 rounded-lg bg-gray-50 text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  View User History
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <div>Select a report to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

