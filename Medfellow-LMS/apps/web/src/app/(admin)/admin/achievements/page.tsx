'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Trophy,
  Star,
  Target,
  Flame,
  Award,
  BookOpen,
  Brain,
  Users,
  Clock,
  CheckCircle2,
  MoreVertical,
  Copy,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

// Achievement categories
const categories = [
  { id: 'streak', name: 'Streaks', icon: Flame, color: 'orange' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: 'blue' },
  { id: 'mastery', name: 'Mastery', icon: Brain, color: 'purple' },
  { id: 'social', name: 'Social', icon: Users, color: 'green' },
  { id: 'special', name: 'Special', icon: Star, color: 'yellow' },
];

// Achievements data
const achievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    category: 'learning',
    icon: '🎯',
    xpReward: 100,
    rarity: 'common',
    unlockCount: 15420,
    isActive: true,
    requirement: { type: 'lessons_completed', value: 1 },
  },
  {
    id: '2',
    name: '7-Day Streak',
    description: 'Learn for 7 consecutive days',
    category: 'streak',
    icon: '🔥',
    xpReward: 500,
    rarity: 'uncommon',
    unlockCount: 8934,
    isActive: true,
    requirement: { type: 'streak_days', value: 7 },
  },
  {
    id: '3',
    name: 'Knowledge Seeker',
    description: 'Complete 10 courses',
    category: 'learning',
    icon: '📚',
    xpReward: 1000,
    rarity: 'rare',
    unlockCount: 3456,
    isActive: true,
    requirement: { type: 'courses_completed', value: 10 },
  },
  {
    id: '4',
    name: 'Perfect Score',
    description: 'Score 100% on any exam',
    category: 'mastery',
    icon: '💯',
    xpReward: 750,
    rarity: 'rare',
    unlockCount: 2134,
    isActive: true,
    requirement: { type: 'exam_score', value: 100 },
  },
  {
    id: '5',
    name: 'VR Pioneer',
    description: 'Complete 5 VR surgery simulations',
    category: 'mastery',
    icon: '🥽',
    xpReward: 1500,
    rarity: 'epic',
    unlockCount: 876,
    isActive: true,
    requirement: { type: 'vr_completions', value: 5 },
  },
  {
    id: '6',
    name: 'Community Leader',
    description: 'Help 50 other students',
    category: 'social',
    icon: '🤝',
    xpReward: 2000,
    rarity: 'epic',
    unlockCount: 234,
    isActive: true,
    requirement: { type: 'students_helped', value: 50 },
  },
  {
    id: '7',
    name: 'Cardiology Master',
    description: 'Complete all cardiology courses with 90%+ score',
    category: 'mastery',
    icon: '❤️',
    xpReward: 5000,
    rarity: 'legendary',
    unlockCount: 89,
    isActive: true,
    requirement: { type: 'specialty_mastery', value: 'cardiology' },
  },
  {
    id: '8',
    name: '365-Day Streak',
    description: 'Learn every day for a year',
    category: 'streak',
    icon: '👑',
    xpReward: 10000,
    rarity: 'legendary',
    unlockCount: 12,
    isActive: true,
    requirement: { type: 'streak_days', value: 365 },
  },
];

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  uncommon: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  rare: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  epic: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  legendary: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
};

const categoryColors: Record<string, string> = {
  orange: 'bg-orange-100 text-orange-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

export default function AchievementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRarity, setFilterRarity] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;
    const matchesRarity = filterRarity === 'all' || achievement.rarity === filterRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const totalUnlocks = achievements.reduce((sum, a) => sum + a.unlockCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2 text-gray-800">
            <Zap className="w-7 h-7 text-yellow-500" />
            Achievement Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create and manage gamification achievements
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Achievement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Achievements', value: achievements.length.toString(), icon: Trophy, color: 'text-yellow-500' },
          { label: 'Total Unlocks', value: (totalUnlocks / 1000).toFixed(1) + 'K', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Active', value: achievements.filter(a => a.isActive).length.toString(), icon: Zap, color: 'text-blue-500' },
          { label: 'Legendary', value: achievements.filter(a => a.rarity === 'legendary').length.toString(), icon: Star, color: 'text-purple-500' },
          { label: 'Avg XP Reward', value: Math.round(achievements.reduce((s, a) => s + a.xpReward, 0) / achievements.length).toString(), icon: Award, color: 'text-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilterCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              filterCategory === category.id
                ? `${categoryColors[category.color]} border border-current`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none"
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => {
          const rarityStyle = rarityColors[achievement.rarity];
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl bg-white border-2 ${rarityStyle.border} hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${rarityStyle.bg} ${rarityStyle.text}`}>
                    {achievement.rarity}
                  </span>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-1">{achievement.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-gray-700">+{achievement.xpReward.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{achievement.unlockCount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Target className="w-3 h-3" />
                  <span>{achievement.requirement.type.replace('_', ' ')}: {achievement.requirement.value}</span>
                </div>
                <button
                  className={`flex items-center gap-1 text-xs ${
                    achievement.isActive ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {achievement.isActive ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No achievements found matching your filters</p>
        </div>
      )}
    </div>
  );
}

