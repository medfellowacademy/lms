'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  FileText,
  Search,
  Brain,
  Sparkles,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  ExternalLink,
  Download,
  Star,
  Zap,
  Target,
  BarChart3,
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Send,
  Copy,
  RefreshCw,
  Filter,
  ArrowUpRight,
  Quote,
  Bookmark,
  Share2,
  MessageSquare,
  Plus,
  Loader2,
} from 'lucide-react';

// Research projects
const myProjects = [
  {
    id: 1,
    title: 'Machine Learning for CTO Crossing Prediction',
    status: 'In Progress',
    progress: 65,
    collaborators: 4,
    aiAssistance: 'Active',
    dueDate: 'Mar 15, 2025',
  },
  {
    id: 2,
    title: 'Long-term Outcomes of MitraClip in HFrEF',
    status: 'Data Collection',
    progress: 35,
    collaborators: 6,
    aiAssistance: 'Active',
    dueDate: 'Jun 1, 2025',
  },
  {
    id: 3,
    title: 'Novel Biomarkers in ACS',
    status: 'Review',
    progress: 90,
    collaborators: 3,
    aiAssistance: 'Paused',
    dueDate: 'Jan 30, 2025',
  },
];

// Recommended papers
const recommendedPapers = [
  {
    id: 1,
    title: 'Artificial Intelligence in Interventional Cardiology: Current Applications and Future Directions',
    journal: 'JACC: Cardiovascular Interventions',
    year: 2024,
    citations: 156,
    relevance: 98,
    abstract: 'A comprehensive review of AI applications in the cath lab...',
  },
  {
    id: 2,
    title: 'Physiological Assessment of Coronary Stenosis: FFR vs iFR Meta-analysis',
    journal: 'European Heart Journal',
    year: 2024,
    citations: 89,
    relevance: 94,
    abstract: 'Updated meta-analysis comparing FFR and iFR outcomes...',
  },
  {
    id: 3,
    title: 'Next-Generation Drug-Eluting Stents: 5-Year Follow-up',
    journal: 'NEJM',
    year: 2024,
    citations: 234,
    relevance: 91,
    abstract: 'Long-term outcomes of ultrathin strut DES...',
  },
];

// Writing assistant suggestions
const writingSuggestions = [
  { type: 'clarity', text: 'Consider simplifying the methodology description', section: 'Methods' },
  { type: 'citation', text: 'Missing citation for "recent meta-analysis"', section: 'Introduction' },
  { type: 'structure', text: 'Results section could benefit from subheadings', section: 'Results' },
];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'literature' | 'assistant' | 'collaborate'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-bio-500" />
            Research Accelerator
          </h1>
          <p className="text-muted-foreground">
            AI-powered research assistant for literature review, writing, and collaboration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            My Library
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'projects', label: 'My Projects', icon: Target },
          { id: 'literature', label: 'Literature AI', icon: Search },
          { id: 'assistant', label: 'Writing Assistant', icon: FileText },
          { id: 'collaborate', label: 'Collaborate', icon: Users },
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

      {activeTab === 'projects' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2 space-y-4">
            {myProjects.map((project) => (
              <div key={project.id} className="card-elevated p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full ${
                        project.status === 'In Progress' ? 'bg-ibmp-500/20 text-ibmp-500' :
                        project.status === 'Review' ? 'bg-health-500/20 text-health-500' :
                        'bg-achievement-500/20 text-achievement-500'
                      }`}>
                        {project.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.collaborators}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.aiAssistance === 'Active' 
                        ? 'bg-neural-500/20 text-neural-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      AI {project.aiAssistance}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-gradient-to-r from-bio-500 to-health-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn-secondary text-sm py-1.5 flex-1">Open Project</button>
                  <button className="btn-outline text-sm py-1.5">
                    <Brain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Research Stats */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-ibmp-500" />
                Research Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Active Projects</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Publications</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">458</div>
                  <div className="text-xs text-muted-foreground">Citations</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">H-Index</div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5 bg-gradient-to-br from-bio-500/5 to-health-500/5 border-bio-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-bio-500" />
                AI Research Ideas
              </h3>
              <div className="space-y-3">
                {[
                  'Compare outcomes of iFR vs FFR in diabetic patients',
                  'VR training impact on procedural competency',
                  'ML model for CTO J-score prediction',
                ].map((idea, i) => (
                  <div key={i} className="p-3 rounded-xl bg-background/50 text-sm">
                    <p>{idea}</p>
                    <button className="text-xs text-primary mt-2 hover:underline">
                      Explore with AI →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'literature' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Literature Search */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-neural-500" />
                AI-Powered Literature Search
              </h3>
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask in natural language: 'What are the latest outcomes of TAVR in low-risk patients?'"
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-muted border border-border"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-4"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button className="px-3 py-1.5 rounded-full bg-muted text-sm">All Sources</button>
                <button className="px-3 py-1.5 rounded-full bg-muted text-sm">PubMed</button>
                <button className="px-3 py-1.5 rounded-full bg-muted text-sm">Cochrane</button>
                <button className="px-3 py-1.5 rounded-full bg-muted text-sm">My Library</button>
              </div>

              {/* Search Results / Recommendations */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Recommended for your research</h4>
                {recommendedPapers.map((paper) => (
                  <div key={paper.id} className="p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 hover:text-primary cursor-pointer">
                          {paper.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{paper.journal}</span>
                          <span>{paper.year}</span>
                          <span className="flex items-center gap-1">
                            <Quote className="w-3 h-3" />
                            {paper.citations}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-health-500/20 text-health-500 text-xs font-medium">
                        {paper.relevance}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{paper.abstract}</p>
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Full Text
                      </button>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Bookmark className="w-3 h-3" />
                        Save
                      </button>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        Summarize
                      </button>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        Cite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Analysis Panel */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neural-500" />
                AI Literature Analysis
              </h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="font-medium mb-1">Key Themes</div>
                  <div className="flex flex-wrap gap-2">
                    {['AI in cardiology', 'CTO outcomes', 'DES evolution', 'Imaging advances'].map((theme) => (
                      <span key={theme} className="px-2 py-1 rounded-full bg-neural-500/10 text-neural-500 text-xs">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="font-medium mb-1">Trending Topics</div>
                  <div className="space-y-2">
                    {[
                      { topic: 'AI-assisted PCI', trend: '+45%' },
                      { topic: 'Robotic interventions', trend: '+32%' },
                      { topic: 'Bioresorbable scaffolds', trend: '-15%' },
                    ].map((item) => (
                      <div key={item.topic} className="flex justify-between text-xs">
                        <span>{item.topic}</span>
                        <span className={item.trend.startsWith('+') ? 'text-health-500' : 'text-critical-500'}>
                          {item.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-achievement-500" />
                Your Library
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Saved Papers</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Collections</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Annotations</span>
                  <span className="font-medium">342</span>
                </div>
              </div>
              <button className="w-full mt-4 text-sm text-primary hover:underline">
                Open Library
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assistant' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Writing Editor */}
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-ibmp-500" />
                  AI Writing Assistant
                </h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-muted text-sm">Methods</button>
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">Results</button>
                  <button className="px-3 py-1.5 rounded-lg bg-muted text-sm">Discussion</button>
                </div>
              </div>
              
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Start writing or paste your text here. The AI will help improve clarity, suggest citations, and enhance your academic writing..."
                className="w-full h-64 p-4 rounded-xl bg-muted border border-border resize-none text-sm"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Improve Clarity
                  </button>
                  <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                    <Quote className="w-4 h-4" />
                    Find Citations
                  </button>
                  <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Rephrase
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Word count: 0
                </div>
              </div>
            </div>

            {/* AI Chat for Writing Help */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-neural-500" />
                Ask AI for Writing Help
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask: 'How should I structure my limitations section?' or 'Help me write a compelling abstract'"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Writing Suggestions */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-achievement-500" />
                AI Suggestions
              </h3>
              <div className="space-y-3">
                {writingSuggestions.map((suggestion, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        suggestion.type === 'clarity' ? 'bg-ibmp-500/20 text-ibmp-500' :
                        suggestion.type === 'citation' ? 'bg-critical-500/20 text-critical-500' :
                        'bg-achievement-500/20 text-achievement-500'
                      }`}>
                        {suggestion.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{suggestion.section}</span>
                    </div>
                    <p className="text-sm">{suggestion.text}</p>
                    <button className="text-xs text-primary mt-2 hover:underline">Fix →</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-health-500" />
                Writing Checklist
              </h3>
              <div className="space-y-2">
                {[
                  { item: 'Abstract complete', done: true },
                  { item: 'Introduction with citations', done: true },
                  { item: 'Methods detailed', done: false },
                  { item: 'Results with figures', done: false },
                  { item: 'Discussion structured', done: false },
                  { item: 'References formatted', done: false },
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      check.done ? 'bg-health-500 border-health-500' : 'border-muted-foreground'
                    }`}>
                      {check.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={check.done ? 'text-muted-foreground line-through' : ''}>
                      {check.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'collaborate' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-elevated p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-ibmp-500" />
              Find Research Collaborators
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: 'User Name',
                  institution: 'Cleveland Clinic',
                  expertise: ['CTO', 'Complex PCI', 'AI'],
                  hIndex: 32,
                  match: 94,
                },
                {
                  name: 'User Name',
                  institution: 'Mayo Clinic',
                  expertise: ['Structural', 'TAVR', 'Clinical Trials'],
                  hIndex: 45,
                  match: 88,
                },
                {
                  name: 'User Name',
                  institution: 'Duke University',
                  expertise: ['Imaging', 'ML', 'Outcomes Research'],
                  hIndex: 28,
                  match: 82,
                },
              ].map((collaborator, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/50 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-xl font-bold text-white">
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{collaborator.name}</h4>
                    <p className="text-sm text-muted-foreground">{collaborator.institution}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {collaborator.expertise.map((exp) => (
                        <span key={exp} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-health-500">{collaborator.match}%</span>
                    <div className="text-xs text-muted-foreground">match</div>
                    <div className="text-xs text-muted-foreground mt-1">H-index: {collaborator.hIndex}</div>
                  </div>
                  <button className="btn-primary py-2">Connect</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4">Your Network</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Collaborators</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Projects</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Co-authored Papers</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

