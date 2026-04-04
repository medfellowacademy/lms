'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Calendar,
  Moon,
  Sun,
  Activity,
  Heart,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Eye,
  Coffee,
  Battery,
  Wifi,
  Watch,
  LineChart,
  PieChart,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  GraduationCap,
  Briefcase,
  DollarSign,
  MapPin,
  Users,
} from 'lucide-react';

// 3D Digital Twin Visualization
function DigitalTwinAvatar({ focusLevel, stressLevel }: { focusLevel: number; stressLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  const color = focusLevel > 70 ? '#10b981' : focusLevel > 40 ? '#f59e0b' : '#ef4444';

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Core sphere */}
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3 + (100 - focusLevel) * 0.003}
            speed={2 + stressLevel * 0.02}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Glow effect */}
        <Sphere ref={glowRef} args={[1.3, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </Sphere>

        {/* Neural connections */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1.8;
          const z = Math.sin(angle) * 1.8;
          return (
            <group key={i}>
              <Sphere args={[0.1, 16, 16]} position={[x, 0, z]}>
                <meshBasicMaterial color={color} />
              </Sphere>
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array([0, 0, 0, x, 0, z]), 3]}
                    count={2}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={color} transparent opacity={0.3} />
              </line>
            </group>
          );
        })}
      </group>
    </Float>
  );
}

// Learning pattern data
const learningPatterns = {
  optimalHours: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
  weakDays: ['Monday mornings', 'Friday afternoons'],
  strongTopics: ['Visual learning', 'Case-based reasoning', 'Procedural memory'],
  weakTopics: ['Abstract concepts', 'Rote memorization'],
  forgettingCurve: [
    { day: 0, retention: 100 },
    { day: 1, retention: 70 },
    { day: 3, retention: 50 },
    { day: 7, retention: 35 },
    { day: 14, retention: 25 },
    { day: 30, retention: 20 },
  ],
};

// Career simulation data
const careerPaths = [
  {
    id: 'interventional',
    title: 'Interventional Cardiology',
    probability: 85,
    timeline: '3-5 years',
    salary: '$450,000 - $650,000',
    demand: 'High',
    satisfaction: 92,
    workLifeBalance: 65,
    milestones: [
      { year: 1, event: 'Complete fellowship', status: 'in-progress' },
      { year: 2, event: 'Board certification', status: 'upcoming' },
      { year: 3, event: 'Hospital appointment', status: 'upcoming' },
      { year: 5, event: 'Section chief potential', status: 'future' },
    ],
  },
  {
    id: 'structural',
    title: 'Structural Heart Disease',
    probability: 72,
    timeline: '4-6 years',
    salary: '$500,000 - $750,000',
    demand: 'Very High',
    satisfaction: 88,
    workLifeBalance: 60,
    milestones: [
      { year: 1, event: 'Additional fellowship', status: 'upcoming' },
      { year: 3, event: 'TAVR certification', status: 'future' },
      { year: 5, event: 'Program director', status: 'future' },
    ],
  },
  {
    id: 'electrophysiology',
    title: 'Electrophysiology',
    probability: 58,
    timeline: '4-5 years',
    salary: '$400,000 - $600,000',
    demand: 'Medium',
    satisfaction: 85,
    workLifeBalance: 70,
    milestones: [
      { year: 2, event: 'EP fellowship', status: 'future' },
      { year: 4, event: 'Device implantation certified', status: 'future' },
    ],
  },
];

// Cognitive metrics
const cognitiveMetrics = {
  focus: 78,
  stress: 32,
  fatigue: 25,
  motivation: 85,
  retention: 72,
  comprehension: 88,
};

// Wearable data simulation
const wearableData = {
  connected: true,
  device: 'Apple Watch Series 9',
  heartRate: 68,
  hrv: 45,
  sleepScore: 82,
  lastSync: '2 min ago',
  todaySteps: 8432,
  activeMinutes: 45,
};

export default function DigitalTwinPage() {
  const [selectedCareer, setSelectedCareer] = useState(careerPaths[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'career' | 'health'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-neural-500" />
            Medical Digital Twin
          </h1>
          <p className="text-muted-foreground">
            AI-powered learning profile that adapts to your unique cognitive patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-health-500/10 border border-health-500/30">
            <div className="w-2 h-2 rounded-full bg-health-500 animate-pulse" />
            <span className="text-sm font-medium text-health-500">Twin Active</span>
          </div>
          <button className="btn-outline flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Data
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'learning', label: 'Learning Patterns', icon: Brain },
          { id: 'career', label: 'Career Simulation', icon: Briefcase },
          { id: 'health', label: 'Biometrics', icon: Heart },
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

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Digital Twin Visualization */}
          <div className="lg:col-span-2 card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Your Digital Twin</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                Real-time cognitive state
              </div>
            </div>
            <div className="h-80 rounded-xl overflow-hidden bg-gradient-to-br from-neural-950 to-ibmp-950">
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.3} />
                <Suspense fallback={null}>
                  <DigitalTwinAvatar 
                    focusLevel={cognitiveMetrics.focus} 
                    stressLevel={cognitiveMetrics.stress} 
                  />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
              </Canvas>
            </div>
            
            {/* Cognitive Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { label: 'Focus', value: cognitiveMetrics.focus, icon: Target, color: 'ibmp' },
                { label: 'Retention', value: cognitiveMetrics.retention, icon: Brain, color: 'neural' },
                { label: 'Motivation', value: cognitiveMetrics.motivation, icon: Zap, color: 'achievement' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-xl bg-muted/50 text-center">
                  <metric.icon className={`w-5 h-5 mx-auto mb-2 text-${metric.color}-500`} />
                  <div className="text-2xl font-bold">{metric.value}%</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Wearable Connection */}
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Watch className="w-5 h-5 text-ibmp-500" />
                Connected Wearable
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-steel-800 flex items-center justify-center">
                  <Watch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-medium">{wearableData.device}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-health-500" />
                    Synced {wearableData.lastSync}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <Heart className="w-4 h-4 mx-auto mb-1 text-critical-500" />
                  <div className="font-semibold">{wearableData.heartRate}</div>
                  <div className="text-xs text-muted-foreground">BPM</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <Moon className="w-4 h-4 mx-auto mb-1 text-neural-500" />
                  <div className="font-semibold">{wearableData.sleepScore}</div>
                  <div className="text-xs text-muted-foreground">Sleep Score</div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card-elevated p-5 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neural-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-health-500 mt-0.5" />
                  <p className="text-sm">Your focus peaks between 9-11 AM. Schedule complex topics then.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-achievement-500 mt-0.5" />
                  <p className="text-sm">Hemodynamics retention dropping. Review recommended in 2 days.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-ibmp-500 mt-0.5" />
                  <p className="text-sm">Your visual learning score is 40% higher. Try more diagrams.</p>
                </div>
              </div>
            </div>

            {/* Optimal Study Time */}
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-bio-500" />
                Optimal Study Windows
              </h3>
              <div className="space-y-2">
                {['9:00 - 11:00 AM', '2:00 - 4:00 PM', '7:00 - 8:00 PM'].map((time, i) => (
                  <div key={time} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm">{time}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      i === 0 ? 'bg-health-500/20 text-health-500' :
                      i === 1 ? 'bg-ibmp-500/20 text-ibmp-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {i === 0 ? 'Peak' : i === 1 ? 'Good' : 'Moderate'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Forgetting Curve */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-critical-500" />
              Memory Retention Curve
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your personalized forgetting curve based on 10,000+ data points
            </p>
            <div className="h-48 flex items-end justify-between gap-2">
              {learningPatterns.forgettingCurve.map((point, i) => (
                <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium">{point.retention}%</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${point.retention}%` }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-critical-500 to-achievement-500"
                  />
                  <span className="text-xs text-muted-foreground">Day {point.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-achievement-500/10 border border-achievement-500/30">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-achievement-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Spaced Repetition Optimization</div>
                  <p className="text-xs text-muted-foreground">
                    Review Hemodynamics on Day 1, 3, and 7 to boost retention to 85%+
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Style Analysis */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-neural-500" />
              Learning Style Profile
            </h3>
            <div className="space-y-4">
              {[
                { style: 'Visual', score: 85, color: 'ibmp' },
                { style: 'Kinesthetic (VR)', score: 78, color: 'neural' },
                { style: 'Auditory', score: 62, color: 'bio' },
                { style: 'Reading/Writing', score: 55, color: 'achievement' },
              ].map((item) => (
                <div key={item.style} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.style}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={`h-full bg-${item.color}-500 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-neural-500/10 border border-neural-500/30">
              <p className="text-sm">
                <span className="font-semibold">Recommendation:</span> Your visual learning score is 40% above average. 
                Focus on diagram-heavy content and VR simulations for optimal retention.
              </p>
            </div>
          </div>

          {/* Cognitive Load Analysis */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Battery className="w-5 h-5 text-health-500" />
              Cognitive Load History
            </h3>
            <div className="h-32 flex items-end justify-between gap-1">
              {[...Array(24)].map((_, i) => {
                const load = 30 + Math.sin(i * 0.5) * 40 + Math.random() * 20;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t ${
                        load > 70 ? 'bg-critical-500' :
                        load > 50 ? 'bg-achievement-500' :
                        'bg-health-500'
                      }`}
                      style={{ height: `${load}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>Now</span>
            </div>
          </div>

          {/* Predicted Performance */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-achievement-500" />
              Exam Performance Prediction
            </h3>
            <div className="space-y-4">
              {[
                { exam: 'Cardiology Board', predicted: 92, confidence: 85 },
                { exam: 'PCI Certification', predicted: 88, confidence: 78 },
                { exam: 'STEMI Protocol', predicted: 95, confidence: 92 },
              ].map((item) => (
                <div key={item.exam} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.exam}</span>
                    <span className="text-2xl font-bold text-health-500">{item.predicted}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {item.confidence}% • Based on current trajectory
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div className="space-y-6">
          {/* Career Path Simulation */}
          <div className="grid lg:grid-cols-3 gap-4">
            {careerPaths.map((path) => (
              <motion.button
                key={path.id}
                onClick={() => setSelectedCareer(path)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  selectedCareer.id === path.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{path.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    path.probability > 80 ? 'bg-health-500/20 text-health-500' :
                    path.probability > 60 ? 'bg-ibmp-500/20 text-ibmp-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {path.probability}% match
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {path.timeline}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    {path.salary}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    Demand: {path.demand}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected Career Details */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-neural-500" />
                20-Year Career Simulation: {selectedCareer.title}
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {selectedCareer.milestones.map((milestone, i) => (
                    <div key={i} className="relative flex items-start gap-4 pl-4">
                      <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                        milestone.status === 'in-progress' ? 'bg-ibmp-500 border-ibmp-500' :
                        milestone.status === 'upcoming' ? 'bg-background border-ibmp-500' :
                        'bg-background border-muted-foreground'
                      }`}>
                        {milestone.status === 'in-progress' && (
                          <div className="absolute inset-0 rounded-full bg-ibmp-500 animate-ping opacity-50" />
                        )}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="text-xs text-muted-foreground">Year {milestone.year}</div>
                        <div className="font-medium">{milestone.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Satisfaction Metrics */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4">Predicted Satisfaction</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-3xl font-bold text-health-500">{selectedCareer.satisfaction}%</div>
                    <div className="text-sm text-muted-foreground">Job Satisfaction</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-3xl font-bold text-ibmp-500">{selectedCareer.workLifeBalance}%</div>
                    <div className="text-sm text-muted-foreground">Work-Life Balance</div>
                  </div>
                </div>
              </div>

              {/* Income Projection */}
              <div className="card-elevated p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-achievement-500" />
                  Lifetime Earnings Projection
                </h3>
                <div className="text-3xl font-bold gradient-text mb-2">$18.5M - $24.2M</div>
                <p className="text-sm text-muted-foreground">
                  Based on {selectedCareer.title} career path over 30 years
                </p>
                <div className="mt-4 h-24 flex items-end gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-achievement-500 to-achievement-400 rounded-t"
                      style={{ height: `${40 + i * 6 + Math.random() * 10}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Year 1</span>
                  <span>Year 30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Biometric Dashboard */}
          <div className="lg:col-span-2 card-elevated p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-critical-500" />
              Biometric Dashboard
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Heart Rate', value: '68', unit: 'BPM', icon: Heart, color: 'critical', status: 'Normal' },
                { label: 'HRV', value: '45', unit: 'ms', icon: Activity, color: 'neural', status: 'Good' },
                { label: 'Stress', value: '32', unit: '%', icon: Brain, color: 'ibmp', status: 'Low' },
                { label: 'Fatigue', value: '25', unit: '%', icon: Coffee, color: 'bio', status: 'Rested' },
              ].map((metric) => (
                <div key={metric.label} className="p-4 rounded-xl bg-muted/50 text-center">
                  <metric.icon className={`w-5 h-5 mx-auto mb-2 text-${metric.color}-500`} />
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.unit}</div>
                  <div className={`text-xs font-medium text-${metric.color}-500 mt-1`}>{metric.status}</div>
                </div>
              ))}
            </div>
            
            {/* Heart Rate Timeline */}
            <div className="h-32 bg-muted/30 rounded-xl p-4">
              <div className="flex items-end h-full gap-0.5">
                {[...Array(60)].map((_, i) => {
                  const height = 40 + Math.sin(i * 0.3) * 30 + Math.random() * 15;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-critical-500/60 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sleep & Recovery */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-neural-500" />
                Sleep Quality
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-neural-500">{wearableData.sleepScore}</div>
                <div className="text-sm text-muted-foreground">Last Night</div>
              </div>
              <div className="space-y-2">
                {[
                  { stage: 'Deep Sleep', duration: '1h 45m', percent: 22 },
                  { stage: 'REM', duration: '2h 10m', percent: 27 },
                  { stage: 'Light Sleep', duration: '4h 05m', percent: 51 },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center justify-between text-sm">
                    <span>{item.stage}</span>
                    <span className="text-muted-foreground">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-5 bg-gradient-to-br from-health-500/5 to-bio-500/5 border-health-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-health-500" />
                Optimization Tips
              </h3>
              <div className="space-y-3 text-sm">
                <p>• Sleep 30 min earlier for 15% better retention</p>
                <p>• Morning meditation can reduce stress by 20%</p>
                <p>• Your caffeine cutoff should be 2 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

