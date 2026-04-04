'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  BookOpen,
  Target,
  BarChart3,
  Award,
  Video,
  Users,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Expert-Led Courses',
    description:
      'Learn from board-certified physicians with structured video courses, readings, and real clinical case studies.',
    accent: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    tag: 'Core',
    tagColor: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  {
    icon: Target,
    title: 'Quizzes & Assessments',
    description:
      'Test your knowledge with interactive quizzes, adaptive practice exams, and targeted clinical assessments.',
    accent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    tag: 'Interactive',
    tagColor: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Track your learning journey with detailed analytics, completion rates, and performance insights.',
    accent: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    tag: 'Analytics',
    tagColor: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-700',
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    description:
      'Earn recognized, verifiable certificates with QR codes upon course completion to showcase your expertise.',
    accent: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    tag: 'Verified',
    tagColor: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  {
    icon: Video,
    title: 'Video Lectures',
    description:
      'High-quality HD video content with bookmarks, notes, variable playback speed, and offline access.',
    accent: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    tag: 'HD Video',
    tagColor: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  {
    icon: Users,
    title: 'Community & Discussions',
    description:
      'Connect with fellow learners, join specialty study groups, and participate in moderated discussions.',
    accent: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    tag: 'Community',
    tagColor: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
  },
];

export default function FeaturesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 lg:py-28 section-alt" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Platform Features
          </span>
          <h2 className="heading-lg font-display font-bold text-slate-900 dark:text-white mb-4 text-balance">
            Everything You Need to Excel
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            World-class medical education powered by cutting-edge technology.
            Learn smarter, progress faster, and achieve more.
          </p>
        </motion.div>

        {/* ── Feature cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className={`group card-elevated p-6 transition-all duration-200 border ${f.hoverBorder} hover:-translate-y-1 hover:shadow-soft-lg`}
            >
              {/* Icon + tag row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${f.accent} flex items-center justify-center`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${f.tagColor}`}>
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>

              {/* Hover CTA */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Ready to transform your medical education?
          </p>
          <Link href="/dashboard" className="btn-primary px-7 py-3">
            Explore All Features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
