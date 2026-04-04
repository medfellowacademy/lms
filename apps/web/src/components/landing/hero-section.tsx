'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  Award,
  Shield,
  Star,
  GraduationCap,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

const rotatingFeatures = [
  'Expert-Led Video Courses',
  'Interactive Quizzes & Assessments',
  'Progress Tracking & Analytics',
  'Verified Global Certificates',
];

const stats = [
  { value: '10K+', label: 'Active Learners' },
  { value: '95%',  label: 'Pass Rate' },
  { value: '50+',  label: 'Courses' },
  { value: '200+', label: 'Expert Faculty' },
];

const trustedBy = [
  'Cleveland Clinic',
  'Mayo Clinic',
  'Johns Hopkins',
  'Stanford Health',
  'NHS',
];

const recentLearners = [
  { initials: 'SC', color: 'from-emerald-500 to-teal-500' },
  { initials: 'MJ', color: 'from-blue-500 to-indigo-500' },
  { initials: 'EK', color: 'from-violet-500 to-purple-500' },
];

export default function HeroSection() {
  const [featureIdx, setFeatureIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFeatureIdx((i) => (i + 1) % rotatingFeatures.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />

      {/* Soft ambient orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#2d9596]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#2d9596]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ─── Left: Copy ─── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d9596] animate-pulse" />
              Your Medical Learning Platform
            </motion.div>

            {/* Headline */}
            <h1 className="heading-xl font-display font-bold text-slate-900 dark:text-white mb-5 text-balance">
              Master Medicine with{' '}
              <span className="gradient-text">Expert‑Led</span> Courses
            </h1>

            {/* Sub */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-7 max-w-lg leading-relaxed">
              Join MedFellow Academy — the comprehensive medical learning platform built
              for physicians, fellows, and residents who want to excel.
            </p>

            {/* Rotating feature */}
            <div className="flex items-center gap-3 mb-8 h-7">
              <CheckCircle2 className="w-5 h-5 text-[#2d9596] flex-shrink-0" />
              <div className="overflow-hidden h-6 relative w-72">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={featureIdx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute text-slate-700 dark:text-slate-200 font-medium text-sm"
                  >
                    {rotatingFeatures[featureIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-outline px-6 py-3 text-base">
                <Play className="w-4 h-4" />
                Browse Courses
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#2d9596]" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#2d9596]" />
                Accredited
              </div>
            </div>
          </motion.div>

          {/* ─── Right: Dashboard preview card ─── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="relative"
          >
            {/* Floating "learners" chip */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 right-4 sm:right-8 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-soft text-sm font-medium z-10"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-1.5">
                {recentLearners.map((l) => (
                  <div
                    key={l.initials}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${l.color} border-2 border-white dark:border-slate-800 flex items-center justify-center`}
                  >
                    <span className="text-white text-[9px] font-bold">{l.initials}</span>
                  </div>
                ))}
              </div>
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">2,847 learning now</span>
            </motion.div>

            {/* Main card */}
            <div className="card-elevated p-6 sm:p-8 rounded-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">MedFellow Academy</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Medical Learning</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-7">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-center"
                  >
                    <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Progress bar preview */}
              <div className="mb-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Interventional Cardiology</span>
                  <span>68%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Advanced Cardiac Imaging</span>
                  <span>45%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1.2, delay: 0.65, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </div>

              {/* Testimonial snippet */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    SC
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">User Name</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      "MedFellow Academy helped me pass my boards on the first try!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Trusted By ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 lg:mt-20 pt-10 border-t border-slate-200/70 dark:border-slate-700/50"
        >
          <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
            Trusted by physicians at leading institutions worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
            {trustedBy.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
