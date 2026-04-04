'use client';

import { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Float, Line, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Brain,
  Heart,
  Bone,
  Eye,
  Activity,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
  X,
  BookOpen,
  Target,
  Layers,
  Map,
} from 'lucide-react';

// Knowledge node data structure
interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  mastery: number; // 0-100
  connections: string[];
  description: string;
  position: [number, number, number];
  color: string;
  size: number;
  unlocked: boolean;
  prerequisites: string[];
}

// Sample knowledge graph data
const knowledgeNodes: KnowledgeNode[] = [
  // Core Cardiology
  {
    id: 'cardiac-anatomy',
    name: 'Cardiac Anatomy',
    category: 'Foundations',
    mastery: 95,
    connections: ['coronary-circulation', 'ecg-basics', 'cardiac-physiology'],
    description: 'Understanding of heart chambers, valves, and major vessels',
    position: [0, 0, 0],
    color: '#ef4444',
    size: 0.5,
    unlocked: true,
    prerequisites: [],
  },
  {
    id: 'cardiac-physiology',
    name: 'Cardiac Physiology',
    category: 'Foundations',
    mastery: 88,
    connections: ['cardiac-anatomy', 'hemodynamics', 'arrhythmias'],
    description: 'Electrical conduction and mechanical function of the heart',
    position: [2, 1, 0],
    color: '#ef4444',
    size: 0.45,
    unlocked: true,
    prerequisites: ['cardiac-anatomy'],
  },
  {
    id: 'coronary-circulation',
    name: 'Coronary Circulation',
    category: 'Vascular',
    mastery: 72,
    connections: ['cardiac-anatomy', 'cad', 'pci'],
    description: 'Blood supply to the myocardium and coronary artery anatomy',
    position: [-2, 1.5, 1],
    color: '#f59e0b',
    size: 0.4,
    unlocked: true,
    prerequisites: ['cardiac-anatomy'],
  },
  {
    id: 'ecg-basics',
    name: 'ECG Interpretation',
    category: 'Diagnostics',
    mastery: 65,
    connections: ['cardiac-anatomy', 'arrhythmias', 'stemi'],
    description: 'Reading and interpreting electrocardiograms',
    position: [1.5, -1.5, 0.5],
    color: '#0ba5ec',
    size: 0.45,
    unlocked: true,
    prerequisites: ['cardiac-anatomy'],
  },
  {
    id: 'hemodynamics',
    name: 'Hemodynamics',
    category: 'Advanced',
    mastery: 55,
    connections: ['cardiac-physiology', 'heart-failure', 'shock'],
    description: 'Study of blood flow and pressure dynamics',
    position: [3, 2.5, -1],
    color: '#a855f7',
    size: 0.4,
    unlocked: true,
    prerequisites: ['cardiac-physiology'],
  },
  {
    id: 'arrhythmias',
    name: 'Arrhythmias',
    category: 'Clinical',
    mastery: 48,
    connections: ['ecg-basics', 'cardiac-physiology', 'ablation'],
    description: 'Abnormal heart rhythms and their management',
    position: [2.5, -0.5, 2],
    color: '#14b8a6',
    size: 0.4,
    unlocked: true,
    prerequisites: ['ecg-basics', 'cardiac-physiology'],
  },
  {
    id: 'cad',
    name: 'Coronary Artery Disease',
    category: 'Clinical',
    mastery: 35,
    connections: ['coronary-circulation', 'stemi', 'pci'],
    description: 'Pathophysiology and management of CAD',
    position: [-3, 2, 0],
    color: '#14b8a6',
    size: 0.4,
    unlocked: true,
    prerequisites: ['coronary-circulation'],
  },
  {
    id: 'stemi',
    name: 'STEMI Management',
    category: 'Emergency',
    mastery: 28,
    connections: ['ecg-basics', 'cad', 'pci'],
    description: 'Acute management of ST-elevation myocardial infarction',
    position: [0, -2.5, 1.5],
    color: '#dc2626',
    size: 0.45,
    unlocked: true,
    prerequisites: ['ecg-basics', 'cad'],
  },
  {
    id: 'pci',
    name: 'Percutaneous Coronary Intervention',
    category: 'Interventional',
    mastery: 15,
    connections: ['coronary-circulation', 'cad', 'stemi', 'structural'],
    description: 'Catheter-based procedures for coronary intervention',
    position: [-2, -1, 2],
    color: '#10b981',
    size: 0.5,
    unlocked: true,
    prerequisites: ['cad', 'coronary-circulation'],
  },
  {
    id: 'heart-failure',
    name: 'Heart Failure',
    category: 'Clinical',
    mastery: 20,
    connections: ['hemodynamics', 'echo', 'devices'],
    description: 'Diagnosis and management of heart failure syndromes',
    position: [4, 3, 1],
    color: '#14b8a6',
    size: 0.4,
    unlocked: true,
    prerequisites: ['hemodynamics'],
  },
  {
    id: 'echo',
    name: 'Echocardiography',
    category: 'Imaging',
    mastery: 0,
    connections: ['heart-failure', 'structural', 'cardiac-anatomy'],
    description: 'Ultrasound imaging of the heart',
    position: [3, -2, -1],
    color: '#6366f1',
    size: 0.4,
    unlocked: false,
    prerequisites: ['cardiac-anatomy', 'cardiac-physiology'],
  },
  {
    id: 'ablation',
    name: 'Cardiac Ablation',
    category: 'Interventional',
    mastery: 0,
    connections: ['arrhythmias', 'electrophysiology'],
    description: 'Catheter ablation for arrhythmia treatment',
    position: [4, -1, 3],
    color: '#10b981',
    size: 0.35,
    unlocked: false,
    prerequisites: ['arrhythmias'],
  },
  {
    id: 'structural',
    name: 'Structural Heart Disease',
    category: 'Interventional',
    mastery: 0,
    connections: ['pci', 'echo', 'tavr'],
    description: 'Non-coronary structural heart interventions',
    position: [-3, -2, 0],
    color: '#10b981',
    size: 0.4,
    unlocked: false,
    prerequisites: ['pci', 'echo'],
  },
];

// 3D Knowledge Node Component
function KnowledgeNode3D({
  node,
  isSelected,
  isHovered,
  onClick,
  onHover,
}: {
  node: KnowledgeNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.05;
      
      // Scale on hover/select
      const targetScale = isSelected ? 1.3 : isHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (glowRef.current) {
      glowRef.current.scale.lerp(
        new THREE.Vector3(isSelected ? 1.8 : isHovered ? 1.5 : 1.2, isSelected ? 1.8 : isHovered ? 1.5 : 1.2, 1),
        0.1
      );
    }
  });

  const masteryColor = node.unlocked
    ? node.mastery > 80 ? '#10b981'
    : node.mastery > 50 ? '#f59e0b'
    : node.mastery > 20 ? '#0ba5ec'
    : '#6366f1'
    : '#64748b';

  return (
    <group position={node.position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[node.size * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={node.unlocked ? node.color : '#374151'}
          transparent
          opacity={isSelected ? 0.4 : isHovered ? 0.3 : 0.15}
        />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial
          color={node.unlocked ? node.color : '#4b5563'}
          emissive={node.unlocked ? node.color : '#374151'}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Progress ring */}
      {node.unlocked && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[node.size + 0.08, node.size + 0.12, 32, 1, 0, (node.mastery / 100) * Math.PI * 2]} />
          <meshBasicMaterial color={masteryColor} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Lock icon for locked nodes */}
      {!node.unlocked && (
        <Html center position={[0, 0, node.size + 0.1]}>
          <div className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center backdrop-blur-sm">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        </Html>
      )}

      {/* Label */}
      <Html
        center
        position={[0, -node.size - 0.3, 0]}
        style={{
          transition: 'opacity 0.2s',
          opacity: isHovered || isSelected ? 1 : 0.7,
        }}
      >
        <div
          className={`px-2 py-1 rounded-lg backdrop-blur-md whitespace-nowrap text-center transition-all ${
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80 border border-border'
          }`}
        >
          <div className="text-xs font-semibold">{node.name}</div>
          {node.unlocked && (
            <div className="text-[10px] opacity-70">{node.mastery}% mastery</div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Connection lines between nodes
function ConnectionLines({ nodes }: { nodes: KnowledgeNode[] }) {
  const lines = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    
    nodes.forEach((node) => {
      node.connections.forEach((connectionId) => {
        const targetNode = nodes.find((n) => n.id === connectionId);
        if (targetNode) {
          // Only add one line per pair (avoid duplicates)
          const existingLine = result.find(
            (l) =>
              (l.start[0] === node.position[0] && l.end[0] === targetNode.position[0]) ||
              (l.start[0] === targetNode.position[0] && l.end[0] === node.position[0])
          );
          if (!existingLine) {
            result.push({
              start: node.position,
              end: targetNode.position,
              color: node.unlocked && targetNode.unlocked ? '#64748b' : '#374151',
            });
          }
        }
      });
    });
    
    return result;
  }, [nodes]);

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start, line.end]}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
}

// Main scene component
function KnowledgeGraphScene({
  nodes,
  selectedNode,
  hoveredNode,
  onSelectNode,
  onHoverNode,
}: {
  nodes: KnowledgeNode[];
  selectedNode: string | null;
  hoveredNode: string | null;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.4} />
      <pointLight position={[0, 10, 0]} color="#0ba5ec" intensity={0.3} />

      <ConnectionLines nodes={nodes} />

      {nodes.map((node) => (
        <KnowledgeNode3D
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          isHovered={hoveredNode === node.id}
          onClick={() => onSelectNode(selectedNode === node.id ? null : node.id)}
          onHover={(hovered) => onHoverNode(hovered ? node.id : null)}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={15}
      />
    </>
  );
}

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(knowledgeNodes.map((n) => n.category))];
  
  const selectedNodeData = selectedNode
    ? knowledgeNodes.find((n) => n.id === selectedNode)
    : null;

  const filteredNodes = knowledgeNodes.filter((node) => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalMastery = Math.round(
    knowledgeNodes.filter((n) => n.unlocked).reduce((sum, n) => sum + n.mastery, 0) /
    knowledgeNodes.filter((n) => n.unlocked).length
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Main 3D View */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 card-elevated overflow-hidden">
          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-border text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="flex items-center gap-1 p-1 rounded-xl bg-background/80 backdrop-blur-md border border-border">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="glass-card px-4 py-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-neural-500" />
                  <span className="text-sm font-medium">{totalMastery}% Overall</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-health-500" />
                  <span className="text-sm">
                    {knowledgeNodes.filter((n) => n.unlocked).length}/{knowledgeNodes.length} Unlocked
                  </span>
                </div>
              </div>
              
              <button className="p-2 rounded-xl bg-background/80 backdrop-blur-md border border-border hover:bg-muted transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <KnowledgeGraphScene
                nodes={filteredNodes}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                onSelectNode={setSelectedNode}
                onHoverNode={setHoveredNode}
              />
            </Suspense>
          </Canvas>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-card p-3">
            <div className="text-xs font-medium mb-2">Mastery Level</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-health-500" />
                <span className="text-xs">80%+</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-achievement-500" />
                <span className="text-xs">50-80%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-ibmp-500" />
                <span className="text-xs">20-50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-neural-500" />
                <span className="text-xs">&lt;20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-steel-500" />
                <span className="text-xs">Locked</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
            Drag to rotate • Scroll to zoom • Click nodes to explore
          </div>
        </div>
      </div>

      {/* Right Sidebar - Node Details */}
      <AnimatePresence mode="wait">
        {selectedNodeData && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="h-full card-elevated p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedNodeData.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: selectedNodeData.color }}
                  />
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {selectedNodeData.category}
                  </span>
                  <h2 className="text-xl font-semibold mt-1">{selectedNodeData.name}</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedNodeData.description}
                  </p>
                </div>

                {/* Mastery Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Mastery Level</span>
                    <span className="text-sm font-semibold">{selectedNodeData.mastery}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNodeData.mastery}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: selectedNodeData.color }}
                    />
                  </div>
                  {!selectedNodeData.unlocked && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Complete prerequisites to unlock
                    </div>
                  )}
                </div>

                {/* Prerequisites */}
                {selectedNodeData.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      Prerequisites
                    </h4>
                    <div className="space-y-2">
                      {selectedNodeData.prerequisites.map((prereqId) => {
                        const prereq = knowledgeNodes.find((n) => n.id === prereqId);
                        if (!prereq) return null;
                        return (
                          <button
                            key={prereqId}
                            onClick={() => setSelectedNode(prereqId)}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: prereq.color }}
                              />
                              <span className="text-sm font-medium">{prereq.name}</span>
                            </div>
                            {prereq.mastery > 0 ? (
                              <CheckCircle2 className="w-4 h-4 text-health-500" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{prereq.mastery}%</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Connected Topics */}
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    Connected Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNodeData.connections.map((connectionId) => {
                      const connectedNode = knowledgeNodes.find((n) => n.id === connectionId);
                      if (!connectedNode) return null;
                      return (
                        <button
                          key={connectionId}
                          onClick={() => setSelectedNode(connectionId)}
                          className="px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: connectedNode.color }}
                          />
                          {connectedNode.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-border">
                  {selectedNodeData.unlocked ? (
                    <>
                      <button className="w-full btn-primary flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Study This Topic
                      </button>
                      <button className="w-full btn-outline flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Ask Dr. Nexus
                      </button>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <Lock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Complete the prerequisites to unlock this topic
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

