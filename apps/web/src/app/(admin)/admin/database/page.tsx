'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Search,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Server,
  HardDrive,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Table,
  Key,
  Layers,
  Play,
  BarChart3,
  Settings,
  Terminal,
  Copy,
} from 'lucide-react';

// Database stats
const dbStats = {
  totalSize: '45.6 GB',
  usedSize: '32.4 GB',
  freeSize: '13.2 GB',
  usagePercent: 71,
  connections: 156,
  maxConnections: 500,
  uptime: '45 days 12h 34m',
  lastBackup: '2 hours ago',
  backupSize: '28.5 GB',
  queriesPerSecond: 1245,
  avgResponseTime: '12ms',
};

// Database tables
const tables = [
  { name: 'users', rows: 28450, size: '2.4 GB', lastModified: '5 min ago', indexes: 8 },
  { name: 'courses', rows: 156, size: '12.8 GB', lastModified: '1 hour ago', indexes: 12 },
  { name: 'enrollments', rows: 89234, size: '1.8 GB', lastModified: '2 min ago', indexes: 6 },
  { name: 'lessons', rows: 3456, size: '8.5 GB', lastModified: '30 min ago', indexes: 10 },
  { name: 'progress', rows: 456789, size: '3.2 GB', lastModified: '1 min ago', indexes: 8 },
  { name: 'certificates', rows: 12340, size: '0.5 GB', lastModified: '15 min ago', indexes: 5 },
  { name: 'achievements', rows: 89, size: '0.1 GB', lastModified: '2 days ago', indexes: 4 },
  { name: 'user_achievements', rows: 234567, size: '1.2 GB', lastModified: '3 min ago', indexes: 4 },
  { name: 'vr_sessions', rows: 18234, size: '2.1 GB', lastModified: '10 min ago', indexes: 7 },
  { name: 'ai_conversations', rows: 567890, size: '4.5 GB', lastModified: '30 sec ago', indexes: 6 },
];

// Recent backups
const backups = [
  { id: 1, type: 'Full', size: '28.5 GB', created: '2 hours ago', status: 'completed', duration: '45 min' },
  { id: 2, type: 'Incremental', size: '2.1 GB', created: '8 hours ago', status: 'completed', duration: '8 min' },
  { id: 3, type: 'Incremental', size: '1.8 GB', created: '14 hours ago', status: 'completed', duration: '6 min' },
  { id: 4, type: 'Full', size: '27.8 GB', created: '1 day ago', status: 'completed', duration: '42 min' },
  { id: 5, type: 'Incremental', size: '2.4 GB', created: '1 day ago', status: 'completed', duration: '9 min' },
];

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'backups' | 'query'>('overview');
  const [selectedTable, setSelectedTable] = useState<typeof tables[0] | null>(null);
  const [queryInput, setQueryInput] = useState('SELECT * FROM users LIMIT 10;');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Database className="w-7 h-7 text-blue-500" />
            Database Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and manage PostgreSQL database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Backup Now
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        {['overview', 'tables', 'backups', 'query'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Database Size', value: dbStats.totalSize, icon: HardDrive, color: 'text-blue-500' },
              { label: 'Active Connections', value: `${dbStats.connections}/${dbStats.maxConnections}`, icon: Server, color: 'text-green-500' },
              { label: 'Queries/sec', value: dbStats.queriesPerSecond.toLocaleString(), icon: Activity, color: 'text-purple-500' },
              { label: 'Avg Response', value: dbStats.avgResponseTime, icon: Clock, color: 'text-orange-500' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Storage Usage */}
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Storage Usage</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Used: {dbStats.usedSize}</span>
                <span className="text-sm text-gray-600">Free: {dbStats.freeSize}</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dbStats.usagePercent > 80 ? 'bg-red-500' : dbStats.usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${dbStats.usagePercent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{dbStats.usagePercent}% of {dbStats.totalSize} used</div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="text-sm text-gray-500">Uptime</div>
                <div className="font-medium text-gray-800">{dbStats.uptime}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Backup</div>
                <div className="font-medium text-gray-800">{dbStats.lastBackup}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Backup Size</div>
                <div className="font-medium text-gray-800">{dbStats.backupSize}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
              <Download className="w-5 h-5 text-blue-500 mb-2" />
              <div className="font-medium text-gray-800">Export Data</div>
              <div className="text-xs text-gray-500">Download database dump</div>
            </button>
            <button className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
              <Upload className="w-5 h-5 text-green-500 mb-2" />
              <div className="font-medium text-gray-800">Import Data</div>
              <div className="text-xs text-gray-500">Restore from backup</div>
            </button>
            <button className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
              <RefreshCw className="w-5 h-5 text-purple-500 mb-2" />
              <div className="font-medium text-gray-800">Run Migrations</div>
              <div className="text-xs text-gray-500">Apply pending changes</div>
            </button>
            <button className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
              <Settings className="w-5 h-5 text-orange-500 mb-2" />
              <div className="font-medium text-gray-800">Optimize</div>
              <div className="text-xs text-gray-500">Vacuum and analyze</div>
            </button>
          </div>
        </>
      )}

      {activeTab === 'tables' && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rows</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indexes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Modified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tables.map((table) => (
                <tr key={table.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-800">{table.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{table.rows.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{table.size}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-700">{table.indexes}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500">{table.lastModified}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Browse">
                        <Layers className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Query">
                        <Terminal className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Export">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Backup History</h3>
            <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm flex items-center gap-2 transition-colors">
              <Play className="w-4 h-4" />
              Create Backup
            </button>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        backup.type === 'Full' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{backup.size}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{backup.created}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{backup.duration}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Restore">
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'query' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">SQL Query Editor</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors flex items-center gap-1">
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  Run Query
                </button>
              </div>
            </div>
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full h-40 p-3 font-mono text-sm bg-gray-900 text-green-400 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your SQL query here..."
            />
          </div>
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Terminal className="w-4 h-4" />
              <span>Query results will appear here</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

