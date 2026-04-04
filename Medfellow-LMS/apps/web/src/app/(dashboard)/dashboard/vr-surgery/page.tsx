'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus, Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import {
  Gamepad2,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Users,
  Video,
  Mic,
  MicOff,
  Settings,
  Award,
  Clock,
  Target,
  Brain,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Star,
  Zap,
  Eye,
  Hand,
  Crosshair,
  Layers,
  Download,
  Share2,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';

// 3D Operating Room Scene
function OperatingRoom() {
  const tableRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    // Subtle ambient animation
  });

  return (
    <group>
      {/* Operating Table */}
      <Box args={[3, 0.2, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Patient outline */}
      <group position={[0, 0.2, 0]}>
        <Sphere args={[0.15, 16, 16]} position={[0, 0.15, 0.5]}>
          <meshStandardMaterial color="#64748b" />
        </Sphere>
        <Box args={[0.4, 0.1, 0.8]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#475569" />
        </Box>
      </group>

      {/* Surgical lights */}
      <group position={[0, 2, 0]}>
        <Torus args={[0.5, 0.05, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0ba5ec" emissive="#0ba5ec" emissiveIntensity={0.5} />
        </Torus>
        <pointLight position={[0, -0.5, 0]} intensity={2} color="#ffffff" />
      </group>

      {/* Heart hologram */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <group position={[0, 1, 0]}>
          <Sphere args={[0.2, 32, 32]}>
            <meshStandardMaterial 
              color="#ef4444" 
              transparent 
              opacity={0.7}
              emissive="#ef4444"
              emissiveIntensity={0.3}
            />
          </Sphere>
          {/* Coronary arteries visualization */}
          {[0, 1, 2, 3].map((i) => (
            <Torus
              key={i}
              args={[0.25 + i * 0.05, 0.01, 8, 32]}
              rotation={[Math.PI / 2 + i * 0.2, i * 0.5, 0]}
            >
              <meshStandardMaterial color="#0ba5ec" transparent opacity={0.5} />
            </Torus>
          ))}
        </group>
      </Float>

      {/* Floor */}
      <Box args={[10, 0.1, 10]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* Walls suggestion */}
      <Box args={[10, 5, 0.1]} position={[0, 1.5, -5]}>
        <meshStandardMaterial color="#1e293b" transparent opacity={0.5} />
      </Box>
    </group>
  );
}

// Surgery scenarios
const surgeryScenarios = [
  {
    id: 'pci-basic',
    title: 'Basic PCI - LAD Lesion',
    difficulty: 'Beginner',
    duration: '30 min',
    rating: 4.8,
    completions: 12450,
    description: 'Practice balloon angioplasty and stent placement in a straightforward LAD lesion.',
    skills: ['Wire manipulation', 'Balloon sizing', 'Stent deployment'],
    icon: Heart,
    color: 'critical',
  },
  {
    id: 'pci-complex',
    title: 'Complex PCI - CTO',
    difficulty: 'Advanced',
    duration: '60 min',
    rating: 4.9,
    completions: 5890,
    description: 'Navigate a chronic total occlusion with advanced wire escalation techniques.',
    skills: ['CTO crossing', 'Retrograde approach', 'Dissection re-entry'],
    icon: Activity,
    color: 'neural',
  },
  {
    id: 'tavr',
    title: 'TAVR Procedure',
    difficulty: 'Expert',
    duration: '90 min',
    rating: 4.95,
    completions: 2340,
    description: 'Perform transcatheter aortic valve replacement with realistic hemodynamics.',
    skills: ['Valve sizing', 'Deployment', 'Complication management'],
    icon: Heart,
    color: 'ibmp',
  },
  {
    id: 'emergency-stemi',
    title: 'Emergency STEMI',
    difficulty: 'Intermediate',
    duration: '45 min',
    rating: 4.85,
    completions: 8920,
    description: 'Race against the clock in a door-to-balloon STEMI scenario.',
    skills: ['Rapid assessment', 'Time management', 'Team coordination'],
    icon: AlertTriangle,
    color: 'achievement',
  },
];

// Multiplayer sessions
const liveSessions = [
  {
    id: 1,
    title: 'Complex Bifurcation PCI',
    host: 'User Name',
    participants: 8,
    maxParticipants: 12,
    status: 'live',
    startedAt: '15 min ago',
  },
  {
    id: 2,
    title: 'CTO Masterclass',
    host: 'User Name',
    participants: 12,
    maxParticipants: 12,
    status: 'full',
    startedAt: '30 min ago',
  },
  {
    id: 3,
    title: 'TAVR Complications',
    host: 'User Name',
    participants: 5,
    maxParticipants: 8,
    status: 'live',
    startsIn: '10 min',
  },
];

// Performance metrics
const performanceHistory = [
  { date: 'Today', procedure: 'LAD PCI', score: 94, time: '28:45', grade: 'A' },
  { date: 'Yesterday', procedure: 'RCA CTO', score: 87, time: '58:20', grade: 'B+' },
  { date: '2 days ago', procedure: 'Bifurcation', score: 91, time: '42:15', grade: 'A-' },
  { date: '3 days ago', procedure: 'STEMI', score: 96, time: '22:10', grade: 'A+' },
];

export default function VRSurgeryPage() {
  const [selectedScenario, setSelectedScenario] = useState(surgeryScenarios[0]);
  const [isInSession, setIsInSession] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-neural-500" />
            VR Surgery Theater
          </h1>
          <p className="text-muted-foreground">
            Practice complex procedures in photorealistic virtual operating rooms
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neural-500/10 border border-neural-500/30">
            <Gamepad2 className="w-4 h-4 text-neural-500" />
            <span className="text-sm font-medium">Meta Quest 3 Connected</span>
          </div>
          <button 
            onClick={() => setShowMultiplayer(!showMultiplayer)}
            className="btn-outline flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Multiplayer
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main VR Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* VR Scene */}
          <div className="card-elevated overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-steel-950 via-neural-950 to-ibmp-950">
              <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.5} />
                <pointLight position={[-5, 3, 0]} color="#0ba5ec" intensity={0.3} />
                <Suspense fallback={null}>
                  <OperatingRoom />
                </Suspense>
                <OrbitControls enableZoom enablePan autoRotate autoRotateSpeed={0.3} />
              </Canvas>

              {/* Overlay Controls */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-critical-500 animate-pulse" />
                  Preview Mode
                </span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Scenario Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="p-4 rounded-xl bg-black/60 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-${selectedScenario.color}-500/20 flex items-center justify-center`}>
                        <selectedScenario.icon className={`w-6 h-6 text-${selectedScenario.color}-500`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedScenario.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-white/70">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selectedScenario.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-achievement-500" />
                            {selectedScenario.rating}
                          </span>
                          <span>{selectedScenario.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start VR Session
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Hand className="w-4 h-4" />
                  Haptic Gloves
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                  Eye Tracking
                </button>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Crosshair className="w-4 h-4" />
                  Mentor Overlay
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg hover:bg-muted">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button className="p-2 rounded-lg hover:bg-muted">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Available Scenarios</h2>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {surgeryScenarios.map((scenario) => (
                <motion.button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedScenario.id === scenario.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${scenario.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <scenario.icon className={`w-5 h-5 text-${scenario.color}-500`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{scenario.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className={`px-1.5 py-0.5 rounded ${
                          scenario.difficulty === 'Beginner' ? 'bg-health-500/20 text-health-500' :
                          scenario.difficulty === 'Intermediate' ? 'bg-ibmp-500/20 text-ibmp-500' :
                          scenario.difficulty === 'Advanced' ? 'bg-achievement-500/20 text-achievement-500' :
                          'bg-neural-500/20 text-neural-500'
                        }`}>
                          {scenario.difficulty}
                        </span>
                        <span>{scenario.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Star className="w-3 h-3 text-achievement-500" />
                        <span>{scenario.rating}</span>
                        <span>•</span>
                        <span>{scenario.completions.toLocaleString()} completed</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Scenario Details */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-ibmp-500" />
              Scenario Details
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedScenario.description}
            </p>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Skills Practiced
              </h4>
              {selectedScenario.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-health-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Multiplayer Sessions */}
          <AnimatePresence>
            {showMultiplayer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card-elevated p-5"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-neural-500" />
                  Live Multiplayer Sessions
                </h3>
                <div className="space-y-3">
                  {liveSessions.map((session) => (
                    <div key={session.id} className="p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{session.title}</span>
                        {session.status === 'live' ? (
                          <span className="flex items-center gap-1 text-xs text-health-500">
                            <div className="w-2 h-2 rounded-full bg-health-500 animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Full</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Hosted by {session.host}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">
                          {session.participants}/{session.maxParticipants} participants
                        </span>
                        <button 
                          className={`text-xs font-medium ${
                            session.status === 'full' 
                              ? 'text-muted-foreground cursor-not-allowed' 
                              : 'text-primary hover:underline'
                          }`}
                          disabled={session.status === 'full'}
                        >
                          {session.status === 'full' ? 'Full' : 'Join'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 btn-secondary text-sm py-2">
                  Create Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance History */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-achievement-500" />
              Recent Performance
            </h3>
            <div className="space-y-3">
              {performanceHistory.map((record, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <div className="font-medium text-sm">{record.procedure}</div>
                    <div className="text-xs text-muted-foreground">{record.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      record.score >= 95 ? 'text-health-500' :
                      record.score >= 90 ? 'text-ibmp-500' :
                      'text-achievement-500'
                    }`}>
                      {record.grade}
                    </div>
                    <div className="text-xs text-muted-foreground">{record.score}% • {record.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-primary hover:underline">
              View full history
            </button>
          </div>

          {/* AI Mentor */}
          <div className="card-elevated p-5 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-neural-500" />
              AI Mentor Feedback
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              "Your wire manipulation has improved 23% this week. Focus on maintaining stable guide support during CTO crossing. Consider practicing the retrograde approach next."
            </p>
            <button className="btn-secondary w-full text-sm py-2 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Ask for Tips
            </button>
          </div>

          {/* Achievements in VR */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-achievement-500" />
              VR Surgery Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">45</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">89%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">Scenarios</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/50 text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

