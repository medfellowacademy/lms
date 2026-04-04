'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Eye,
  Activity,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  Coffee,
  Moon,
  Sun,
  Headphones,
  Focus,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Wind,
  Sparkles,
  Timer,
  Gauge,
  Radio,
} from 'lucide-react';

// Simulated brainwave frequencies
const brainwaveTypes = {
  alpha: { name: 'Alpha', range: '8-12 Hz', state: 'Relaxed Focus', color: 'ibmp' },
  beta: { name: 'Beta', range: '12-30 Hz', state: 'Active Thinking', color: 'neural' },
  theta: { name: 'Theta', range: '4-8 Hz', state: 'Creative Flow', color: 'bio' },
  gamma: { name: 'Gamma', range: '30-100 Hz', state: 'Peak Performance', color: 'achievement' },
  delta: { name: 'Delta', range: '0.5-4 Hz', state: 'Deep Rest', color: 'steel' },
};

// Focus optimization presets
const focusPresets = [
  {
    id: 'deep-work',
    name: 'Deep Work Mode',
    description: 'Maximum focus for complex learning',
    duration: 90,
    binauralFreq: 40,
    ambientSound: 'brown-noise',
    lightingMode: 'dim',
    icon: Brain,
  },
  {
    id: 'review',
    name: 'Review Mode',
    description: 'Optimized for retention and recall',
    duration: 45,
    binauralFreq: 14,
    ambientSound: 'nature',
    lightingMode: 'natural',
    icon: RefreshCw,
  },
  {
    id: 'creative',
    name: 'Creative Mode',
    description: 'Enhanced for problem-solving',
    duration: 60,
    binauralFreq: 6,
    ambientSound: 'ambient',
    lightingMode: 'warm',
    icon: Lightbulb,
  },
  {
    id: 'sprint',
    name: 'Sprint Mode',
    description: 'Short burst high-intensity learning',
    duration: 25,
    binauralFreq: 20,
    ambientSound: 'silence',
    lightingMode: 'bright',
    icon: Zap,
  },
];

// Content adaptation rules
const adaptationRules = [
  { trigger: 'Focus drops below 60%', action: 'Simplify content complexity' },
  { trigger: 'Eye strain detected', action: 'Enable dark mode & increase font' },
  { trigger: 'Fatigue > 70%', action: 'Suggest 10-min break' },
  { trigger: 'Optimal state detected', action: 'Unlock advanced content' },
  { trigger: 'Confusion pattern', action: 'Provide additional examples' },
];

export default function NeuroAdaptivePage() {
  const [isTracking, setIsTracking] = useState(true);
  const [activePreset, setActivePreset] = useState(focusPresets[0]);
  const [focusScore, setFocusScore] = useState(78);
  const [eyeStrainLevel, setEyeStrainLevel] = useState(25);
  const [fatigueLevel, setFatigueLevel] = useState(32);
  const [brainwaveData, setBrainwaveData] = useState<number[]>(Array(50).fill(0.5));
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Simulate brainwave updates
  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setBrainwaveData(prev => {
        const newData = [...prev.slice(1), Math.random() * 0.3 + 0.5 + Math.sin(Date.now() / 1000) * 0.2];
        return newData;
      });
      // Simulate fluctuating focus
      setFocusScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)));
    }, 100);
    return () => clearInterval(interval);
  }, [isTracking]);

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-neural-500" />
            Neuro-Adaptive Interface
          </h1>
          <p className="text-muted-foreground">
            AI-powered learning optimization through EEG, eye-tracking, and biometric analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isTracking 
              ? 'bg-health-500/10 border border-health-500/30' 
              : 'bg-muted border border-border'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-health-500 animate-pulse' : 'bg-muted-foreground'}`} />
            <span className={`text-sm font-medium ${isTracking ? 'text-health-500' : 'text-muted-foreground'}`}>
              {isTracking ? 'Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          <button 
            onClick={() => setIsTracking(!isTracking)}
            className="btn-outline flex items-center gap-2"
          >
            {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isTracking ? 'Pause' : 'Resume'}
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Calibrate
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Brain Activity */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-neural-500" />
                Real-time Neural Activity
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-health-500" />
                  Muse S Connected
                </span>
              </div>
            </div>
            
            {/* Brainwave Visualization */}
            <div className="h-48 bg-gradient-to-br from-neural-950/50 to-ibmp-950/50 rounded-xl p-4 overflow-hidden relative">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--neural-500))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(var(--neural-500))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 20 ${brainwaveData.map((d, i) => `L ${(i / brainwaveData.length) * 100} ${20 - d * 15}`).join(' ')} L 100 20 Z`}
                  fill="url(#waveGradient)"
                />
                <path
                  d={`M 0 20 ${brainwaveData.map((d, i) => `L ${(i / brainwaveData.length) * 100} ${20 - d * 15}`).join(' ')}`}
                  fill="none"
                  stroke="rgb(var(--neural-500))"
                  strokeWidth="0.5"
                />
              </svg>
              
              {/* Focus indicator overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  focusScore > 70 ? 'bg-health-500' :
                  focusScore > 40 ? 'bg-achievement-500' :
                  'bg-critical-500'
                } animate-pulse`} />
                <span className="text-white text-sm font-medium">{Math.round(focusScore)}% Focus</span>
              </div>
            </div>

            {/* Brainwave Breakdown */}
            <div className="grid grid-cols-5 gap-4 mt-6">
              {Object.entries(brainwaveTypes).map(([key, wave]) => {
                const intensity = Math.random() * 50 + 25;
                return (
                  <div key={key} className="text-center">
                    <div className="text-xs font-medium text-muted-foreground mb-1">{wave.name}</div>
                    <div className="h-16 bg-muted/30 rounded-lg overflow-hidden relative">
                      <motion.div
                        animate={{ height: `${intensity}%` }}
                        className={`absolute bottom-0 left-0 right-0 bg-${wave.color}-500/50`}
                      />
                      <div className={`absolute inset-0 flex items-center justify-center text-sm font-semibold text-${wave.color}-500`}>
                        {Math.round(intensity)}%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{wave.range}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cognitive Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card-elevated p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-ibmp-500" />
                <span className="font-medium">Focus Level</span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${
                  focusScore > 70 ? 'text-health-500' :
                  focusScore > 40 ? 'text-achievement-500' :
                  'text-critical-500'
                }`}>
                  {Math.round(focusScore)}%
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  {focusScore > 70 ? 'Excellent' : focusScore > 40 ? 'Good' : 'Low'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${focusScore}%` }}
                  className={`h-full ${
                    focusScore > 70 ? 'bg-health-500' :
                    focusScore > 40 ? 'bg-achievement-500' :
                    'bg-critical-500'
                  }`}
                />
              </div>
            </div>

            <div className="card-elevated p-5">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-bio-500" />
                <span className="font-medium">Eye Strain</span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${
                  eyeStrainLevel < 30 ? 'text-health-500' :
                  eyeStrainLevel < 60 ? 'text-achievement-500' :
                  'text-critical-500'
                }`}>
                  {eyeStrainLevel}%
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  {eyeStrainLevel < 30 ? 'Low' : eyeStrainLevel < 60 ? 'Moderate' : 'High'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${eyeStrainLevel}%` }}
                  className={`h-full ${
                    eyeStrainLevel < 30 ? 'bg-health-500' :
                    eyeStrainLevel < 60 ? 'bg-achievement-500' :
                    'bg-critical-500'
                  }`}
                />
              </div>
            </div>

            <div className="card-elevated p-5">
              <div className="flex items-center gap-2 mb-3">
                <Coffee className="w-5 h-5 text-neural-500" />
                <span className="font-medium">Fatigue</span>
              </div>
              <div className="flex items-end gap-2">
                <span className={`text-3xl font-bold ${
                  fatigueLevel < 30 ? 'text-health-500' :
                  fatigueLevel < 60 ? 'text-achievement-500' :
                  'text-critical-500'
                }`}>
                  {fatigueLevel}%
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  {fatigueLevel < 30 ? 'Fresh' : fatigueLevel < 60 ? 'Mild' : 'High'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${fatigueLevel}%` }}
                  className={`h-full ${
                    fatigueLevel < 30 ? 'bg-health-500' :
                    fatigueLevel < 60 ? 'bg-achievement-500' :
                    'bg-critical-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Content Adaptation Log */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-achievement-500" />
              Real-time Content Adaptation
            </h3>
            <div className="space-y-3">
              {adaptationRules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'bg-health-500/20 text-health-500' :
                    i === 1 ? 'bg-bio-500/20 text-bio-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {i === 0 ? <CheckCircle2 className="w-4 h-4" /> :
                     i === 1 ? <AlertTriangle className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {i === 0 ? 'Active' : i === 1 ? 'Pending' : 'Ready'}: {rule.action}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Trigger: {rule.trigger}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Focus Session Timer */}
          <div className="card-elevated p-6 text-center">
            <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
              <Timer className="w-5 h-5 text-ibmp-500" />
              Focus Session
            </h3>
            <div className="text-5xl font-mono font-bold mb-4">
              {formatTime(sessionTime)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {activePreset.name} • {activePreset.duration} min goal
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSessionActive(!isSessionActive)}
                className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                  isSessionActive 
                    ? 'bg-critical-500 text-white hover:bg-critical-600' 
                    : 'bg-health-500 text-white hover:bg-health-600'
                }`}
              >
                {isSessionActive ? 'End Session' : 'Start Session'}
              </button>
              <button 
                onClick={() => setSessionTime(0)}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Focus Mode Presets */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-neural-500" />
              Focus Modes
            </h3>
            <div className="space-y-2">
              {focusPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    activePreset.id === preset.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activePreset.id === preset.id ? 'bg-primary/20 text-primary' : 'bg-muted'
                    }`}>
                      <preset.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.duration} min</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Controls */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wind className="w-5 h-5 text-bio-500" />
              Environment
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Binaural Beats</span>
                  <span className="text-muted-foreground">{activePreset.binauralFreq} Hz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-muted-foreground" />
                  <input 
                    type="range" 
                    min="4" 
                    max="40" 
                    defaultValue={activePreset.binauralFreq}
                    className="flex-1 accent-primary"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Ambient Sound</span>
                  <span className="text-muted-foreground capitalize">{activePreset.ambientSound.replace('-', ' ')}</span>
                </div>
                <div className="flex gap-2">
                  {['silence', 'nature', 'brown-noise', 'ambient'].map((sound) => (
                    <button
                      key={sound}
                      className={`flex-1 py-2 rounded-lg text-xs capitalize transition-all ${
                        activePreset.ambientSound === sound
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {sound.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Lighting Mode</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'dim', icon: Moon },
                    { id: 'natural', icon: Sun },
                    { id: 'warm', icon: Sun },
                    { id: 'bright', icon: Sun },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      className={`flex-1 py-2 rounded-lg text-xs capitalize flex items-center justify-center gap-1 transition-all ${
                        activePreset.lightingMode === mode.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <mode.icon className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="card-elevated p-5 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-neural-500" />
              Today's Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Focus Time</span>
                <span className="font-medium">3h 45m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg. Focus Score</span>
                <span className="font-medium text-health-500">82%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Peak Hours</span>
                <span className="font-medium">9-11 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Break Compliance</span>
                <span className="font-medium">4/5</span>
              </div>
            </div>
            <button className="w-full mt-4 text-sm text-primary hover:underline">
              View detailed analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

