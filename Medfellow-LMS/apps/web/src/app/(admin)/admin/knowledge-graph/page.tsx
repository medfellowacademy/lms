'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Link,
  Link2Off,
  GitBranch,
  CircleDot,
  Layers,
  Upload,
  Download,
  Settings,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BookOpen,
} from 'lucide-react';

// Knowledge Graph data
const topics = [
  {
    id: '1',
    name: 'Interventional Cardiology',
    type: 'domain',
    connections: 24,
    courses: 8,
    mastery: 'expert',
    status: 'active',
    prerequisites: [],
    children: ['PCI', 'TAVR', 'Structural Heart', 'Coronary Imaging'],
  },
  {
    id: '2',
    name: 'Coronary Artery Disease',
    type: 'concept',
    connections: 18,
    courses: 5,
    mastery: 'advanced',
    status: 'active',
    prerequisites: ['Cardiac Anatomy', 'Pathophysiology'],
    children: ['Stable Angina', 'ACS', 'NSTEMI', 'STEMI'],
  },
  {
    id: '3',
    name: 'Percutaneous Coronary Intervention',
    type: 'procedure',
    connections: 15,
    courses: 4,
    mastery: 'advanced',
    status: 'active',
    prerequisites: ['Coronary Angiography', 'Wire Navigation'],
    children: ['Balloon Angioplasty', 'Stent Deployment', 'Rotablation'],
  },
  {
    id: '4',
    name: 'Electrophysiology',
    type: 'domain',
    connections: 20,
    courses: 6,
    mastery: 'expert',
    status: 'active',
    prerequisites: ['Cardiac Anatomy', 'ECG Interpretation'],
    children: ['Ablation', 'Device Implantation', 'EP Study'],
  },
  {
    id: '5',
    name: 'Heart Failure',
    type: 'concept',
    connections: 22,
    courses: 7,
    mastery: 'advanced',
    status: 'active',
    prerequisites: ['Cardiac Physiology', 'Pharmacology'],
    children: ['HFrEF', 'HFpEF', 'Cardiomyopathy', 'LVAD'],
  },
  {
    id: '6',
    name: 'Cardiac Imaging',
    type: 'skill',
    connections: 16,
    courses: 5,
    mastery: 'intermediate',
    status: 'active',
    prerequisites: ['Cardiac Anatomy'],
    children: ['Echo', 'CT', 'MRI', 'Nuclear'],
  },
];

const connections = [
  { from: '1', to: '3', type: 'contains', strength: 'strong' },
  { from: '2', to: '3', type: 'requires', strength: 'strong' },
  { from: '1', to: '6', type: 'related', strength: 'moderate' },
  { from: '4', to: '5', type: 'related', strength: 'weak' },
  { from: '5', to: '6', type: 'requires', strength: 'moderate' },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  domain: { bg: 'bg-purple-100', text: 'text-purple-600' },
  concept: { bg: 'bg-blue-100', text: 'text-blue-600' },
  procedure: { bg: 'bg-green-100', text: 'text-green-600' },
  skill: { bg: 'bg-orange-100', text: 'text-orange-600' },
  topic: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
};

const masteryColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-gray-100', text: 'text-gray-600' },
  intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  advanced: { bg: 'bg-orange-100', text: 'text-orange-600' },
  expert: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function KnowledgeGraphPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || topic.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Network className="w-7 h-7 text-purple-500" />
            Knowledge Graph
          </h1>
          <p className="text-gray-500 text-sm">
            Manage learning topics, connections, and prerequisites
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === 'list' ? 'bg-white shadow text-gray-800' : 'text-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === 'graph' ? 'bg-white shadow text-gray-800' : 'text-gray-600'
              }`}
            >
              Graph
            </button>
          </div>
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Topic
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Topics', value: topics.length.toString(), icon: CircleDot, color: 'text-purple-500' },
          { label: 'Connections', value: connections.length.toString(), icon: Link, color: 'text-blue-500' },
          { label: 'Domains', value: topics.filter(t => t.type === 'domain').length.toString(), icon: Layers, color: 'text-green-500' },
          { label: 'Procedures', value: topics.filter(t => t.type === 'procedure').length.toString(), icon: GitBranch, color: 'text-orange-500' },
          { label: 'Linked Courses', value: topics.reduce((s, t) => s + t.courses, 0).toString(), icon: BookOpen, color: 'text-cyan-500' },
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
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="domain">Domain</option>
          <option value="concept">Concept</option>
          <option value="procedure">Procedure</option>
          <option value="skill">Skill</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-2 space-y-4">
          {viewMode === 'list' ? (
            <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connections</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mastery Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTopics.map((topic) => (
                    <tr
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedTopic?.id === topic.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[topic.type].bg}`}>
                            <CircleDot className={`w-4 h-4 ${typeColors[topic.type].text}`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-sm">{topic.name}</div>
                            <div className="text-xs text-gray-500">{topic.courses} courses linked</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[topic.type].bg} ${typeColors[topic.type].text}`}>
                          {topic.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Link className="w-4 h-4 text-gray-400" />
                          {topic.connections}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${masteryColors[topic.mastery].bg} ${masteryColors[topic.mastery].text}`}>
                          {topic.mastery}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <Link className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <div className="text-center">
                <Network className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Interactive graph visualization</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Topic Details */}
        <div className="space-y-4">
          {selectedTopic ? (
            <>
              <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[selectedTopic.type].bg}`}>
                    <CircleDot className={`w-6 h-6 ${typeColors[selectedTopic.type].text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedTopic.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[selectedTopic.type].bg} ${typeColors[selectedTopic.type].text}`}>
                      {selectedTopic.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xl font-bold text-gray-800">{selectedTopic.connections}</div>
                    <div className="text-xs text-gray-500">Connections</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xl font-bold text-gray-800">{selectedTopic.courses}</div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Prerequisites</h4>
                    {selectedTopic.prerequisites.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedTopic.prerequisites.map((p) => (
                          <span key={p} className="px-2 py-1 rounded bg-gray-100 text-xs text-gray-600">{p}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No prerequisites</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Child Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedTopic.children.map((c) => (
                        <span key={c} className="px-2 py-1 rounded bg-purple-50 text-xs text-purple-600">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                  Edit Topic
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">
                  <Link className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <CircleDot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Select a topic to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

