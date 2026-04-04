'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Flame,
  Zap,
  Target,
  BookOpen,
  Brain,
  Award,
  Heart,
  Clock,
  Users,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  Crown,
  Medal,
  Gem,
  Shield,
  Sword,
  GraduationCap,
  Microscope,
  Activity,
} from 'lucide-react';

// RPG Progression Data
const playerStats = {
  level: 12,
  currentXP: 4850,
  xpToNextLevel: 5000,
  totalXP: 14350,
  rank: 'Fellow',
  nextRank: 'Attending',
  rankProgress: 72,
  streak: 7,
  longestStreak: 21,
  totalHoursLearned: 156,
  coursesCompleted: 3,
  certificatesEarned: 3,
  vrSurgeries: 45,
  quizzesPassed: 128,
  aiConversations: 234,
};

const ranks = [
  { name: 'Intern', level: 1, color: 'steel', icon: BookOpen },
  { name: 'Resident', level: 5, color: 'ibmp', icon: Stethoscope },
  { name: 'Fellow', level: 10, color: 'neural', icon: Brain, current: true },
  { name: 'Attending', level: 15, color: 'achievement', icon: Award },
  { name: 'Professor', level: 20, color: 'health', icon: GraduationCap },
  { name: 'Chief', level: 25, color: 'critical', icon: Crown },
];

import { Stethoscope } from 'lucide-react';

const skillTrees = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: Heart,
    color: 'critical',
    totalPoints: 50,
    earnedPoints: 32,
    skills: [
      { name: 'Anatomy', level: 5, maxLevel: 5, unlocked: true },
      { name: 'ECG', level: 4, maxLevel: 5, unlocked: true },
      { name: 'PCI', level: 3, maxLevel: 5, unlocked: true },
      { name: 'Structural', level: 2, maxLevel: 5, unlocked: true },
      { name: 'Electrophysiology', level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    icon: Microscope,
    color: 'ibmp',
    totalPoints: 40,
    earnedPoints: 18,
    skills: [
      { name: 'Lab Values', level: 4, maxLevel: 5, unlocked: true },
      { name: 'Imaging', level: 3, maxLevel: 5, unlocked: true },
      { name: 'Differential Dx', level: 2, maxLevel: 5, unlocked: true },
      { name: 'Pathology', level: 1, maxLevel: 5, unlocked: false },
    ],
  },
  {
    id: 'procedures',
    name: 'Procedures',
    icon: Activity,
    color: 'neural',
    totalPoints: 45,
    earnedPoints: 22,
    skills: [
      { name: 'Central Lines', level: 4, maxLevel: 5, unlocked: true },
      { name: 'Intubation', level: 3, maxLevel: 5, unlocked: true },
      { name: 'VR Surgery', level: 3, maxLevel: 5, unlocked: true },
      { name: 'Cath Lab', level: 2, maxLevel: 5, unlocked: true },
    ],
  },
];

const achievements = [
  // Streaks
  { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Star, rarity: 'common', earned: true, date: '2024-01-15', xp: 50 },
  { id: 2, name: 'Dedicated Learner', description: '7-day learning streak', icon: Flame, rarity: 'common', earned: true, date: '2024-02-20', xp: 100 },
  { id: 3, name: 'Unstoppable', description: '14-day learning streak', icon: Flame, rarity: 'rare', earned: true, date: '2024-03-01', xp: 250 },
  { id: 4, name: 'Legendary Streak', description: '30-day learning streak', icon: Flame, rarity: 'legendary', earned: false, progress: 70, xp: 1000 },
  
  // Learning
  { id: 5, name: 'Knowledge Seeker', description: 'Complete 10 modules', icon: BookOpen, rarity: 'common', earned: true, date: '2024-02-01', xp: 100 },
  { id: 6, name: 'Scholar', description: 'Complete 50 modules', icon: BookOpen, rarity: 'rare', earned: true, date: '2024-03-15', xp: 500 },
  { id: 7, name: 'Master of Knowledge', description: 'Complete 100 modules', icon: BookOpen, rarity: 'epic', earned: false, progress: 68, xp: 1500 },
  
  // AI Tutor
  { id: 8, name: 'Curious Mind', description: 'Ask Dr. Nexus 50 questions', icon: Brain, rarity: 'common', earned: true, date: '2024-01-20', xp: 100 },
  { id: 9, name: 'AI Apprentice', description: 'Have 100 AI conversations', icon: Sparkles, rarity: 'rare', earned: true, date: '2024-02-28', xp: 300 },
  { id: 10, name: 'AI Master', description: 'Have 500 AI conversations', icon: Sparkles, rarity: 'epic', earned: false, progress: 47, xp: 1000 },
  
  // VR Surgery
  { id: 11, name: 'Virtual Surgeon', description: 'Complete 10 VR surgeries', icon: Activity, rarity: 'rare', earned: true, date: '2024-03-10', xp: 500 },
  { id: 12, name: 'VR Virtuoso', description: 'Complete 50 VR surgeries', icon: Activity, rarity: 'epic', earned: false, progress: 90, xp: 2000 },
  { id: 13, name: 'Digital Da Vinci', description: 'Perfect score on 10 VR surgeries', icon: Crown, rarity: 'legendary', earned: false, progress: 40, xp: 5000 },
  
  // Quizzes
  { id: 14, name: 'Quiz Whiz', description: 'Pass 25 quizzes', icon: Target, rarity: 'common', earned: true, date: '2024-02-15', xp: 150 },
  { id: 15, name: 'Perfect Score', description: 'Get 100% on any quiz', icon: Star, rarity: 'rare', earned: true, date: '2024-02-22', xp: 300 },
  { id: 16, name: 'Quiz Champion', description: 'Pass 100 quizzes with 90%+', icon: Trophy, rarity: 'epic', earned: false, progress: 78, xp: 2000 },
  
  // Certificates
  { id: 17, name: 'Certified', description: 'Earn your first certificate', icon: Award, rarity: 'rare', earned: true, date: '2024-03-01', xp: 1000 },
  { id: 18, name: 'Credential Collector', description: 'Earn 5 certificates', icon: Award, rarity: 'epic', earned: false, progress: 60, xp: 5000 },
  { id: 19, name: 'Board Certified', description: 'Complete a fellowship', icon: GraduationCap, rarity: 'legendary', earned: false, progress: 68, xp: 10000 },
  
  // Community
  { id: 20, name: 'Helper', description: 'Answer 10 community questions', icon: Users, rarity: 'common', earned: true, date: '2024-02-10', xp: 100 },
  { id: 21, name: 'Mentor', description: 'Help 50 fellow students', icon: Users, rarity: 'rare', earned: false, progress: 34, xp: 500 },
];

const rarityColors = {
  common: { bg: 'bg-steel-500/20', text: 'text-steel-500', border: 'border-steel-500/30' },
  rare: { bg: 'bg-ibmp-500/20', text: 'text-ibmp-500', border: 'border-ibmp-500/30' },
  epic: { bg: 'bg-neural-500/20', text: 'text-neural-500', border: 'border-neural-500/30' },
  legendary: { bg: 'bg-achievement-500/20', text: 'text-achievement-500', border: 'border-achievement-500/30' },
};

const dailyChallenges = [
  { id: 1, name: 'Complete 3 lessons', progress: 2, target: 3, xp: 50, completed: false },
  { id: 2, name: 'Score 90% on a quiz', progress: 1, target: 1, xp: 75, completed: true },
  { id: 3, name: 'Ask Dr. Nexus a question', progress: 1, target: 1, xp: 25, completed: true },
  { id: 4, name: '30 min VR surgery practice', progress: 15, target: 30, xp: 100, completed: false },
];

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'earned' | 'locked'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === 'earned') return a.earned;
    if (selectedCategory === 'locked') return !a.earned;
    return true;
  });

  const earnedCount = achievements.filter((a) => a.earned).length;
  const xpProgress = (playerStats.currentXP / playerStats.xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Player Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card-elevated p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar & Level */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-3xl font-bold text-white">
                {playerStats.level}
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-achievement-500 text-white text-xs font-bold">
                LEVEL
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-display font-bold">{playerStats.rank}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">{playerStats.nextRank}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {playerStats.xpToNextLevel - playerStats.currentXP} XP until next level
                </p>
              </div>

              {/* XP Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{playerStats.currentXP.toLocaleString()} XP</span>
                  <span className="text-muted-foreground">{playerStats.xpToNextLevel.toLocaleString()} XP</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-ibmp-500 to-neural-500 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                  </motion.div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-achievement-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-achievement-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{playerStats.totalXP.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total XP</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-critical-500/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-critical-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{playerStats.streak} days</div>
                    <div className="text-xs text-muted-foreground">Current Streak</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-health-500/10 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-health-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{earnedCount}/{achievements.length}</div>
                    <div className="text-xs text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-ibmp-500" />
            Daily Challenges
          </h3>
          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <div key={challenge.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${challenge.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {challenge.name}
                  </span>
                  <span className="text-xs text-achievement-500">+{challenge.xp} XP</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      challenge.completed ? 'bg-health-500' : 'bg-ibmp-500'
                    }`}
                    style={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-achievement-500/10 border border-achievement-500/30 text-center">
            <span className="text-sm font-medium text-achievement-500">
              +{dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0)} XP earned today
            </span>
          </div>
        </motion.div>
      </div>

      {/* Rank Progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-6"
      >
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Crown className="w-5 h-5 text-achievement-500" />
          Rank Progression
        </h3>
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-gradient-to-r from-ibmp-500 to-neural-500 transition-all"
              style={{ width: `${((playerStats.level - 1) / 24) * 100}%` }}
            />
          </div>

          {ranks.map((rank, index) => {
            const isUnlocked = playerStats.level >= rank.level;
            const isCurrent = rank.current;
            
            return (
              <div key={rank.name} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? `bg-${rank.color}-500 text-white ring-4 ring-${rank.color}-500/30`
                      : isUnlocked
                      ? `bg-${rank.color}-500/20 text-${rank.color}-500`
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <rank.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {rank.name}
                </span>
                <span className="text-[10px] text-muted-foreground">Lv. {rank.level}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Skill Trees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neural-500" />
          Skill Trees
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {skillTrees.map((tree) => (
            <div
              key={tree.id}
              className={`p-5 rounded-xl bg-${tree.color}-500/5 border border-${tree.color}-500/20`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${tree.color}-500/20 flex items-center justify-center`}>
                  <tree.icon className={`w-5 h-5 text-${tree.color}-500`} />
                </div>
                <div>
                  <h4 className="font-semibold">{tree.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {tree.earnedPoints}/{tree.totalPoints} points
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {tree.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${!skill.unlocked ? 'text-muted-foreground' : ''}`}>
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.level
                                ? `bg-${tree.color}-500`
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-achievement-500" />
            Achievements
          </h2>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted">
            {(['all', 'earned', 'locked'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const rarity = rarityColors[achievement.rarity as keyof typeof rarityColors];
            
            return (
              <motion.button
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => setSelectedAchievement(achievement)}
                className={`relative p-4 rounded-xl border transition-all text-left ${
                  achievement.earned
                    ? `${rarity.bg} ${rarity.border} hover:scale-105`
                    : 'bg-muted/50 border-border hover:border-muted-foreground/50'
                }`}
              >
                {/* Rarity Badge */}
                {achievement.earned && (
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rarity.bg} ${rarity.text}`}>
                    {achievement.rarity}
                  </span>
                )}

                <div className={`w-12 h-12 rounded-xl ${achievement.earned ? rarity.bg : 'bg-muted'} flex items-center justify-center mb-3`}>
                  {achievement.earned ? (
                    <achievement.icon className={`w-6 h-6 ${rarity.text}`} />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <h4 className={`font-semibold mb-1 ${!achievement.earned ? 'text-muted-foreground' : ''}`}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-achievement-500 font-medium">+{achievement.xp} XP</span>
                  {achievement.earned ? (
                    <CheckCircle2 className="w-4 h-4 text-health-500" />
                  ) : achievement.progress !== undefined ? (
                    <span className="text-xs text-muted-foreground">{achievement.progress}%</span>
                  ) : null}
                </div>

                {/* Progress bar for locked achievements */}
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/50 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md card-elevated p-6 text-center"
            >
              {(() => {
                const rarity = rarityColors[selectedAchievement.rarity as keyof typeof rarityColors];
                return (
                  <>
                    <div className={`w-20 h-20 rounded-2xl ${rarity.bg} flex items-center justify-center mx-auto mb-4`}>
                      <selectedAchievement.icon className={`w-10 h-10 ${rarity.text}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${rarity.bg} ${rarity.text}`}>
                      {selectedAchievement.rarity}
                    </span>
                    <h3 className="text-xl font-semibold mt-4 mb-2">{selectedAchievement.name}</h3>
                    <p className="text-muted-foreground mb-4">{selectedAchievement.description}</p>
                    
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-achievement-500">+{selectedAchievement.xp}</div>
                        <div className="text-xs text-muted-foreground">XP Reward</div>
                      </div>
                      {selectedAchievement.earned && selectedAchievement.date && (
                        <div className="text-center">
                          <div className="text-lg font-semibold">{selectedAchievement.date}</div>
                          <div className="text-xs text-muted-foreground">Date Earned</div>
                        </div>
                      )}
                    </div>

                    {!selectedAchievement.earned && selectedAchievement.progress !== undefined && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{selectedAchievement.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${rarity.bg.replace('/20', '')} rounded-full`}
                            style={{ width: `${selectedAchievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedAchievement(null)}
                      className="btn-primary w-full"
                    >
                      {selectedAchievement.earned ? 'Awesome!' : 'Keep Going!'}
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

