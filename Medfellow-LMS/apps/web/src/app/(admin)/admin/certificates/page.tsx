'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Copy,
  QrCode,
  Award,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  MoreVertical,
  FileText,
  Share2,
} from 'lucide-react';

// Certificate templates
const templates = [
  { id: 'fellowship', name: 'Fellowship Completion', color: 'from-blue-500 to-purple-500' },
  { id: 'course', name: 'Course Completion', color: 'from-green-500 to-teal-500' },
  { id: 'specialization', name: 'Specialization', color: 'from-orange-500 to-red-500' },
  { id: 'achievement', name: 'Achievement Award', color: 'from-yellow-500 to-orange-500' },
];

// Issued certificates
const certificates: any[] = [
  {
    id: 'CERT-2024-001234',
    recipient: { name: 'User Name', email: 'sarah.chen@stanford.edu', avatar: 'SC' },
    course: 'Interventional Cardiology Fellowship',
    template: 'fellowship',
    issuedAt: 'Dec 1, 2024',
    expiresAt: 'Dec 1, 2027',
    status: 'active',
    verifications: 45,
    downloads: 12,
    score: 94.5,
  },
  {
    id: 'CERT-2024-001235',
    recipient: { name: 'User Name', email: 'j.miller@mayo.edu', avatar: 'JM' },
    course: 'Advanced Cardiac Imaging',
    template: 'course',
    issuedAt: 'Nov 28, 2024',
    expiresAt: 'Nov 28, 2027',
    status: 'active',
    verifications: 23,
    downloads: 8,
    score: 89.2,
  },
  {
    id: 'CERT-2024-001236',
    recipient: { name: 'User Name', email: 'elena.k@berlin-med.de', avatar: 'EK' },
    course: 'Electrophysiology Fundamentals',
    template: 'course',
    issuedAt: 'Nov 25, 2024',
    expiresAt: 'Nov 25, 2027',
    status: 'active',
    verifications: 15,
    downloads: 5,
    score: 91.8,
  },
  {
    id: 'CERT-2023-009876',
    recipient: { name: 'Dr. Marcus Johnson', email: 'marcus.j@hopkins.edu', avatar: 'MJ' },
    course: 'Heart Failure Management',
    template: 'course',
    issuedAt: 'Jan 15, 2023',
    expiresAt: 'Jan 15, 2024',
    status: 'expired',
    verifications: 67,
    downloads: 20,
    score: 87.5,
  },
  {
    id: 'CERT-2024-001237',
    recipient: { name: 'User Name', email: 'priya.sharma@aiims.in', avatar: 'PS' },
    course: 'Structural Heart Disease',
    template: 'specialization',
    issuedAt: 'Nov 20, 2024',
    expiresAt: null,
    status: 'active',
    verifications: 34,
    downloads: 11,
    score: 96.3,
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  revoked: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = 
      cert.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    const matchesTemplate = filterTemplate === 'all' || cert.template === filterTemplate;
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <GraduationCap className="w-7 h-7 text-emerald-500" />
            Certificate Management
          </h1>
          <p className="text-gray-500 text-sm">
            Issue, manage, and verify digital certificates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" />
            Templates
          </button>
          <button className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Issue Certificate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Issued', value: '1,234', icon: GraduationCap, color: 'text-emerald-500' },
          { label: 'Active', value: '1,156', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Expired', value: '78', icon: Clock, color: 'text-red-500' },
          { label: 'Verifications', value: '15.6K', icon: QrCode, color: 'text-blue-500' },
          { label: 'Downloads', value: '8.9K', icon: Download, color: 'text-purple-500' },
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
            placeholder="Search by ID, recipient, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
        <select
          value={filterTemplate}
          onChange={(e) => setFilterTemplate(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Templates</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Certificates Table */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course/Program</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm text-gray-700">{cert.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-xs">
                        {cert.recipient.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{cert.recipient.name}</div>
                        <div className="text-xs text-gray-500">{cert.recipient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-800">{cert.course}</div>
                    <div className="text-xs text-gray-500 capitalize">{cert.template}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-semibold ${
                        cert.score >= 90 ? 'text-green-600' : cert.score >= 80 ? 'text-yellow-600' : 'text-orange-600'
                      }`}>
                        {cert.score}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[cert.status]}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-700">{cert.issuedAt}</div>
                    {cert.expiresAt && (
                      <div className="text-xs text-gray-500">Expires: {cert.expiresAt}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {cert.verifications}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {cert.downloads}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Share">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-sm text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Templates */}
      <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Certificate Templates</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors cursor-pointer">
              <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${template.color} mb-3 flex items-center justify-center`}>
                <GraduationCap className="w-10 h-10 text-white/80" />
              </div>
              <div className="font-medium text-gray-800 text-sm">{template.name}</div>
              <div className="text-xs text-gray-500">Click to customize</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

