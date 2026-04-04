'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  Heart,
  Brain,
  Bone,
} from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'User Name',
    role: 'Interventional Cardiologist',
    location: 'Mumbai, India',
    workplace: 'Apollo Hospitals',
    avatar: '/avatars/priya.jpg',
    fellowship: 'Interventional Cardiology',
    fellowshipIcon: Heart,
    rating: 5,
    quote: "MedFellow Academy's structured courses and case-based assessments completely transformed how I learned complex PCI techniques. The video lectures and quizzes helped me identify gaps I didn't even know I had.",
    stats: {
      salaryIncrease: '+180%',
      timeToPromotion: '8 months',
      casesCompleted: '500+',
    },
    beforeAfter: {
      before: 'General Medicine Resident',
      after: 'Lead Cardiologist',
    },
  },
  {
    id: 2,
    name: 'Dr. Marcus Johnson',
    role: 'Neurosurgeon',
    location: 'Houston, Texas',
    workplace: 'MD Anderson Cancer Center',
    avatar: '/avatars/marcus.jpg',
    fellowship: 'Neurosurgical Oncology',
    fellowshipIcon: Brain,
    rating: 5,
    quote: "The certificates from MedFellow Academy were a game-changer. When I applied to MD Anderson, they recognized my course completions immediately. The structured curriculum gave me a real competitive edge.",
    stats: {
      salaryIncrease: '+220%',
      timeToPromotion: '6 months',
      casesCompleted: '300+',
    },
    beforeAfter: {
      before: 'General Surgery Fellow',
      after: 'Attending Neurosurgeon',
    },
  },
  {
    id: 3,
    name: 'User Name',
    role: 'Sports Medicine Specialist',
    location: 'Warsaw, Poland',
    workplace: 'Polish Olympic Committee',
    avatar: '/avatars/elena.jpg',
    fellowship: 'Sports Medicine & Arthroscopy',
    fellowshipIcon: Bone,
    rating: 5,
    quote: "As a non-native English speaker, the well-structured video content with clear terminology was incredibly helpful. The quizzes after each module ensured I truly understood the material. I went from a small clinic to treating Olympic athletes.",
    stats: {
      salaryIncrease: '+350%',
      timeToPromotion: '24 months',
      casesCompleted: '800+',
    },
    beforeAfter: {
      before: 'Rural Clinic Physician',
      after: 'Olympic Team Doctor',
    },
  },
  {
    id: 4,
    name: 'Dr. Aisha Mohammed',
    role: 'Pediatric Intensivist',
    location: 'Dubai, UAE',
    workplace: 'Dubai Healthcare City',
    avatar: '/avatars/aisha.jpg',
    fellowship: 'Pediatric Critical Care',
    fellowshipIcon: Heart,
    rating: 5,
    quote: "The community discussions and study groups on MedFellow made learning so much more engaging. Connecting with doctors worldwide while going through the same courses was invaluable. I made connections I'll have for life.",
    stats: {
      salaryIncrease: '+200%',
      timeToPromotion: '12 months',
      casesCompleted: '650+',
    },
    beforeAfter: {
      before: 'Pediatric Resident',
      after: 'PICU Department Head',
    },
  },
  {
    id: 5,
    name: 'Dr. Takeshi Yamamoto',
    role: 'Robotic Surgeon',
    location: 'Tokyo, Japan',
    workplace: 'University of Tokyo Hospital',
    avatar: '/avatars/takeshi.jpg',
    fellowship: 'Robotic Surgery',
    fellowshipIcon: Brain,
    rating: 5,
    quote: "The step-by-step video courses were outstanding. I studied hundreds of procedures and techniques before my first real console time. My attending said I had hands-on knowledge beyond my experience level. MedFellow accelerated my career by years.",
    stats: {
      salaryIncrease: '+280%',
      timeToPromotion: '10 months',
      casesCompleted: '400+',
    },
    beforeAfter: {
      before: 'General Surgery Resident',
      after: 'Lead Robotic Surgeon',
    },
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-achievement-500 fill-achievement-500'
              : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return (prev + 1) % testimonials.length;
      }
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
  };

  // Auto-play
  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [isInView, currentIndex]);

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-achievement-500/5 to-transparent" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-achievement-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-ibmp-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-achievement-500/30 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-achievement-400" />
            <span className="text-sm font-medium">Success Stories</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            Careers{' '}
            <span className="gradient-text-gold">Transformed</span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Real doctors, real results. See how MedFellow Academy graduates are advancing 
            their careers at the world's leading institutions.
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-achievement-500/30 via-ibmp-500/30 to-neural-500/30 rounded-3xl blur-xl opacity-50" />

            <div className="relative glass-card rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-5"
                >
                  {/* Left - Profile */}
                  <div className="lg:col-span-2 p-8 lg:p-10 bg-gradient-to-br from-muted/50 to-transparent border-r border-border/50">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                      {/* Avatar */}
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-3xl font-bold text-white">
                          {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-achievement-500 flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Name & Role */}
                      <h3 className="text-xl font-semibold">{currentTestimonial.name}</h3>
                      <p className="text-primary font-medium">{currentTestimonial.role}</p>
                      
                      {/* Location & Workplace */}
                      <div className="space-y-2 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {currentTestimonial.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {currentTestimonial.workplace}
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          {currentTestimonial.fellowship}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mt-4">
                        <StarRating rating={currentTestimonial.rating} />
                      </div>

                      {/* Before/After */}
                      <div className="mt-6 w-full">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Career Transformation
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                            <span className="text-sm text-muted-foreground line-through">
                              {currentTestimonial.beforeAfter.before}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-health-500" />
                            <span className="text-sm font-medium text-health-500">
                              {currentTestimonial.beforeAfter.after}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right - Quote & Stats */}
                  <div className="lg:col-span-3 p-8 lg:p-10">
                    {/* Quote */}
                    <div className="relative mb-8">
                      <Quote className="absolute -top-4 -left-2 w-12 h-12 text-achievement-500/20" />
                      <blockquote className="text-lg lg:text-xl leading-relaxed pl-6">
                        "{currentTestimonial.quote}"
                      </blockquote>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-health-500/10 border border-health-500/20">
                        <div className="text-2xl font-display font-bold text-health-500">
                          {currentTestimonial.stats.salaryIncrease}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Salary Increase
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-ibmp-500/10 border border-ibmp-500/20">
                        <div className="text-2xl font-display font-bold text-ibmp-500">
                          {currentTestimonial.stats.timeToPromotion}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          To Promotion
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-neural-500/10 border border-neural-500/20">
                        <div className="text-2xl font-display font-bold text-neural-500">
                          {currentTestimonial.stats.casesCompleted}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          VR Cases Done
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 h-2 rounded-full bg-achievement-500'
                        : 'w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Our graduates work at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['Mayo Clinic', 'Stanford Health', 'Johns Hopkins', 'Cleveland Clinic', 'Mass General'].map((name) => (
              <div key={name} className="text-lg font-display font-semibold text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

