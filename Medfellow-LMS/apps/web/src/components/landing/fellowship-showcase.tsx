'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Stethoscope,
  Activity,
  Pill,
  Syringe,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react';

const fellowships = [
  {
    id: 'cardiology',
    icon: Heart,
    title: 'Interventional Cardiology',
    duration: '18 months',
    students: '2,847',
    rating: 4.9,
    price: '$2,999',
    color: 'from-critical-500 to-critical-600',
    bgColor: 'critical',
    image: '/images/cardiology.jpg',
    highlights: [
      'Advanced PCI techniques',
      'Structural heart interventions',
      'Hemodynamic support devices',
      'Case-based assessments',
    ],
    instructor: {
      name: 'User Name',
      role: 'Chief of Cardiology, Stanford',
      image: '/images/instructors/chen.jpg',
    },
  },
  {
    id: 'neurosurgery',
    icon: Brain,
    title: 'Neurosurgical Oncology',
    duration: '24 months',
    students: '1,234',
    rating: 4.95,
    price: '$3,999',
    color: 'from-neural-500 to-neural-600',
    bgColor: 'neural',
    image: '/images/neurosurgery.jpg',
    highlights: [
      'Awake craniotomy techniques',
      'Intraoperative MRI navigation',
      'Stereotactic radiosurgery',
      'Interactive case studies',
    ],
    instructor: {
      name: 'User Name',
      role: 'Neurosurgery Director, Mayo Clinic',
      image: '/images/instructors/miller.jpg',
    },
  },
  {
    id: 'orthopedics',
    icon: Bone,
    title: 'Sports Medicine & Arthroscopy',
    duration: '12 months',
    students: '3,456',
    rating: 4.85,
    price: '$2,499',
    color: 'from-ibmp-500 to-ibmp-600',
    bgColor: 'ibmp',
    image: '/images/orthopedics.jpg',
    highlights: [
      'ACL reconstruction mastery',
      'Rotator cuff repair',
      'Cartilage restoration',
      'Video-guided techniques',
    ],
    instructor: {
      name: 'User Name',
      role: 'Team Physician, NBA',
      image: '/images/instructors/torres.jpg',
    },
  },
  {
    id: 'ophthalmology',
    icon: Eye,
    title: 'Retinal Surgery',
    duration: '15 months',
    students: '987',
    rating: 4.92,
    price: '$3,499',
    color: 'from-bio-500 to-bio-600',
    bgColor: 'bio',
    image: '/images/ophthalmology.jpg',
    highlights: [
      'Vitreoretinal surgery',
      'Diabetic retinopathy management',
      'Macular hole repair',
      'Step-by-step video training',
    ],
    instructor: {
      name: 'User Name',
      role: 'Retina Specialist, Bascom Palmer',
      image: '/images/instructors/patel.jpg',
    },
  },
  {
    id: 'pediatrics',
    icon: Baby,
    title: 'Pediatric Critical Care',
    duration: '18 months',
    students: '1,567',
    rating: 4.88,
    price: '$2,799',
    color: 'from-health-500 to-health-600',
    bgColor: 'health',
    image: '/images/pediatrics.jpg',
    highlights: [
      'PICU management protocols',
      'Pediatric ECMO',
      'Neonatal resuscitation',
      'Simulation-based learning',
    ],
    instructor: {
      name: 'User Name',
      role: 'PICU Director, Boston Children\'s',
      image: '/images/instructors/wong.jpg',
    },
  },
  {
    id: 'emergency',
    icon: Activity,
    title: 'Emergency Medicine Leadership',
    duration: '12 months',
    students: '4,123',
    rating: 4.87,
    price: '$1,999',
    color: 'from-achievement-500 to-achievement-600',
    bgColor: 'achievement',
    image: '/images/emergency.jpg',
    highlights: [
      'Mass casualty management',
      'Toxicology emergencies',
      'Trauma team leadership',
      'Practical case scenarios',
    ],
    instructor: {
      name: 'Dr. Robert Kim',
      role: 'ED Director, Johns Hopkins',
      image: '/images/instructors/kim.jpg',
    },
  },
];

export function FellowshipShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const selectedFellowship = fellowships[selectedIndex];

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev + 1) % fellowships.length);
  };

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev - 1 + fellowships.length) % fellowships.length);
  };

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-ibmp-500/5 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-ibmp-500/30 mb-6"
          >
            <Award className="w-4 h-4 text-ibmp-400" />
            <span className="text-sm font-medium">200+ Specialty Programs</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            World-Class{' '}
            <span className="gradient-text">Fellowship Programs</span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Learn from the world's top medical institutions. Each program includes
            video lectures, interactive assessments, and verified 
            certificates.
          </p>
        </motion.div>

        {/* Featured Fellowship */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${selectedFellowship.color} rounded-3xl blur-xl opacity-30`} />
            
            <div className="relative glass-card rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Left - Visual */}
                <div className={`relative h-64 lg:h-auto bg-gradient-to-br ${selectedFellowship.color} p-8 flex flex-col justify-between`}>
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                      <Globe className="w-4 h-4" />
                      Globally Recognized
                    </div>
                  </div>

                  <div className="relative">
                    <selectedFellowship.icon className="w-20 h-20 text-white/90 mb-4" />
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                      {selectedFellowship.title}
                    </h3>
                    <p className="text-white/80">
                      {selectedFellowship.duration} • {selectedFellowship.students} students enrolled
                    </p>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Right - Details */}
                <div className="p-8 lg:p-10">
                  {/* Instructor */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">{selectedFellowship.instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedFellowship.instructor.role}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-4 h-4 text-achievement-500 fill-achievement-500" />
                      <span className="font-semibold">{selectedFellowship.rating}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3 mb-8">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      What You'll Learn
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedFellowship.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 text-${selectedFellowship.bgColor}-500`} />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-semibold">{selectedFellowship.duration}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-semibold">{selectedFellowship.students}</div>
                      <div className="text-xs text-muted-foreground">Enrolled</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <Shield className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-semibold">NFT Cert</div>
                      <div className="text-xs text-muted-foreground">Blockchain</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    <a
                      href={`/programs/${selectedFellowship.id}`}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${selectedFellowship.color} text-white font-semibold hover:shadow-lg transition-all`}
                    >
                      Enroll Now • {selectedFellowship.price}
                    </a>
                    <button className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fellowship Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {fellowships.map((fellowship, index) => (
            <button
              key={fellowship.id}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex-shrink-0 w-48 p-4 rounded-xl border transition-all duration-300 ${
                selectedIndex === index
                  ? `border-${fellowship.bgColor}-500/50 bg-${fellowship.bgColor}-500/10`
                  : 'border-border/50 bg-card/50 hover:border-border'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fellowship.color} flex items-center justify-center mb-3`}
              >
                <fellowship.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-sm text-left line-clamp-2">
                {fellowship.title}
              </h4>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-achievement-500 fill-achievement-500" />
                {fellowship.rating}
              </div>
            </button>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/programs"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Browse all 200+ fellowship programs
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

