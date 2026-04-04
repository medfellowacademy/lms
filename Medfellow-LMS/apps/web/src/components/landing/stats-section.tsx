'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, GraduationCap, Globe, Award, Clock, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Active Learners',
    description: 'Doctors learning with us',
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    icon: GraduationCap,
    value: 50,
    suffix: '+',
    label: 'Courses',
    description: 'Across all specialties',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Award,
    value: 95,
    suffix: '%',
    label: 'Pass Rate',
    description: 'First attempt success',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Globe,
    value: 30,
    suffix: '+',
    label: 'Countries',
    description: 'Global reach',
    iconBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    icon: Clock,
    value: 500,
    suffix: 'K+',
    label: 'Learning Hours',
    description: 'Total platform hours',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: TrendingUp,
    value: 5000,
    suffix: '+',
    label: 'Certificates Issued',
    description: 'Verified completions',
    iconBg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const steps = 55;
    const stepMs = 2000 / steps;
    const inc = value / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= value) { setDisplay(value); clearInterval(timer); }
      else               { setDisplay(cur); }
    }, stepMs);
    return () => clearInterval(timer);
  }, [value, inView]);

  return <span>{value % 1 !== 0 ? display.toFixed(1) : Math.floor(display)}{suffix}</span>;
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 section-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="heading-lg font-display font-bold text-slate-900 dark:text-white mb-4 text-balance">
            Trusted by{' '}
            <span className="gradient-text">Medical Professionals</span>{' '}
            Worldwide
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Real-time metrics from our platform as doctors around the world achieve their goals.
          </p>
        </motion.div>

        {/* Stats grid — 2 col mobile, 3 col tablet, 6 col desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09 }}
              className="card-interactive p-5 flex flex-col items-center text-center group"
            >
              <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
              </div>
              <p className="text-2xl lg:text-3xl font-display font-bold gradient-text mb-0.5">
                <AnimatedNumber value={s.value} suffix={s.suffix} inView={inView} />
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-0.5">{s.label}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Live data · Updated in real-time</span>
        </motion.div>
      </div>
    </section>
  );
}
