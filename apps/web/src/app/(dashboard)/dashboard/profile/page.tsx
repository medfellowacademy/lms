'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  Edit3,
  Camera,
  Award,
  Trophy,
  Zap,
  BookOpen,
  Brain,
  Heart,
  Star,
  Share2,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Globe,
  Shield,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'user@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  institution: 'Stanford Medical Center',
  specialty: 'Interventional Cardiology',
  title: 'Cardiology Fellow',
  bio: 'Passionate interventional cardiologist focused on complex PCI and structural heart disease. Currently completing fellowship training at Stanford with a research interest in novel stent technologies.',
  joinDate: 'January 2024',
  verified: true,
  level: 12,
  xp: 14350,
  rank: 'Fellow',
  socialLinks: {
    twitter: '@drjohndoe',
    linkedin: 'linkedin.com/in/drjohndoe',
    website: 'drjohndoe.com',
  },
};

const stats = [
  { label: 'Total XP', value: '14,350', icon: Zap, color: 'achievement' },
  { label: 'Courses Completed', value: '3', icon: BookOpen, color: 'ibmp' },
  { label: 'Certificates', value: '3', icon: Award, color: 'neural' },
  { label: 'VR Surgeries', value: '45', icon: Brain, color: 'health' },
  { label: 'Learning Hours', value: '156', icon: Clock, color: 'bio' },
  { label: 'Global Rank', value: '#127', icon: Trophy, color: 'critical' },
];

const achievements = [
  { name: 'Dedicated Learner', icon: Star, rarity: 'rare', date: '2024-02-20' },
  { name: 'Virtual Surgeon', icon: Heart, rarity: 'rare', date: '2024-03-10' },
  { name: 'Quiz Champion', icon: Trophy, rarity: 'epic', date: '2024-03-15' },
  { name: 'AI Apprentice', icon: Brain, rarity: 'rare', date: '2024-02-28' },
];

const certificates = [
  {
    name: 'Basic PCI Certification',
    issueDate: '2024-03-01',
    credential: '0x1a2b...3c4d',
    status: 'verified',
  },
  {
    name: 'Cardiac Catheterization',
    issueDate: '2024-02-15',
    credential: '0x5e6f...7g8h',
    status: 'verified',
  },
  {
    name: 'ECG Interpretation Mastery',
    issueDate: '2024-01-20',
    credential: '0x9i0j...1k2l',
    status: 'verified',
  },
];

const rarityColors = {
  common: 'bg-steel-500/20 text-steel-500',
  rare: 'bg-ibmp-500/20 text-ibmp-500',
  epic: 'bg-neural-500/20 text-neural-500',
  legendary: 'bg-achievement-500/20 text-achievement-500',
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated overflow-hidden"
      >
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-ibmp-500 via-neural-500 to-bio-500 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <button className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-background">
                {userData.firstName[0]}{userData.lastName[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-primary text-primary-foreground">
                <Camera className="w-3 h-3" />
              </button>
              {/* Level Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-achievement-500 text-white text-xs font-bold">
                Lv.{userData.level}
              </div>
            </div>

            {/* Name & Title */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold">
                  Dr. {userData.firstName} {userData.lastName}
                </h1>
                {userData.verified && (
                  <CheckCircle2 className="w-5 h-5 text-ibmp-500" />
                )}
              </div>
              <p className="text-muted-foreground">{userData.title}</p>
              <p className="text-sm text-primary">{userData.specialty}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="btn-outline py-2 px-4 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Profile
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary py-2 px-4 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground mb-6">{userData.bio}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span>{userData.institution}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{userData.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Joined {userData.joinDate}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            {userData.socialLinks.twitter && (
              <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
                {userData.socialLinks.twitter}
              </a>
            )}
            {userData.socialLinks.linkedin && (
              <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {userData.socialLinks.website && (
              <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
                {userData.socialLinks.website}
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-interactive p-4 text-center"
          >
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-achievement-500" />
              Recent Achievements
            </h2>
            <a href="/dashboard/achievements" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className={`w-10 h-10 rounded-xl ${rarityColors[achievement.rarity as keyof typeof rarityColors]} flex items-center justify-center`}>
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.date}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                  {achievement.rarity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-neural-500" />
              NFT Certificates
            </h2>
            <a href="/dashboard/certificates" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>

          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-500/20 to-ibmp-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-neural-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Issued {cert.issueDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-health-500 text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {cert.credential}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-bio-500" />
          Recent Activity
        </h2>

        <div className="space-y-4">
          {[
            { action: 'Completed lesson', item: 'Rotational Atherectomy', time: '2 hours ago', xp: 150 },
            { action: 'Passed quiz', item: 'Complex PCI Assessment', time: '5 hours ago', xp: 200 },
            { action: 'VR surgery completed', item: 'Balloon Angioplasty Simulation', time: 'Yesterday', xp: 300 },
            { action: 'Achievement unlocked', item: '7-Day Streak', time: 'Yesterday', xp: 500 },
            { action: 'Asked Dr. Nexus', item: 'CTO Techniques Discussion', time: '2 days ago', xp: 25 },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1">
                <span className="text-sm">
                  <span className="text-muted-foreground">{activity.action}: </span>
                  <span className="font-medium">{activity.item}</span>
                </span>
              </div>
              <span className="text-xs text-achievement-500">+{activity.xp} XP</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

