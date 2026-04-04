'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  RefreshCw,
  User,
  Settings,
  Shield,
  Database,
  Eye,
  Clock,
  Calendar,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  FileText,
  Key,
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Upload,
} from 'lucide-react';

// Audit log entries
const auditLogs: any[] = [];

    action: 'user.role.updated',
    category: 'users',
    description: 'Changed user role from Student to Instructor',
    target: 'User Name (sarah.chen@stanford.edu)',
    ip: '192.168.1.100',
    severity: 'warning',
    details: { oldRole: 'student', newRole: 'instructor' },
  },
  {
    id: '2',
    timestamp: '2024-12-03 14:28:12',
    user: { name: 'System', email: 'system@medfellow.academy', avatar: 'SY' },
    action: 'course.published',
    category: 'content',
    description: 'Course published to production',
    target: 'Advanced Cardiac Imaging',
    ip: 'system',
    severity: 'info',
    details: { courseId: 'course-123' },
  },
  {
    id: '3',
    timestamp: '2024-12-03 14:15:33',
    user: { name: 'Admin', email: 'admin@medfellow.academy', avatar: 'AD' },
    action: 'user.suspended',
    category: 'users',
    description: 'User account suspended due to policy violation',
    target: 'John Smith (j.smith@email.com)',
    ip: '192.168.1.100',
    severity: 'error',
    details: { reason: 'Multiple credential fraud attempts' },
  },
  {
    id: '4',
    timestamp: '2024-12-03 13:45:21',
    user: { name: 'User Name', email: 'j.miller@mayo.edu', avatar: 'JM' },
    action: 'auth.login',
    category: 'auth',
    description: 'Successful login',
    target: 'Dashboard',
    ip: '203.45.67.89',
    severity: 'info',
    details: { method: 'password', mfa: true },
  },
  {
    id: '5',
    timestamp: '2024-12-03 13:30:00',
    user: { name: 'System', email: 'system@medfellow.academy', avatar: 'SY' },
    action: 'database.backup',
    category: 'system',
    description: 'Automated database backup completed',
    target: 'PostgreSQL Main',
    ip: 'system',
    severity: 'success',
    details: { size: '28.5 GB', duration: '45 min' },
  },
  {
    id: '6',
    timestamp: '2024-12-03 12:15:45',
    user: { name: 'Admin', email: 'admin@medfellow.academy', avatar: 'AD' },
    action: 'settings.updated',
    category: 'settings',
    description: 'Platform settings modified',
    target: 'Security Configuration',
    ip: '192.168.1.100',
    severity: 'warning',
    details: { changes: ['mfaRequired', 'sessionTimeout'] },
  },
  {
    id: '7',
    timestamp: '2024-12-03 11:45:00',
    user: { name: 'User Name', email: 'elena.k@berlin-med.de', avatar: 'EK' },
    action: 'auth.login.failed',
    category: 'auth',
    description: 'Failed login attempt - incorrect password',
    target: 'Dashboard',
    ip: '156.78.90.12',
    severity: 'warning',
    details: { attempts: 2 },
  },
  {
    id: '8',
    timestamp: '2024-12-03 10:30:22',
    user: { name: 'System', email: 'system@medfellow.academy', avatar: 'SY' },
    action: 'certificate.issued',
    category: 'content',
    description: 'Certificate automatically issued',
    target: 'CERT-2024-001234',
    ip: 'system',
    severity: 'success',
    details: { recipient: 'User Name', course: 'Interventional Cardiology' },
  },
];

const categoryIcons: Record<string, typeof User> = {
  users: User,
  content: FileText,
  auth: Key,
  system: Database,
  settings: Settings,
  security: Shield,
};

const severityConfig: Record<string, { bg: string; text: string; icon: typeof Info }> = {
  info: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Info },
  success: { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 },
  warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: AlertTriangle },
  error: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle },
};

const actionIcons: Record<string, typeof User> = {
  'user.role.updated': Shield,
  'course.published': Upload,
  'user.suspended': XCircle,
  'auth.login': LogIn,
  'auth.login.failed': AlertTriangle,
  'auth.logout': LogOut,
  'database.backup': Database,
  'settings.updated': Settings,
  'certificate.issued': CheckCircle2,
  'user.created': UserPlus,
  'user.updated': Edit,
  'user.deleted': Trash2,
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <ScrollText className="w-7 h-7 text-slate-500" />
            Audit Logs
          </h1>
          <p className="text-gray-500 text-sm">
            Track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Events', value: auditLogs.length.toString(), icon: ScrollText, color: 'text-slate-500' },
          { label: 'Warnings', value: auditLogs.filter(l => l.severity === 'warning').length.toString(), icon: AlertTriangle, color: 'text-yellow-500' },
          { label: 'Errors', value: auditLogs.filter(l => l.severity === 'error').length.toString(), icon: XCircle, color: 'text-red-500' },
          { label: 'Auth Events', value: auditLogs.filter(l => l.category === 'auth').length.toString(), icon: Key, color: 'text-blue-500' },
          { label: 'System Events', value: auditLogs.filter(l => l.category === 'system').length.toString(), icon: Database, color: 'text-purple-500' },
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
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          />
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="all">All time</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="users">Users</option>
          <option value="content">Content</option>
          <option value="auth">Authentication</option>
          <option value="system">System</option>
          <option value="settings">Settings</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Severity</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const CategoryIcon = categoryIcons[log.category] || FileText;
          const ActionIcon = actionIcons[log.action] || FileText;
          const severity = severityConfig[log.severity];
          const SeverityIcon = severity.icon;
          const isExpanded = expandedLog === log.id;

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severity.bg}`}>
                  <SeverityIcon className={`w-5 h-5 ${severity.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{log.description}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${severity.bg} ${severity.text}`}>
                      {log.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.user.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <CategoryIcon className="w-3 h-3" />
                      {log.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 border-t border-gray-100"
                >
                  <div className="pt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Action</div>
                      <div className="flex items-center gap-2">
                        <ActionIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-mono text-gray-800">{log.action}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Target</div>
                      <div className="text-sm text-gray-800">{log.target}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">IP Address</div>
                      <div className="text-sm font-mono text-gray-800">{log.ip}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">User Email</div>
                      <div className="text-sm text-gray-800">{log.user.email}</div>
                    </div>
                  </div>
                  {log.details && (
                    <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-xs text-gray-500 mb-2">Details</div>
                      <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <ScrollText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No audit logs found matching your filters</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {auditLogs.length} events
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-500 text-sm text-white">1</button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

