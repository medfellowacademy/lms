'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  FileText,
  User,
  Building,
  Calendar,
  MapPin,
  GraduationCap,
  Stethoscope,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// Verification requests
const verificationRequests = [
  {
    id: '1',
    user: {
      name: 'Dr. Yuki Tanaka',
      email: 'y.tanaka@tokyo-u.jp',
      avatar: 'YT',
      joinedAt: 'Today',
    },
    credentials: {
      degree: 'MD, PhD',
      specialty: 'Interventional Cardiology',
      institution: 'Tokyo University Hospital',
      country: 'Japan',
      licenseNumber: 'JP-MED-2024-12345',
      yearGraduated: 2018,
    },
    documents: [
      { name: 'Medical License', type: 'pdf', verified: true },
      { name: 'Degree Certificate', type: 'pdf', verified: true },
      { name: 'Hospital ID', type: 'image', verified: false },
    ],
    status: 'pending',
    submittedAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: '2',
    user: {
      name: 'Dr. Ahmed Hassan',
      email: 'a.hassan@cairo-med.eg',
      avatar: 'AH',
      joinedAt: '1 day ago',
    },
    credentials: {
      degree: 'MBBCh',
      specialty: 'Cardiac Surgery',
      institution: 'Cairo University Hospital',
      country: 'Egypt',
      licenseNumber: 'EG-MED-2023-56789',
      yearGraduated: 2015,
    },
    documents: [
      { name: 'Medical License', type: 'pdf', verified: true },
      { name: 'Specialty Certificate', type: 'pdf', verified: false },
    ],
    status: 'pending',
    submittedAt: '1 day ago',
    priority: 'medium',
  },
  {
    id: '3',
    user: {
      name: 'Dr. Maria Garcia',
      email: 'm.garcia@barcelona-clinic.es',
      avatar: 'MG',
      joinedAt: '2 days ago',
    },
    credentials: {
      degree: 'MD',
      specialty: 'Electrophysiology',
      institution: 'Hospital Clinic Barcelona',
      country: 'Spain',
      licenseNumber: 'ES-MED-2022-98765',
      yearGraduated: 2016,
    },
    documents: [
      { name: 'Medical License', type: 'pdf', verified: true },
      { name: 'Degree Certificate', type: 'pdf', verified: true },
      { name: 'Specialty Certificate', type: 'pdf', verified: true },
    ],
    status: 'approved',
    submittedAt: '2 days ago',
    priority: 'low',
    reviewedBy: 'Admin',
    reviewedAt: '1 day ago',
  },
  {
    id: '4',
    user: {
      name: 'John Smith',
      email: 'j.smith@email.com',
      avatar: 'JS',
      joinedAt: '3 days ago',
    },
    credentials: {
      degree: 'Unknown',
      specialty: 'Cardiology',
      institution: 'Self-reported',
      country: 'USA',
      licenseNumber: 'INVALID-12345',
      yearGraduated: 2020,
    },
    documents: [
      { name: 'Medical License', type: 'pdf', verified: false },
    ],
    status: 'rejected',
    submittedAt: '3 days ago',
    priority: 'high',
    reviewedBy: 'Admin',
    reviewedAt: '2 days ago',
    rejectionReason: 'Invalid license number - document appears to be fraudulent',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-600',
  low: 'bg-blue-100 text-blue-600',
};

export default function VerificationPage() {
  const [selectedRequest, setSelectedRequest] = useState(verificationRequests[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredRequests = verificationRequests.filter(
    (req) => filterStatus === 'all' || req.status === filterStatus
  );

  const pendingCount = verificationRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Award className="w-7 h-7 text-yellow-500" />
            Verification Queue
          </h1>
          <p className="text-gray-500 text-sm">
            Review and verify medical professional credentials
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="px-3 py-1.5 rounded-lg bg-yellow-100 border border-yellow-200">
              <span className="text-sm font-medium text-yellow-700">{pendingCount} pending reviews</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Approved Today', value: '12', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Rejected', value: '3', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Avg Review Time', value: '4.2h', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl ${stat.bg} border border-gray-100`}>
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Request List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <motion.button
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              whileHover={{ scale: 1.01 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedRequest.id === request.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                  {request.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{request.user.name}</div>
                  <div className="text-xs text-gray-500">{request.credentials.specialty}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[request.priority]}`}>
                  {request.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-xs border ${statusColors[request.status]}`}>
                  {request.status}
                </span>
                <span className="text-xs text-gray-500">{request.submittedAt}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedRequest.user.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedRequest.user.name}</h2>
                  <p className="text-gray-500">{selectedRequest.user.email}</p>
                  <p className="text-xs text-gray-400">Joined {selectedRequest.user.joinedAt}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[selectedRequest.status]}`}>
                {selectedRequest.status}
              </span>
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs">Degree</span>
                </div>
                <div className="font-medium text-gray-800">{selectedRequest.credentials.degree}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-xs">Specialty</span>
                </div>
                <div className="font-medium text-gray-800">{selectedRequest.credentials.specialty}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Building className="w-4 h-4" />
                  <span className="text-xs">Institution</span>
                </div>
                <div className="font-medium text-gray-800">{selectedRequest.credentials.institution}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Country</span>
                </div>
                <div className="font-medium text-gray-800">{selectedRequest.credentials.country}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">License Number</span>
                </div>
                <div className="font-medium text-gray-800 font-mono">{selectedRequest.credentials.licenseNumber}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Year Graduated</span>
                </div>
                <div className="font-medium text-gray-800">{selectedRequest.credentials.yearGraduated}</div>
              </div>
            </div>

            {/* Documents */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Submitted Documents</h3>
              <div className="space-y-2">
                {selectedRequest.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-600">{doc.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.verified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-600">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reason */}
            {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium text-sm">Rejection Reason</span>
                </div>
                <p className="text-sm text-red-700">{selectedRequest.rejectionReason}</p>
              </div>
            )}

            {/* Actions */}
            {selectedRequest.status === 'pending' && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Verification
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  Request More Info
                </button>
              </div>
            )}

            {/* Review Info */}
            {selectedRequest.reviewedBy && (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <p className="text-xs text-gray-500">
                  Reviewed by <span className="font-medium">{selectedRequest.reviewedBy}</span> • {selectedRequest.reviewedAt}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

