'use client';

import { useState, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Float, Text, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  Globe,
  Users,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Send,
  MapPin,
  Building,
  Calendar,
  Clock,
  ChevronRight,
  Star,
  Sparkles,
  GraduationCap,
  Heart,
  Brain,
  Zap,
  Award,
  Coffee,
  BookOpen,
  Play,
  Settings,
  Maximize,
  Volume2,
  Share2,
  Hand,
  Map,
  Compass,
  Home,
  Library,
  FlaskConical,
  Stethoscope,
  Activity,
} from 'lucide-react';

// 3D Campus Building Component
function CampusBuilding({ position, color, name }: { position: [number, number, number]; color: string; name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.8, 1.2, 0.8]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </Box>
      <Box args={[0.9, 0.05, 0.9]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
    </group>
  );
}

// Campus locations
const campusLocations = [
  {
    id: 'lecture-hall',
    name: 'Grand Lecture Hall',
    description: 'Holographic lectures from world-renowned faculty',
    icon: GraduationCap,
    activeUsers: 245,
    currentEvent: 'Live: Advanced Hemodynamics',
    color: 'ibmp',
  },
  {
    id: 'surgery-center',
    name: 'VR Surgery Center',
    description: 'Practice procedures in immersive simulation',
    icon: Heart,
    activeUsers: 89,
    currentEvent: 'CTO Workshop in progress',
    color: 'critical',
  },
  {
    id: 'library',
    name: 'Knowledge Nexus',
    description: '3D interactive medical library',
    icon: Library,
    activeUsers: 156,
    currentEvent: 'Study groups available',
    color: 'neural',
  },
  {
    id: 'research-lab',
    name: 'Innovation Lab',
    description: 'Collaborate on cutting-edge research',
    icon: FlaskConical,
    activeUsers: 42,
    currentEvent: 'AI Diagnostics Hackathon',
    color: 'bio',
  },
  {
    id: 'social-hub',
    name: 'Networking Lounge',
    description: 'Connect with peers worldwide',
    icon: Users,
    activeUsers: 312,
    currentEvent: 'Cardiology Meetup',
    color: 'achievement',
  },
  {
    id: 'clinic',
    name: 'Virtual Clinic',
    description: 'Practice patient consultations',
    icon: Stethoscope,
    activeUsers: 67,
    currentEvent: 'Case review session',
    color: 'health',
  },
];

// Live events
const liveEvents = [
  {
    id: 1,
    title: 'Holographic Grand Rounds: Complex CTO',
    speaker: 'User Name',
    location: 'Grand Lecture Hall',
    attendees: 1245,
    startsIn: 'Live now',
    type: 'lecture',
  },
  {
    id: 2,
    title: 'Multiplayer Surgery: Bifurcation PCI',
    speaker: 'User Name',
    location: 'VR Surgery Center',
    attendees: 12,
    startsIn: '30 min',
    type: 'surgery',
  },
  {
    id: 3,
    title: 'Journal Club: NEJM Review',
    speaker: 'User Name',
    location: 'Knowledge Nexus',
    attendees: 89,
    startsIn: '2 hours',
    type: 'discussion',
  },
];

// Online users
const onlineUsers = [
  { id: 1, name: 'Dr. Alex Kim', location: 'Lecture Hall', avatar: '👨‍⚕️' },
  { id: 2, name: 'Dr. Maria Garcia', location: 'Surgery Center', avatar: '👩‍⚕️' },
  { id: 3, name: 'Dr. John Smith', location: 'Library', avatar: '👨‍🔬' },
  { id: 4, name: 'Dr. Lisa Chen', location: 'Lounge', avatar: '👩‍🔬' },
  { id: 5, name: 'Dr. David Lee', location: 'Research Lab', avatar: '🧑‍⚕️' },
];

export default function MetaversePage() {
  const [selectedLocation, setSelectedLocation] = useState(campusLocations[0]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Globe className="w-7 h-7 text-neural-500" />
            MedFellow Medical Metaverse
          </h1>
          <p className="text-muted-foreground">
            Immersive 3D campus for global medical collaboration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-health-500/10 border border-health-500/30">
            <div className="w-2 h-2 rounded-full bg-health-500 animate-pulse" />
            <span className="text-sm font-medium text-health-500">1,247 online</span>
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Avatar
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" />
            Enter Metaverse
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* 3D Campus View */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card-elevated overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-neural-950 via-ibmp-950 to-steel-950">
              <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <pointLight position={[-10, 5, 0]} color="#0ba5ec" intensity={0.3} />
                <pointLight position={[0, 5, -10]} color="#a855f7" intensity={0.3} />
                
                <Suspense fallback={null}>
                  {/* Campus buildings */}
                  <CampusBuilding position={[-2, 0.6, -2]} color="#0ba5ec" name="Lecture Hall" />
                  <CampusBuilding position={[2, 0.6, -2]} color="#ef4444" name="Surgery Center" />
                  <CampusBuilding position={[-2, 0.6, 2]} color="#a855f7" name="Library" />
                  <CampusBuilding position={[2, 0.6, 2]} color="#10b981" name="Research Lab" />
                  <CampusBuilding position={[0, 0.6, 0]} color="#f59e0b" name="Social Hub" />
                  
                  {/* Ground plane */}
                  <Box args={[10, 0.1, 10]} position={[0, -0.05, 0]}>
                    <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                  </Box>
                  
                  {/* Floating particles */}
                  {[...Array(20)].map((_, i) => (
                    <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
                      <Sphere 
                        args={[0.03, 8, 8]} 
                        position={[
                          (Math.random() - 0.5) * 8,
                          Math.random() * 3 + 1,
                          (Math.random() - 0.5) * 8
                        ]}
                      >
                        <meshBasicMaterial color="#0ba5ec" transparent opacity={0.6} />
                      </Sphere>
                    </Float>
                  ))}
                </Suspense>
                
                <OrbitControls 
                  enableZoom 
                  enablePan 
                  autoRotate 
                  autoRotateSpeed={0.5}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2.5}
                />
              </Canvas>

              {/* Overlay UI */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Map className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Compass className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Home className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>

              {/* Communication Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button 
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl backdrop-blur-sm transition-all ${
                    isMicOn ? 'bg-black/50 text-white' : 'bg-critical-500 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-xl backdrop-blur-sm transition-all ${
                    isVideoOn ? 'bg-black/50 text-white' : 'bg-critical-500 text-white'
                  }`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-white">
                  <Hand className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`p-3 rounded-xl backdrop-blur-sm transition-all ${
                    showChat ? 'bg-ibmp-500 text-white' : 'bg-black/50 text-white'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-xl bg-black/50 backdrop-blur-sm text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Location Info */}
              <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-black/60 backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <selectedLocation.icon className="w-4 h-4 text-ibmp-400" />
                  <span className="font-medium text-white text-sm">{selectedLocation.name}</span>
                </div>
                <p className="text-xs text-white/70">{selectedLocation.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                  <Users className="w-3 h-3" />
                  {selectedLocation.activeUsers} here
                </div>
              </div>
            </div>
          </div>

          {/* Campus Locations */}
          <div className="grid grid-cols-3 gap-4">
            {campusLocations.map((location) => (
              <motion.button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedLocation.id === location.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-${location.color}-500/20 flex items-center justify-center`}>
                    <location.icon className={`w-5 h-5 text-${location.color}-500`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {location.activeUsers}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {location.currentEvent}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Live Events */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-critical-500" />
              Live Events
            </h3>
            <div className="space-y-3">
              {liveEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      event.startsIn === 'Live now' 
                        ? 'bg-critical-500/20 text-critical-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.startsIn}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.attendees}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{event.title}</h4>
                  <div className="text-xs text-muted-foreground">
                    {event.speaker} • {event.location}
                  </div>
                  <button className="w-full mt-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all">
                    {event.startsIn === 'Live now' ? 'Join Now' : 'Set Reminder'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Online Users */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-health-500" />
              Online Now
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.location}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-health-500" />
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-sm text-primary hover:underline">
              View all 1,247 online
            </button>
          </div>

          {/* Chat Panel */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card-elevated p-5"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-ibmp-500" />
                  Global Chat
                </h3>
                <div className="h-48 overflow-y-auto space-y-2 mb-3">
                  {[
                    { user: 'Dr. Kim', message: 'Great lecture today!', time: '2m' },
                    { user: 'Dr. Garcia', message: 'Anyone for surgery practice?', time: '5m' },
                    { user: 'Dr. Smith', message: 'Just finished CTO module 🎉', time: '8m' },
                  ].map((msg, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                  />
                  <button className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

