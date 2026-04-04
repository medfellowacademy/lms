'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Clock,
  Users,
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Download,
  Upload,
  Zap,
} from 'lucide-react';

// Assessments data
const assessments = [
  {
    id: '1',
    title: 'Interventional Cardiology Board Prep',
    description: 'Comprehensive exam covering all IC topics',
    type: 'exam',
    category: 'Interventional',
    questions: 150,
    duration: '180 min',
    passingScore: 75,
    attempts: 3456,
    avgScore: 78.5,
    passRate: 72,
    status: 'active',
    difficulty: 'advanced',
    lastUpdated: '3 days ago',
  },
  {
    id: '2',
    title: 'PCI Fundamentals Quiz',
    description: 'Basic concepts of percutaneous intervention',
    type: 'quiz',
    category: 'Interventional',
    questions: 25,
    duration: '30 min',
    passingScore: 70,
    attempts: 8901,
    avgScore: 84.2,
    passRate: 89,
    status: 'active',
    difficulty: 'beginner',
    lastUpdated: '1 week ago',
  },
  {
    id: '3',
    title: 'EP Case Studies',
    description: 'Complex electrophysiology case-based questions',
    type: 'case-study',
    category: 'Electrophysiology',
    questions: 20,
    duration: '60 min',
    passingScore: 80,
    attempts: 2134,
    avgScore: 71.8,
    passRate: 58,
    status: 'active',
    difficulty: 'expert',
    lastUpdated: '5 days ago',
  },
  {
    id: '4',
    title: 'Heart Failure Management',
    description: 'HFrEF and HFpEF management strategies',
    type: 'exam',
    category: 'Heart Failure',
    questions: 75,
    duration: '90 min',
    passingScore: 75,
    attempts: 4567,
    avgScore: 81.3,
    passRate: 78,
    status: 'active',
    difficulty: 'intermediate',
    lastUpdated: '2 days ago',
  },
  {
    id: '5',
    title: 'Cardiac Imaging Interpretation',
    description: 'Echo, CT, and MRI image interpretation',
    type: 'practical',
    category: 'Imaging',
    questions: 40,
    duration: '45 min',
    passingScore: 80,
    attempts: 3210,
    avgScore: 76.9,
    passRate: 68,
    status: 'draft',
    difficulty: 'advanced',
    lastUpdated: 'Today',
  },
];

// Question bank stats
const questionBank = {
  total: 5234,
  byType: {
    multipleChoice: 3245,
    trueFalse: 456,
    caseStudy: 789,
    imageInterpretation: 456,
    fillInBlank: 288,
  },
  byDifficulty: {
    easy: 1234,
    medium: 2456,
    hard: 1544,
  },
};

const typeColors: Record<string, { bg: string; text: string; icon: typeof FileQuestion }> = {
  exam: { bg: 'bg-red-100', text: 'text-red-600', icon: FileQuestion },
  quiz: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Zap },
  'case-study': { bg: 'bg-purple-100', text: 'text-purple-600', icon: Eye },
  practical: { bg: 'bg-green-100', text: 'text-green-600', icon: Play },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-600' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  archived: { bg: 'bg-red-100', text: 'text-red-600' },
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-green-100', text: 'text-green-600' },
  intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  advanced: { bg: 'bg-orange-100', text: 'text-orange-600' },
  expert: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState<'assessments' | 'questions'>('assessments');

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || assessment.type === filterType;
    const matchesStatus = filterStatus === 'all' || assessment.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <FileQuestion className="w-7 h-7 text-indigo-500" />
            Assessment Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create and manage exams, quizzes, and question banks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import Questions
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'assessments'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Assessments
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Question Bank
        </button>
      </div>

      {activeTab === 'assessments' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Assessments', value: assessments.length.toString(), icon: FileQuestion, color: 'text-indigo-500' },
              { label: 'Total Attempts', value: '22.3K', icon: Users, color: 'text-blue-500' },
              { label: 'Avg Pass Rate', value: '73%', icon: Award, color: 'text-green-500' },
              { label: 'Active', value: assessments.filter(a => a.status === 'active').length.toString(), icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Questions', value: questionBank.total.toLocaleString(), icon: FileQuestion, color: 'text-purple-500' },
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
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="case-study">Case Study</option>
              <option value="practical">Practical</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Assessments Table */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{assessment.title}</div>
                        <div className="text-xs text-gray-500">{assessment.category} • {assessment.duration}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[assessment.type].bg} ${typeColors[assessment.type].text}`}>
                        {assessment.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{assessment.questions}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">{assessment.attempts.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${assessment.passRate >= 75 ? 'bg-green-500' : assessment.passRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${assessment.passRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{assessment.passRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[assessment.status].bg} ${statusColors[assessment.status].text}`}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Preview">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Analytics">
                          <BarChart3 className="w-4 h-4 text-gray-400" />
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
        </>
      ) : (
        /* Question Bank */
        <div className="space-y-6">
          {/* Question Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Total Questions</h3>
              <div className="text-3xl font-bold text-indigo-600">{questionBank.total.toLocaleString()}</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">By Type</h3>
              <div className="space-y-2">
                {Object.entries(questionBank.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">By Difficulty</h3>
              <div className="space-y-2">
                {Object.entries(questionBank.byDifficulty).map(([diff, count]) => (
                  <div key={diff} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 capitalize">{diff}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
                <button className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </button>
              </div>
            </div>
          </div>

          {/* Question List Preview */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <div className="text-center py-8">
              <FileQuestion className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">Question Bank Editor</h3>
              <p className="text-gray-500 text-sm">Create and manage individual questions</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">
                Open Question Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

