'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  FileText,
  Landmark,
  Award,
  BarChart3,
  Sparkles,
  Zap,
  Target,
  Heart,
  GraduationCap,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from 'lucide-react';
import { useProposals, useVoteOnProposal, useUser } from '@/lib/api';

// Community stats (level-based voting power)
const communityStats = {
  totalMembers: '28,450',
  activeVoters: '12,340',
  proposalsThisMonth: '8',
  participationRate: '43.4%',
};

// Active proposals
const proposals = [
  {
    id: 'MF-42',
    title: 'Add Pediatric Cardiology Fellowship Track',
    description: 'Proposal to develop and launch a new specialized track for pediatric cardiology, including curriculum design, faculty recruitment, and VR surgery modules.',
    author: 'User Name',
    category: 'Curriculum',
    status: 'active',
    votesFor: 2840000,
    votesAgainst: 420000,
    totalVotes: 3260000,
    quorum: 3000000,
    endDate: '3 days left',
    yourVote: null,
  },
  {
    id: 'MF-41',
    title: 'Reduce Certification Fee by 20%',
    description: 'Lower the blockchain certification minting fee from 500 to 400 MF tokens to increase accessibility for students in developing countries.',
    author: 'Community Treasury',
    category: 'Economics',
    status: 'active',
    votesFor: 1950000,
    votesAgainst: 1100000,
    totalVotes: 3050000,
    quorum: 3000000,
    endDate: '5 days left',
    yourVote: 'for',
  },
  {
    id: 'MF-40',
    title: 'Partner with WHO for Global Credential Recognition',
    description: 'Allocate treasury funds to establish partnership with World Health Organization for worldwide credential recognition.',
    author: 'Governance Council',
    category: 'Partnership',
    status: 'passed',
    votesFor: 4200000,
    votesAgainst: 800000,
    totalVotes: 5000000,
    quorum: 3000000,
    endDate: 'Ended',
    yourVote: 'for',
  },
];

// Treasury stats
const treasury = {
  totalValue: '$45.2M',
  mfTokens: '18,500,000 MF',
  stablecoins: '$12.5M USDC',
  monthlyInflow: '+$1.2M',
  monthlyOutflow: '-$450K',
  allocations: [
    { category: 'Development', percentage: 35, amount: '$15.8M' },
    { category: 'Research Grants', percentage: 25, amount: '$11.3M' },
    { category: 'Marketing', percentage: 15, amount: '$6.8M' },
    { category: 'Operations', percentage: 15, amount: '$6.8M' },
    { category: 'Reserves', percentage: 10, amount: '$4.5M' },
  ],
};

// Staking tiers
const stakingTiers = [
  { name: 'Observer', minStake: 0, votingMultiplier: 1, benefits: ['Basic voting rights', 'Community access'] },
  { name: 'Contributor', minStake: 1000, votingMultiplier: 1.25, benefits: ['1.25x voting power', 'Early feature access', '5% APY'] },
  { name: 'Scholar', minStake: 5000, votingMultiplier: 1.5, benefits: ['1.5x voting power', 'Proposal creation', '8% APY', 'Course discounts'] },
  { name: 'Mentor', minStake: 25000, votingMultiplier: 2, benefits: ['2x voting power', 'Council elections', '12% APY', 'Revenue share'] },
  { name: 'Council', minStake: 100000, votingMultiplier: 3, benefits: ['3x voting power', 'Emergency powers', '15% APY', 'Full revenue share'] },
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'community'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState(proposals[0]);
  const [showVoteModal, setShowVoteModal] = useState(false);

  // Fetch data from API
  const { data: userData } = useUser();
  const { data: proposalsData, isLoading: proposalsLoading } = useProposals();
  const voteMutation = useVoteOnProposal();

  // User's voting power based on level
  const userLevel = userData?.user?.level || 1;
  const votingPower = userLevel; // 1 vote per level

  // Use API proposals or fallback to mock data
  const displayProposals = proposalsData?.proposals?.length 
    ? proposalsData.proposals.map(p => ({
        ...p,
        votesFor: p.votesFor,
        votesAgainst: p.votesAgainst,
        totalVotes: p.votesFor + p.votesAgainst,
        yourVote: p.userVote || null,
      }))
    : proposals;

  const handleVote = async (proposalId: string, vote: 'FOR' | 'AGAINST') => {
    try {
      await voteMutation.mutateAsync({ proposalId, vote });
      setShowVoteModal(false);
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Landmark className="w-7 h-7 text-neural-500" />
            Community Governance
          </h1>
          <p className="text-muted-foreground">
            Shape the future of medical education through community voting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-health-500/10 border border-health-500/30">
            <Award className="w-4 h-4 text-health-500" />
            <span className="text-sm font-medium">Level {userLevel} · {votingPower} Voting Power</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Proposal
          </button>
        </div>
      </div>

      {/* Community Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: communityStats.totalMembers, icon: Users },
          { label: 'Active Voters', value: communityStats.activeVoters, icon: Vote },
          { label: 'Proposals This Month', value: communityStats.proposalsThisMonth, icon: FileText },
          { label: 'Your Voting Power', value: String(votingPower), highlight: true, icon: Zap },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl flex items-center gap-3 ${stat.highlight ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.highlight ? 'bg-primary/20' : 'bg-muted'}`}>
              <stat.icon className={`w-5 h-5 ${stat.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="font-semibold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'proposals', label: 'Proposals', icon: Vote },
          { id: 'community', label: 'Community', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'proposals' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Proposals List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Active Proposals</h2>
              <select className="px-3 py-1.5 rounded-lg bg-muted text-sm">
                <option>All Categories</option>
                <option>Curriculum</option>
                <option>Economics</option>
                <option>Partnership</option>
              </select>
            </div>
            
            {proposals.map((proposal) => {
              const votePercentage = (proposal.votesFor / proposal.totalVotes) * 100;
              const quorumPercentage = (proposal.totalVotes / proposal.quorum) * 100;
              
              return (
                <motion.button
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  whileHover={{ scale: 1.01 }}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    selectedProposal?.id === proposal.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neural-500/20 text-neural-500 text-xs font-medium">
                        {proposal.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        proposal.status === 'active' ? 'bg-health-500/20 text-health-500' :
                        proposal.status === 'passed' ? 'bg-ibmp-500/20 text-ibmp-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {proposal.status === 'active' ? 'Active' : 'Passed'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                        {proposal.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{proposal.endDate}</span>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{proposal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {proposal.description}
                  </p>
                  
                  {/* Vote Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-health-500">For: {(proposal.votesFor / 1000000).toFixed(1)}M</span>
                      <span className="text-critical-500">Against: {(proposal.votesAgainst / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-health-500" 
                        style={{ width: `${votePercentage}%` }} 
                      />
                      <div 
                        className="h-full bg-critical-500" 
                        style={{ width: `${100 - votePercentage}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Quorum: {quorumPercentage.toFixed(0)}%</span>
                      {proposal.yourVote && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-health-500" />
                          You voted {proposal.yourVote}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Proposal Detail */}
          <div className="space-y-6">
            {selectedProposal && (
              <>
                <div className="card-elevated p-5">
                  <h3 className="font-semibold mb-4">Proposal Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Author</span>
                      <span className="font-medium">{selectedProposal.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span>{selectedProposal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Votes</span>
                      <span>{(selectedProposal.totalVotes / 1000000).toFixed(2)}M MF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quorum Required</span>
                      <span>{(selectedProposal.quorum / 1000000).toFixed(0)}M MF</span>
                    </div>
                  </div>
                  
                  {selectedProposal.status === 'active' && !selectedProposal.yourVote && (
                    <div className="mt-6 space-y-3">
                      <button 
                        onClick={() => setShowVoteModal(true)}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Vote For
                      </button>
                      <button className="w-full btn-outline flex items-center justify-center gap-2 text-critical-500 border-critical-500/30 hover:bg-critical-500/10">
                        <ThumbsDown className="w-4 h-4" />
                        Vote Against
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-elevated p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-ibmp-500" />
                    Discussion
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500" />
                        <span className="text-sm font-medium">User Name</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Strong support for this. Pediatric cardiology is underrepresented in most programs.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-bio-500 to-achievement-500" />
                        <span className="text-sm font-medium">User Name</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        What's the timeline for implementation? Budget allocation seems reasonable.
                      </p>
                    </div>
                  </div>
                  <button className="w-full mt-4 text-sm text-primary hover:underline">
                    View all 24 comments
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voting Power Levels */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-achievement-500" />
                Voting Power by Level
              </h3>
              <p className="text-muted-foreground mb-6">
                Your voting power increases as you level up through learning and engagement.
                Each level grants you 1 additional voting power.
              </p>
              <div className="space-y-4">
                {[
                  { level: '1-10', power: '1-10 votes', benefits: ['Basic voting', 'View proposals'] },
                  { level: '11-25', power: '11-25 votes', benefits: ['Increased influence', 'Comment on proposals'] },
                  { level: '26-50', power: '26-50 votes', benefits: ['Proposal endorsements', 'Priority access'] },
                  { level: '51+', power: '51+ votes', benefits: ['Create proposals', 'Governance council eligible'] },
                ].map((tier, i) => {
                  const isCurrentTier = userLevel >= parseInt(tier.level.split('-')[0]) && 
                    (i === 3 || userLevel < parseInt(tier.level.split('-')[1] || '999'));
                  
                  return (
                    <div 
                      key={tier.level} 
                      className={`p-4 rounded-xl border-2 ${
                        isCurrentTier 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isCurrentTier ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              Level {tier.level}
                              {isCurrentTier && (
                                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tier.power}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tier.benefits.map((benefit) => (
                          <span key={benefit} className="px-2 py-1 rounded-full bg-muted text-xs">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-ibmp-500" />
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-medium">{communityStats.totalMembers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Voters</span>
                  <span className="font-medium">{communityStats.activeVoters}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Participation Rate</span>
                  <span className="font-medium">{communityStats.participationRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Level</span>
                  <span className="font-medium">Level {userLevel}</span>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5 bg-gradient-to-br from-achievement-500/5 to-ibmp-500/5 border-achievement-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-achievement-500" />
                Level Up to Vote More
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete courses, earn achievements, and engage with the community to increase your level and voting power.
              </p>
              <button className="w-full btn-primary">View Courses</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

