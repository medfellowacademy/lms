'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  TrendingUp,
  Zap,
  Award,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Flag,
  Eye,
  EyeOff,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Timer,
  Gauge,
  LineChart,
  SkipForward,
  Volume2,
  VolumeX,
  BookOpen,
  GraduationCap,
  Star,
} from 'lucide-react';

// Questions will be loaded from the database
const sampleQuestions: any[] = [];

// Test modes
const testModes = [
  { id: 'practice', name: 'Practice Mode', description: 'Unlimited time, hints enabled', icon: BookOpen },
  { id: 'timed', name: 'Timed Exam', description: 'Simulates real board conditions', icon: Timer },
  { id: 'adaptive', name: 'Adaptive AI', description: 'Questions adjust to your level', icon: Brain },
  { id: 'review', name: 'Review Mode', description: 'Focus on weak areas', icon: Target },
];

// Performance data will be loaded from the database
const performanceData = {
  totalAttempts: 0,
  correctRate: 0,
  avgTime: '0:00',
  streak: 0,
  topicBreakdown: [],
  difficultyProgression: [],
};

export default function AdaptiveTestingPage() {
  const [selectedMode, setSelectedMode] = useState(testModes[2]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  const currentQuestion = sampleQuestions[currentQuestionIndex] || null;

  useEffect(() => {
    if (isTestActive && timeLeft > 0 && !showExplanation) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTestActive, timeLeft, showExplanation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index);
      setAnswers({ ...answers, [currentQuestion.id]: index });
    }
  };

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[sampleQuestions[currentQuestionIndex + 1]?.id] ?? null);
      setShowExplanation(false);
      setShowHint(false);
      setTimeLeft(sampleQuestions[currentQuestionIndex + 1].timeAllowed);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[sampleQuestions[currentQuestionIndex - 1]?.id] ?? null);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const toggleFlag = () => {
    if (flaggedQuestions.includes(currentQuestion.id)) {
      setFlaggedQuestions(flaggedQuestions.filter(id => id !== currentQuestion.id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion.id]);
    }
  };

  if (!isTestActive) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Brain className="w-7 h-7 text-neural-500" />
              Adaptive Intelligence Testing
            </h1>
            <p className="text-muted-foreground">
              AI-powered assessments that adapt to your knowledge level in real-time
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Test Mode Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-elevated p-6">
              <h2 className="font-semibold mb-6">Select Test Mode</h2>
              <div className="grid grid-cols-2 gap-4">
                {testModes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedMode.id === mode.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedMode.id === mode.id ? 'bg-primary/20 text-primary' : 'bg-muted'
                      }`}>
                        <mode.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{mode.name}</h3>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="card-elevated p-6">
              <h2 className="font-semibold mb-4">Select Topics</h2>
              <div className="flex flex-wrap gap-2">
                {performanceData.topicBreakdown.length > 0 ? (
                  performanceData.topicBreakdown.map((topic: any) => (
                    <button
                      key={topic.topic}
                      className="px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all text-sm"
                    >
                      {topic.topic}
                      <span className="ml-2 text-muted-foreground">({topic.attempts})</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No topics available yet. Start practicing to see your topic breakdown.</p>
                )}
                <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm">
                  All Topics
                </button>
              </div>
            </div>

            {/* Start Test */}
            <div className="card-elevated p-6 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMode.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMode.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">50</div>
                  <div className="text-sm text-muted-foreground">questions</div>
                </div>
              </div>
              <button 
                onClick={() => setIsTestActive(true)}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Assessment
              </button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-ibmp-500" />
                Your Performance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold text-health-500">{performanceData.correctRate}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{performanceData.totalAttempts}</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold">{performanceData.avgTime}</div>
                  <div className="text-xs text-muted-foreground">Avg Time</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-center">
                  <div className="text-2xl font-bold text-achievement-500">{performanceData.streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-neural-500" />
                Topic Mastery
              </h3>
              <div className="space-y-3">
                {performanceData.topicBreakdown.length > 0 ? performanceData.topicBreakdown.map((topic: any) => (
                  <div key={topic.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{topic.topic}</span>
                      <span className={`font-medium ${
                        topic.score >= 80 ? 'text-health-500' :
                        topic.score >= 70 ? 'text-ibmp-500' :
                        'text-achievement-500'
                      }`}>{topic.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.score}%` }}
                        className={`h-full ${
                          topic.score >= 80 ? 'bg-health-500' :
                          topic.score >= 70 ? 'bg-ibmp-500' :
                          'bg-achievement-500'
                        }`}
                      />
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No topic data available yet.</p>
                )}
              </div>
            </div>

            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-health-500" />
                Progress Trend
              </h3>
              <div className="h-24 flex items-end justify-between gap-2">
                {performanceData.difficultyProgression.length > 0 ? performanceData.difficultyProgression.map((data: any, i: number) => (
                  <div key={data.week} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.score}%` }}
                      className="w-full bg-gradient-to-t from-health-500 to-health-400 rounded-t"
                    />
                    <span className="text-xs text-muted-foreground">{data.week}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center w-full">No progress data available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (sampleQuestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="card-elevated p-12 text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Questions Available</h2>
          <p className="text-muted-foreground">Questions will be loaded from the database.</p>
          <button 
            onClick={() => setIsTestActive(false)}
            className="btn-primary mt-6"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <div className="card-elevated p-4 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsTestActive(false)}
            className="btn-outline py-1.5 px-3 text-sm"
          >
            Exit Test
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Question</span>
            <span className="font-semibold">{currentQuestionIndex + 1} / {sampleQuestions.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            timeLeft <= 30 ? 'bg-critical-500/10 text-critical-500' : 'bg-muted'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
          
          <button 
            onClick={toggleFlag}
            className={`p-2 rounded-lg ${
              currentQuestion && flaggedQuestions.includes(currentQuestion.id) 
                ? 'bg-achievement-500/20 text-achievement-500' 
                : 'bg-muted'
            }`}
          >
            <Flag className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg bg-muted">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card-elevated p-6">
            {!currentQuestion ? (
              <p className="text-center text-muted-foreground">No question available</p>
            ) : (
              <>
            {/* Question Meta */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'intermediate' ? 'bg-ibmp-500/20 text-ibmp-500' :
                currentQuestion.difficulty === 'advanced' ? 'bg-achievement-500/20 text-achievement-500' :
                'bg-neural-500/20 text-neural-500'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-sm">
                {currentQuestion.topic}
              </span>
              {currentQuestion.type === 'case' && (
                <span className="px-3 py-1 rounded-full bg-critical-500/20 text-critical-500 text-sm">
                  Case-based
                </span>
              )}
            </div>

            {/* Question Text */}
            <p className="text-lg mb-6">{currentQuestion.question}</p>

            {/* Image if present */}
            {currentQuestion.type === 'image' && currentQuestion.imageUrl && (
              <div className="mb-6">
                <img 
                  src={currentQuestion.imageUrl} 
                  alt="Medical imaging"
                  className="w-full max-w-xl rounded-xl border border-border"
                />
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion?.options?.map((option: string, index: number) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = showExplanation;
                
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={!showExplanation ? { scale: 1.01 } : {}}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      showResult
                        ? isCorrect
                          ? 'border-health-500 bg-health-500/10'
                          : isSelected
                            ? 'border-critical-500 bg-critical-500/10'
                            : 'border-border'
                        : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                    }`}
                    disabled={showExplanation}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        showResult
                          ? isCorrect
                            ? 'bg-health-500 text-white'
                            : isSelected
                              ? 'bg-critical-500 text-white'
                              : 'bg-muted'
                          : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                      }`}>
                        {showResult ? (
                          isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                          isSelected ? <XCircle className="w-5 h-5" /> :
                          <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                        ) : (
                          <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <span className="pt-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && !showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 rounded-xl bg-neural-500/10 border border-neural-500/30"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-neural-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-neural-500">AI Hint</span>
                      <p className="text-sm text-muted-foreground mt-1">{currentQuestion.aiHint}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-ibmp-500 mt-0.5" />
                    <span className="font-semibold">Explanation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="btn-outline py-2 px-4 flex items-center gap-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {!showExplanation && (
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="btn-secondary py-2 px-4 flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Hint
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                {!showExplanation ? (
                  <button 
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null}
                    className="btn-primary py-2 px-6 disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="btn-primary py-2 px-4 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
              </>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="space-y-6">
          <div className="card-elevated p-5">
            <h3 className="font-semibold mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {sampleQuestions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = flaggedQuestions.includes(q.id);
                const isCurrent = i === currentQuestionIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(i);
                      setSelectedAnswer(answers[q.id] ?? null);
                      setShowExplanation(false);
                      setShowHint(false);
                    }}
                    className={`w-full aspect-square rounded-lg text-sm font-medium relative ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isAnswered
                          ? 'bg-health-500/20 text-health-500'
                          : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {i + 1}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-achievement-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-health-500/20" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" /> Unanswered
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-achievement-500" /> Flagged
              </span>
            </div>
          </div>

          <div className="card-elevated p-5 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neural-500" />
              AI Difficulty Adjustment
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your performance, difficulty is being adjusted in real-time.
            </p>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-ibmp-500" />
              <span className="text-sm font-medium">Current Level:</span>
              <span className="px-2 py-0.5 rounded-full bg-ibmp-500/20 text-ibmp-500 text-xs font-medium">
                Intermediate+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

