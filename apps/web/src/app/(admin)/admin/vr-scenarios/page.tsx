'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Search,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  Users,
  Clock,
  Star,
  Award,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Upload,
  Download,
  BarChart3,
} from 'lucide-react';

// VR Scenarios data
const scenarios = [
  {
    id: '1',
    name: 'TAVR Procedure Simulation',
    description: 'Complete transcatheter aortic valve replacement simulation with real-time guidance',
    category: 'Structural Heart',
    difficulty: 'advanced',
    duration: '45 min',
    thumbnail: null,
    status: 'published',
    totalSessions: 2345,
    avgScore: 87.5,
    avgCompletionTime: '38m',
    rating: 4.9,
    reviews: 234,
    lastUpdated: '2 days ago',
    requirements: ['VR Headset', 'Hand Controllers', 'High-speed Internet'],
    learningObjectives: ['Understand TAVR indications', 'Master valve positioning', 'Handle complications'],
  },
  {
    id: '2',
    name: 'PCI Fundamentals',
    description: 'Basic percutaneous coronary intervention techniques',
    category: 'Interventional',
    difficulty: 'beginner',
    duration: '30 min',
    thumbnail: null,
    status: 'published',
    totalSessions: 5678,
    avgScore: 82.3,
    avgCompletionTime: '28m',
    rating: 4.8,
    reviews: 456,
    lastUpdated: '1 week ago',
    requirements: ['VR Headset', 'Hand Controllers'],
    learningObjectives: ['Wire navigation', 'Balloon inflation', 'Stent deployment'],
  },
  {
    id: '3',
    name: 'EP Ablation Mastery',
    description: 'Advanced electrophysiology ablation procedures',
    category: 'Electrophysiology',
    difficulty: 'expert',
    duration: '60 min',
    thumbnail: null,
    status: 'published',
    totalSessions: 1234,
    avgScore: 78.9,
    avgCompletionTime: '52m',
    rating: 4.7,
    reviews: 123,
    lastUpdated: '3 days ago',
    requirements: ['VR Headset', 'Hand Controllers', 'Haptic Feedback Gloves'],
    learningObjectives: ['Map cardiac rhythms', 'Identify ablation targets', 'Monitor success markers'],
  },
  {
    id: '4',
    name: 'Emergency Pericardiocentesis',
    description: 'Emergency drainage procedure for cardiac tamponade',
    category: 'Emergency',
    difficulty: 'intermediate',
    duration: '20 min',
    thumbnail: null,
    status: 'draft',
    totalSessions: 0,
    avgScore: 0,
    avgCompletionTime: '-',
    rating: 0,
    reviews: 0,
    lastUpdated: 'Today',
    requirements: ['VR Headset', 'Hand Controllers'],
    learningObjectives: ['Recognize tamponade', 'Safe needle insertion', 'Fluid drainage'],
  },
  {
    id: '5',
    name: 'Coronary Anatomy Explorer',
    description: 'Interactive 3D exploration of coronary artery anatomy',
    category: 'Anatomy',
    difficulty: 'beginner',
    duration: '25 min',
    thumbnail: null,
    status: 'published',
    totalSessions: 8901,
    avgScore: 91.2,
    avgCompletionTime: '22m',
    rating: 4.9,
    reviews: 678,
    lastUpdated: '5 days ago',
    requirements: ['VR Headset'],
    learningObjectives: ['Identify major vessels', 'Understand variations', 'Locate lesion sites'],
  },
];

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-green-100', text: 'text-green-600' },
  intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  advanced: { bg: 'bg-orange-100', text: 'text-orange-600' },
  expert: { bg: 'bg-red-100', text: 'text-red-600' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  published: { bg: 'bg-green-100', text: 'text-green-600' },
  draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
  review: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  archived: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function VRScenariosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || scenario.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === 'all' || scenario.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const totalSessions = scenarios.reduce((sum, s) => sum + s.totalSessions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Eye className="w-7 h-7 text-cyan-500" />
            VR Scenarios
          </h1>
          <p className="text-gray-500 text-sm">
            Manage virtual reality surgery simulations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Create Scenario
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Scenarios', value: scenarios.length.toString(), icon: Eye, color: 'text-cyan-500' },
          { label: 'Total Sessions', value: (totalSessions / 1000).toFixed(1) + 'K', icon: Users, color: 'text-blue-500' },
          { label: 'Avg Score', value: '85.2%', icon: Award, color: 'text-green-500' },
          { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-yellow-500' },
          { label: 'Active Now', value: '156', icon: Activity, color: 'text-red-500' },
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
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="review">Under Review</option>
        </select>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScenarios.map((scenario) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="h-40 bg-gradient-to-br from-cyan-500 to-blue-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye className="w-16 h-16 text-white/30" />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[scenario.difficulty].bg} ${difficultyColors[scenario.difficulty].text}`}>
                  {scenario.difficulty}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[scenario.status].bg} ${statusColors[scenario.status].text}`}>
                  {scenario.status}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 rounded bg-black/50 text-white text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {scenario.duration}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.name}</h3>
                  <p className="text-xs text-gray-500">{scenario.category}</p>
                </div>
                <button className="p-1 rounded hover:bg-gray-100">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scenario.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <div className="text-sm font-semibold text-gray-800">{scenario.totalSessions.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Sessions</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <div className="text-sm font-semibold text-gray-800">{scenario.avgScore || '-'}%</div>
                  <div className="text-xs text-gray-500">Avg Score</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">{scenario.rating || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-600 text-sm font-medium hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1">
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No VR scenarios found matching your filters</p>
        </div>
      )}
    </div>
  );
}

