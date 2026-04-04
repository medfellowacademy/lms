'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Target,
  Users,
  Award,
  GraduationCap,
  Building,
  Globe,
  ChevronRight,
  Star,
  Heart,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Brain,
  Rocket,
  Shield,
  BadgeCheck,
  Compass,
  Map,
  Route,
} from 'lucide-react';

// Career path predictions
const careerPaths = [
  {
    id: 'interventional',
    title: 'Interventional Cardiology',
    matchScore: 94,
    salary: { min: 450000, max: 700000, median: 580000 },
    growth: '+18%',
    openings: 2450,
    timeline: '2-3 years',
    demand: 'Very High',
    workLifeBalance: 65,
    academicFit: 88,
    clinicalFit: 95,
    researchFit: 72,
    skills: ['PCI', 'STEMI management', 'Structural intervention'],
    topLocations: ['Boston', 'Houston', 'Cleveland', 'NYC'],
    topEmployers: ['Cleveland Clinic', 'Mayo Clinic', 'Mass General'],
    aiInsight: 'Your strong procedural skills and spatial reasoning make you an excellent fit. Consider focusing on complex PCI training.',
  },
  {
    id: 'structural',
    title: 'Structural Heart Disease',
    matchScore: 89,
    salary: { min: 500000, max: 850000, median: 650000 },
    growth: '+32%',
    openings: 890,
    timeline: '3-4 years',
    demand: 'Extremely High',
    workLifeBalance: 58,
    academicFit: 85,
    clinicalFit: 92,
    researchFit: 78,
    skills: ['TAVR', 'MitraClip', 'TMVR', 'Imaging'],
    topLocations: ['LA', 'Chicago', 'Atlanta', 'Dallas'],
    topEmployers: ['Cedars-Sinai', 'Northwestern', 'Emory'],
    aiInsight: 'Emerging field with explosive growth. Your imaging skills are strong - consider structural fellowship after IC.',
  },
  {
    id: 'electrophysiology',
    title: 'Clinical Electrophysiology',
    matchScore: 76,
    salary: { min: 400000, max: 650000, median: 520000 },
    growth: '+12%',
    openings: 1200,
    timeline: '2-3 years',
    demand: 'High',
    workLifeBalance: 72,
    academicFit: 80,
    clinicalFit: 85,
    researchFit: 88,
    skills: ['Ablation', 'Device implantation', 'EP mapping'],
    topLocations: ['Philadelphia', 'Minneapolis', 'Denver'],
    topEmployers: ['Penn Medicine', 'Abbott Northwestern'],
    aiInsight: 'Good fit if you prefer scheduled procedures. Your analytical skills align well with complex arrhythmia management.',
  },
  {
    id: 'imaging',
    title: 'Advanced Cardiac Imaging',
    matchScore: 71,
    salary: { min: 350000, max: 550000, median: 450000 },
    growth: '+15%',
    openings: 780,
    timeline: '1-2 years',
    demand: 'Medium-High',
    workLifeBalance: 85,
    academicFit: 92,
    clinicalFit: 78,
    researchFit: 95,
    skills: ['Echo', 'CT', 'MRI', 'Nuclear'],
    topLocations: ['Ann Arbor', 'Stanford', 'Duke'],
    topEmployers: ['University of Michigan', 'Stanford Health'],
    aiInsight: 'Excellent work-life balance with strong academic opportunities. Your pattern recognition scores are above average.',
  },
];

// Skill gap analysis
const skillGaps = [
  { skill: 'Complex PCI', current: 72, required: 85, priority: 'high' },
  { skill: 'IVUS/OCT Interpretation', current: 68, required: 80, priority: 'high' },
  { skill: 'Hemodynamic Support', current: 55, required: 75, priority: 'medium' },
  { skill: 'Research Publications', current: 45, required: 60, priority: 'medium' },
  { skill: 'Leadership', current: 65, required: 70, priority: 'low' },
];

// Job market trends
const marketTrends = [
  { year: '2024', openings: 3200, avgSalary: 520000 },
  { year: '2025', openings: 3600, avgSalary: 545000 },
  { year: '2026', openings: 4100, avgSalary: 572000 },
  { year: '2027', openings: 4500, avgSalary: 601000 },
  { year: '2028', openings: 4900, avgSalary: 632000 },
];

// Mentorship recommendations
const mentors = [
  {
    name: 'User Name',
    title: 'Director, Interventional Cardiology',
    institution: 'Cleveland Clinic',
    match: 95,
    specialties: ['CTO', 'Complex PCI', 'Research'],
    available: true,
  },
  {
    name: 'Dr. Michael Rodriguez',
    title: 'Chief, Structural Heart Program',
    institution: 'Cedars-Sinai',
    match: 88,
    specialties: ['TAVR', 'MitraClip', 'Clinical trials'],
    available: true,
  },
  {
    name: 'User Name',
    title: 'Associate Professor',
    institution: 'Duke University',
    match: 82,
    specialties: ['Imaging', 'Women in cardiology', 'Mentorship'],
    available: false,
  },
];

export default function CareerAIPage() {
  const [selectedPath, setSelectedPath] = useState(careerPaths[0]);
  const [activeTab, setActiveTab] = useState<'paths' | 'skills' | 'market' | 'mentors'>('paths');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Compass className="w-7 h-7 text-neural-500" />
            Predictive Career Intelligence
          </h1>
          <p className="text-muted-foreground">
            AI-powered career guidance analyzing 10M+ physician trajectories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neural-500/10 border border-neural-500/30">
            <Sparkles className="w-4 h-4 text-neural-500" />
            <span className="text-sm font-medium">AI Analysis Active</span>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'paths', label: 'Career Paths', icon: Route },
          { id: 'skills', label: 'Skill Analysis', icon: Target },
          { id: 'market', label: 'Job Market', icon: TrendingUp },
          { id: 'mentors', label: 'Mentors', icon: Users },
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

      {activeTab === 'paths' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Paths List */}
          <div className="space-y-4">
            <h2 className="font-semibold">Recommended Paths</h2>
            {careerPaths.map((path) => (
              <motion.button
                key={path.id}
                onClick={() => setSelectedPath(path)}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedPath.id === path.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{path.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                    path.matchScore >= 90 ? 'bg-health-500/20 text-health-500' :
                    path.matchScore >= 80 ? 'bg-ibmp-500/20 text-ibmp-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {path.matchScore}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${(path.salary.median / 1000).toFixed(0)}K
                  </span>
                  <span className="flex items-center gap-1 text-health-500">
                    <TrendingUp className="w-3 h-3" />
                    {path.growth}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {path.timeline}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected Path Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPath && (
              <>
                {/* Overview Card */}
                <div className="card-elevated p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedPath.title}</h2>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedPath.demand === 'Extremely High' ? 'bg-health-500/20 text-health-500' :
                          selectedPath.demand === 'Very High' ? 'bg-ibmp-500/20 text-ibmp-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {selectedPath.demand} Demand
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {selectedPath.openings.toLocaleString()} open positions
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text">{selectedPath.matchScore}%</div>
                      <div className="text-sm text-muted-foreground">Match Score</div>
                    </div>
                  </div>

                  {/* Fit Analysis */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-ibmp-500">{selectedPath.clinicalFit}%</div>
                      <div className="text-sm text-muted-foreground">Clinical Fit</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-neural-500">{selectedPath.academicFit}%</div>
                      <div className="text-sm text-muted-foreground">Academic Fit</div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-bio-500">{selectedPath.researchFit}%</div>
                      <div className="text-sm text-muted-foreground">Research Fit</div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="p-4 rounded-xl bg-neural-500/10 border border-neural-500/30">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-neural-500 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">AI Career Insight</div>
                        <p className="text-sm text-muted-foreground">{selectedPath.aiInsight}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary & Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="card-elevated p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-achievement-500" />
                      Compensation
                    </h3>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold">${(selectedPath.salary.median / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-muted-foreground">Median Salary</div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="text-center">
                        <div className="font-semibold">${(selectedPath.salary.min / 1000).toFixed(0)}K</div>
                        <div className="text-muted-foreground">Min</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">${(selectedPath.salary.max / 1000).toFixed(0)}K</div>
                        <div className="text-muted-foreground">Max</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-elevated p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-bio-500" />
                      Top Locations
                    </h3>
                    <div className="space-y-2">
                      {selectedPath.topLocations.map((loc, i) => (
                        <div key={loc} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                          <span>{loc}</span>
                          <span className="text-muted-foreground">#{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Required Skills & Top Employers */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="card-elevated p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-ibmp-500" />
                      Core Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-ibmp-500/10 text-ibmp-500 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-elevated p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5 text-neural-500" />
                      Top Employers
                    </h3>
                    <div className="space-y-2">
                      {selectedPath.topEmployers.map((employer) => (
                        <div key={employer} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-health-500" />
                          {employer}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skill Gap Analysis */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-ibmp-500" />
              Skill Gap Analysis for {selectedPath.title}
            </h3>
            <div className="space-y-6">
              {skillGaps.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        skill.priority === 'high' ? 'bg-critical-500/20 text-critical-500' :
                        skill.priority === 'medium' ? 'bg-achievement-500/20 text-achievement-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {skill.priority} priority
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{skill.current}%</span>
                      <span className="text-muted-foreground"> / {skill.required}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.current}%` }}
                      className={`h-full ${
                        skill.current >= skill.required ? 'bg-health-500' :
                        skill.current >= skill.required * 0.8 ? 'bg-achievement-500' :
                        'bg-critical-500'
                      }`}
                    />
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                      style={{ left: `${skill.required}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-achievement-500" />
                Personalized Recommendations
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Complete Advanced PCI Module', impact: '+8% skill', course: 'CTO Mastery' },
                  { action: 'Practice IVUS interpretation cases', impact: '+5% skill', course: 'Imaging Deep Dive' },
                  { action: 'Shadow Impella procedures', impact: '+12% skill', course: 'VR Surgery Lab' },
                ].map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-achievement-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-achievement-500">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{rec.action}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="text-health-500">{rec.impact}</span>
                        <span>•</span>
                        <span>{rec.course}</span>
                      </div>
                    </div>
                    <button className="text-xs text-primary hover:underline">Start</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-neural-500" />
                AI Career Coach
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your learning velocity and current trajectory, you could be fellowship-ready 
                in <span className="font-semibold text-foreground">8 months</span> with focused effort 
                on Complex PCI and hemodynamic support skills.
              </p>
              <button className="btn-secondary w-full text-sm py-2">
                Chat with Career AI
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Market Projection Chart */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-health-500" />
                5-Year Market Projection: {selectedPath.title}
              </h3>
              <div className="h-64 flex items-end justify-between gap-4">
                {marketTrends.map((data, i) => (
                  <div key={data.year} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-medium">${(data.avgSalary / 1000).toFixed(0)}K</div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.openings / 5000) * 100}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-health-500 to-health-400 relative"
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
                        {data.openings.toLocaleString()}
                      </div>
                    </motion.div>
                    <span className="text-sm text-muted-foreground">{data.year}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-health-500" />
                  Job Openings
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-foreground" />
                  Avg Salary
                </span>
              </div>
            </div>

            {/* Geographic Heatmap */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-bio-500" />
                Geographic Demand Distribution
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { region: 'Northeast', demand: 'Very High', openings: 850 },
                  { region: 'Midwest', demand: 'High', openings: 620 },
                  { region: 'South', demand: 'High', openings: 780 },
                  { region: 'West', demand: 'Medium', openings: 520 },
                ].map((region) => (
                  <div key={region.region} className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="font-semibold mb-1">{region.region}</div>
                    <div className={`text-sm ${
                      region.demand === 'Very High' ? 'text-health-500' :
                      region.demand === 'High' ? 'text-ibmp-500' :
                      'text-muted-foreground'
                    }`}>
                      {region.demand}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {region.openings} positions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Insights Sidebar */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-health-500" />
                Market Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-health-500 mt-0.5" />
                  <p className="text-sm">Demand projected to grow 32% by 2028</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-health-500 mt-0.5" />
                  <p className="text-sm">Average salary increase of 4.8% annually</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-achievement-500 mt-0.5" />
                  <p className="text-sm">Competition highest in academic centers</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5 bg-gradient-to-br from-achievement-500/5 to-ibmp-500/5 border-achievement-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-achievement-500" />
                Hot Skills 2025
              </h3>
              <div className="space-y-2">
                {['AI-assisted diagnostics', 'Robotic PCI', 'Complex CTO', 'MitraClip/TMVR', 'Remote monitoring'].map((skill) => (
                  <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                    <span>{skill}</span>
                    <TrendingUp className="w-4 h-4 text-health-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mentors' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor.name} className="card-elevated p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-2xl font-bold text-white">
                  {mentor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  <p className="text-sm text-muted-foreground">{mentor.institution}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm font-bold ${
                  mentor.match >= 90 ? 'bg-health-500/20 text-health-500' :
                  'bg-ibmp-500/20 text-ibmp-500'
                }`}>
                  {mentor.match}%
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.specialties.map((spec) => (
                  <span key={spec} className="px-2 py-1 rounded-full bg-muted text-xs">
                    {spec}
                  </span>
                ))}
              </div>

              <button 
                className={`w-full py-2 rounded-xl font-medium transition-all ${
                  mentor.available 
                    ? 'btn-primary' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
                disabled={!mentor.available}
              >
                {mentor.available ? 'Request Mentorship' : 'Currently Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

