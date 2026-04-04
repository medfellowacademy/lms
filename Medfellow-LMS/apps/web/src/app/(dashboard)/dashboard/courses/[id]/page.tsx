'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Download,
  Share2,
  Heart,
  MessageSquare,
  FileText,
  Video,
  Brain,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  List,
  X,
} from 'lucide-react';

// Mock course data
const courseData = {
  id: 1,
  title: 'Interventional Cardiology Fellowship',
  description: 'Master advanced PCI techniques, structural heart interventions, and hemodynamic support devices through immersive VR simulations and expert-led instruction.',
  longDescription: `This comprehensive fellowship program covers everything from basic coronary anatomy to advanced interventional techniques. You'll learn from world-renowned cardiologists and practice procedures in our state-of-the-art VR surgery lab.

The curriculum is designed to take you from foundational knowledge to expert-level procedural skills, with a focus on:
- Coronary intervention techniques
- Structural heart disease
- Hemodynamic support
- Complex PCI case management`,
  duration: '18 months',
  modules: 24,
  totalLessons: 156,
  totalHours: 89,
  students: 2847,
  rating: 4.9,
  reviews: 1256,
  level: 'Advanced',
  color: 'from-critical-500 to-critical-600',
  icon: Heart,
  instructor: {
    name: 'Dr. Sarah Chen',
    title: 'Chief of Interventional Cardiology',
    institution: 'Stanford Medical Center',
    bio: '20+ years of experience in complex PCI. Pioneer in structural heart interventions.',
    students: 15000,
    courses: 8,
    rating: 4.95,
  },
  progress: 68,
  completedLessons: 106,
  currentModule: 4,
  currentLesson: 3,
  xpEarned: 4850,
  certificateProgress: 68,
  features: ['VR Surgery Lab', 'AI Tutor', 'NFT Certificate', 'Live Sessions', 'Peer Review'],
  prerequisites: ['Basic Cardiology', 'ECG Interpretation', 'Cardiac Anatomy'],
};

const modules = [
  {
    id: 1,
    title: 'Foundations of Interventional Cardiology',
    lessons: 8,
    duration: '4h 30m',
    completed: true,
    progress: 100,
    lessons_list: [
      { id: 1, title: 'Introduction to Interventional Cardiology', duration: '25m', type: 'video', completed: true },
      { id: 2, title: 'History and Evolution of PCI', duration: '30m', type: 'video', completed: true },
      { id: 3, title: 'Coronary Anatomy Review', duration: '45m', type: 'video', completed: true },
      { id: 4, title: 'Cardiac Catheterization Basics', duration: '35m', type: 'video', completed: true },
      { id: 5, title: 'Module 1 Quiz', duration: '20m', type: 'quiz', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Diagnostic Angiography',
    lessons: 10,
    duration: '5h 15m',
    completed: true,
    progress: 100,
    lessons_list: [
      { id: 6, title: 'Angiographic Views and Projections', duration: '40m', type: 'video', completed: true },
      { id: 7, title: 'Image Interpretation', duration: '35m', type: 'video', completed: true },
      { id: 8, title: 'Lesion Assessment', duration: '45m', type: 'video', completed: true },
      { id: 9, title: 'VR Practice: Angiography', duration: '60m', type: 'vr', completed: true },
      { id: 10, title: 'Module 2 Assessment', duration: '30m', type: 'quiz', completed: true },
    ],
  },
  {
    id: 3,
    title: 'Basic PCI Techniques',
    lessons: 12,
    duration: '6h 45m',
    completed: true,
    progress: 100,
    lessons_list: [
      { id: 11, title: 'Wire Selection and Manipulation', duration: '40m', type: 'video', completed: true },
      { id: 12, title: 'Balloon Angioplasty', duration: '45m', type: 'video', completed: true },
      { id: 13, title: 'Stent Selection', duration: '35m', type: 'video', completed: true },
      { id: 14, title: 'VR Practice: Basic PCI', duration: '90m', type: 'vr', completed: true },
    ],
  },
  {
    id: 4,
    title: 'Complex PCI Procedures',
    lessons: 14,
    duration: '8h 20m',
    completed: false,
    progress: 65,
    current: true,
    lessons_list: [
      { id: 15, title: 'Chronic Total Occlusions', duration: '55m', type: 'video', completed: true },
      { id: 16, title: 'Bifurcation Lesions', duration: '50m', type: 'video', completed: true },
      { id: 17, title: 'Calcified Lesions', duration: '45m', type: 'video', completed: true },
      { id: 18, title: 'Rotational Atherectomy', duration: '40m', type: 'video', completed: false, current: true },
      { id: 19, title: 'VR Practice: Complex PCI', duration: '120m', type: 'vr', completed: false },
      { id: 20, title: 'Case Discussion: CTO', duration: '60m', type: 'live', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Hemodynamic Support',
    lessons: 10,
    duration: '5h 30m',
    completed: false,
    progress: 0,
    locked: false,
    lessons_list: [
      { id: 21, title: 'IABP Fundamentals', duration: '35m', type: 'video', completed: false },
      { id: 22, title: 'Impella Devices', duration: '45m', type: 'video', completed: false },
      { id: 23, title: 'ECMO in the Cath Lab', duration: '50m', type: 'video', completed: false },
    ],
  },
  {
    id: 6,
    title: 'Structural Heart Interventions',
    lessons: 16,
    duration: '9h 15m',
    completed: false,
    progress: 0,
    locked: true,
    lessons_list: [],
  },
];

export default function CourseDetailPage() {
  const params = useParams();
  const [showModuleList, setShowModuleList] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(2400); // 40 minutes in seconds

  const currentModule = modules.find((m) => m.current);
  const currentLesson = currentModule?.lessons_list?.find((l) => (l as any).current);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/courses"
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold">{courseData.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-achievement-500 fill-achievement-500" />
              {courseData.rating} ({courseData.reviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {courseData.students.toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {courseData.totalHours}h total
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player & Content */}
        <div className={`${showModuleList ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
          {/* Video Player */}
          <div className="card-elevated overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-steel-900 to-steel-950">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${courseData.color} flex items-center justify-center mx-auto mb-4`}>
                    <courseData.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    {currentLesson?.title || 'Select a lesson to start'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    Module {currentModule?.id}: {currentModule?.title}
                  </p>
                </div>
              </div>

              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
              </button>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-1 bg-white/20 rounded-full cursor-pointer group">
                    <div
                      className="h-full bg-primary rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-white/80 hover:text-white">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white/80 hover:text-white"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button className="text-white/80 hover:text-white">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/80 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-white/80 text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-white/80 hover:text-white">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowModuleList(!showModuleList)}
                      className="text-white/80 hover:text-white lg:hidden"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <button className="text-white/80 hover:text-white">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-critical-500/10 text-critical-500 text-xs font-medium">
                      Module {currentModule?.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                      Lesson {currentLesson?.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {currentLesson?.title || 'Rotational Atherectomy'}
                  </h2>
                  <p className="text-muted-foreground">
                    Learn the indications, techniques, and complications of rotational atherectomy
                    for heavily calcified coronary lesions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Ask Dr. Nexus
                  </button>
                  <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              </div>

              {/* Lesson Resources */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold mb-3">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm transition-colors">
                    <FileText className="w-4 h-4" />
                    Lecture Slides
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    PDF Notes
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neural-500/10 hover:bg-neural-500/20 text-neural-500 text-sm transition-colors">
                    <Brain className="w-4 h-4" />
                    VR Practice Available
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Your Progress</h3>
              <span className="text-sm text-muted-foreground">
                {courseData.completedLessons}/{courseData.totalLessons} lessons
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${courseData.progress}%` }}
                transition={{ duration: 1 }}
                className={`h-full bg-gradient-to-r ${courseData.color} rounded-full`}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-xl font-bold text-ibmp-500">{courseData.progress}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-xl font-bold text-achievement-500">{courseData.xpEarned}</div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-xl font-bold text-neural-500">45</div>
                <div className="text-xs text-muted-foreground">VR Sessions</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-xl font-bold text-health-500">92%</div>
                <div className="text-xs text-muted-foreground">Quiz Avg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Module List Sidebar */}
        <AnimatePresence>
          {showModuleList && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="card-elevated p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Course Content</h3>
                  <button
                    onClick={() => setShowModuleList(false)}
                    className="p-1 hover:bg-muted rounded-lg lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {modules.map((module) => (
                    <div key={module.id} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                        className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                          module.current ? 'bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            module.completed
                              ? 'bg-health-500 text-white'
                              : module.locked
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-ibmp-500/10 text-ibmp-500'
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : module.locked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-bold">{module.id}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{module.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {module.lessons} lessons • {module.duration}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform ${
                            expandedModule === module.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedModule === module.id && module.lessons_list && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="p-2 space-y-1">
                              {module.lessons_list.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                                    (lesson as any).current
                                      ? 'bg-primary text-primary-foreground'
                                      : lesson.completed
                                      ? 'text-muted-foreground hover:bg-muted/50'
                                      : 'hover:bg-muted/50'
                                  }`}
                                >
                                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                    {lesson.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-health-500" />
                                    ) : lesson.type === 'video' ? (
                                      <Video className="w-4 h-4" />
                                    ) : lesson.type === 'quiz' ? (
                                      <Target className="w-4 h-4" />
                                    ) : lesson.type === 'vr' ? (
                                      <Brain className="w-4 h-4" />
                                    ) : (
                                      <MessageSquare className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm truncate">{lesson.title}</div>
                                  </div>
                                  <span className="text-xs opacity-70">{lesson.duration}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Progress */}
              <div className="card-elevated p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-achievement-500/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-achievement-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">NFT Certificate</div>
                    <div className="text-xs text-muted-foreground">
                      {courseData.certificateProgress}% to unlock
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-achievement-500 to-achievement-600 rounded-full"
                    style={{ width: `${courseData.certificateProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

