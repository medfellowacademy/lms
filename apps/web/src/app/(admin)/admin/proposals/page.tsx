'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Vote,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Filter,
  TrendingUp,
  Award,
} from 'lucide-react';

// Proposals data
const proposals = [
  {
    id: 'PROP-001',
    title: 'Add Advanced Structural Heart Module',
    description: 'Proposal to add comprehensive TAVR, TEER, and LAA closure content to the curriculum',
    author: {
      name: 'User Name',
      avatar: 'SC',
      level: 42,
    },
    category: 'curriculum',
    status: 'active',
    votesFor: 234,
    votesAgainst: 45,
    totalVoters: 312,
    quorum: 200,
    comments: 56,
    createdAt: '3 days ago',
    endsAt: '4 days remaining',
    tags: ['Structural Heart', 'New Content', 'Fellowship'],
  },
  {
    id: 'PROP-002',
    title: 'Implement Peer Review System',
    description: 'Create a peer review system where senior members can evaluate and provide feedback on junior member progress',
    author: {
      name: 'User Name',
      avatar: 'JM',
      level: 38,
    },
    category: 'platform',
    status: 'active',
    votesFor: 189,
    votesAgainst: 23,
    totalVoters: 245,
    quorum: 200,
    comments: 34,
    createdAt: '5 days ago',
    endsAt: '2 days remaining',
    tags: ['Community', 'Mentorship', 'Feature'],
  },
  {
    id: 'PROP-003',
    title: 'Mobile App Offline Mode',
    description: 'Enable downloading courses for offline viewing on mobile devices',
    author: {
      name: 'User Name',
      avatar: 'EK',
      level: 35,
    },
    category: 'platform',
    status: 'passed',
    votesFor: 456,
    votesAgainst: 34,
    totalVoters: 523,
    quorum: 200,
    comments: 89,
    createdAt: '2 weeks ago',
    endsAt: 'Ended',
    tags: ['Mobile', 'Feature', 'UX'],
  },
  {
    id: 'PROP-004',
    title: 'Reduce VR Session Requirements',
    description: 'Decrease mandatory VR sessions from 10 to 5 for fellowship completion',
    author: {
      name: 'Dr. Ahmed Hassan',
      avatar: 'AH',
      level: 28,
    },
    category: 'curriculum',
    status: 'rejected',
    votesFor: 67,
    votesAgainst: 189,
    totalVoters: 289,
    quorum: 200,
    comments: 145,
    createdAt: '3 weeks ago',
    endsAt: 'Ended',
    tags: ['VR', 'Requirements', 'Fellowship'],
  },
  {
    id: 'PROP-005',
    title: 'Annual Membership Discount',
    description: 'Introduce a 20% discount for annual membership renewals',
    author: {
      name: 'User Name',
      avatar: 'PS',
      level: 45,
    },
    category: 'governance',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    totalVoters: 0,
    quorum: 200,
    comments: 12,
    createdAt: 'Today',
    endsAt: 'Voting starts tomorrow',
    tags: ['Pricing', 'Membership', 'Discount'],
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  curriculum: { bg: 'bg-blue-100', text: 'text-blue-600' },
  platform: { bg: 'bg-purple-100', text: 'text-purple-600' },
  governance: { bg: 'bg-orange-100', text: 'text-orange-600' },
  community: { bg: 'bg-green-100', text: 'text-green-600' },
};

const statusColors: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  active: { bg: 'bg-green-100', text: 'text-green-600', icon: Clock },
  passed: { bg: 'bg-blue-100', text: 'text-blue-600', icon: CheckCircle2 },
  rejected: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: Clock },
};

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState<typeof proposals[0] | null>(null);

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || proposal.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Vote className="w-7 h-7 text-orange-500" />
            Proposal Management
          </h1>
          <p className="text-gray-500 text-sm">
            Review and moderate community governance proposals
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Proposals', value: proposals.length.toString(), icon: Vote, color: 'text-orange-500' },
          { label: 'Active Voting', value: proposals.filter(p => p.status === 'active').length.toString(), icon: Clock, color: 'text-green-500' },
          { label: 'Passed', value: proposals.filter(p => p.status === 'passed').length.toString(), icon: CheckCircle2, color: 'text-blue-500' },
          { label: 'Total Voters', value: '1.2K', icon: Users, color: 'text-purple-500' },
          { label: 'Participation', value: '45%', icon: TrendingUp, color: 'text-cyan-500' },
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
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="curriculum">Curriculum</option>
          <option value="platform">Platform</option>
          <option value="governance">Governance</option>
          <option value="community">Community</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="passed">Passed</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
          const StatusIcon = statusColors[proposal.status].icon;

          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold text-sm">
                    {proposal.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{proposal.author.name}</span>
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-xs font-medium">
                        Lv.{proposal.author.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{proposal.id}</span>
                      <span>•</span>
                      <span>{proposal.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[proposal.status].bg} ${statusColors[proposal.status].text}`}>
                    <StatusIcon className="w-3 h-3" />
                    {proposal.status}
                  </span>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">{proposal.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{proposal.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[proposal.category].bg} ${categoryColors[proposal.category].text}`}>
                  {proposal.category}
                </span>
                {proposal.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Voting Progress */}
              {proposal.status !== 'pending' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">{proposal.votesFor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">{proposal.votesAgainst}</span>
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${forPercentage}%` }}
                    />
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${100 - forPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{proposal.totalVoters} of {proposal.quorum} quorum</span>
                    <span>{proposal.endsAt}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {proposal.comments} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {proposal.totalVoters} voters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                  {proposal.status === 'active' && (
                    <>
                      <button className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-sm hover:bg-red-200 transition-colors">
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <Vote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No proposals found matching your filters</p>
        </div>
      )}
    </div>
  );
}

