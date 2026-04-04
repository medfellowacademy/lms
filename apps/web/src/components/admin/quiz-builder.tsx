'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  Copy,
  Save,
  X,
  CheckCircle2,
  Circle,
  Square,
  List,
  FileText,
  Brain,
  Clock,
  Zap,
  Target,
} from 'lucide-react';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'CASE_BASED' | 'IMAGE_BASED';
  question: string;
  explanation?: string;
  hint?: string;
  imageUrl?: string;
  points: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  topic?: string;
  subtopic?: string;
  options: QuestionOption[];
  correctAnswer?: string; // For SHORT_ANSWER
  isExpanded?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  type: 'STANDARD' | 'ADAPTIVE' | 'CERTIFICATION' | 'PRACTICE' | 'BOARD_PREP';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  questions: Question[];
}

interface QuizBuilderProps {
  quiz?: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel?: () => void;
}

const questionTypes = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: Circle, description: 'Single correct answer' },
  { value: 'MULTIPLE_SELECT', label: 'Multiple Select', icon: CheckCircle2, description: 'Multiple correct answers' },
  { value: 'TRUE_FALSE', label: 'True/False', icon: Square, description: 'True or false question' },
  { value: 'SHORT_ANSWER', label: 'Short Answer', icon: FileText, description: 'Text-based answer' },
  { value: 'CASE_BASED', label: 'Case Study', icon: Brain, description: 'Clinical case scenario' },
  { value: 'IMAGE_BASED', label: 'Image Based', icon: ImageIcon, description: 'Question with image' },
];

const quizTypes = [
  { value: 'STANDARD', label: 'Standard Quiz', icon: List },
  { value: 'ADAPTIVE', label: 'Adaptive', icon: Brain },
  { value: 'CERTIFICATION', label: 'Certification Exam', icon: Target },
  { value: 'PRACTICE', label: 'Practice Test', icon: Zap },
  { value: 'BOARD_PREP', label: 'Board Prep', icon: FileText },
];

const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export function QuizBuilder({ quiz, onSave, onCancel }: QuizBuilderProps) {
  const [quizData, setQuizData] = useState<Quiz>(
    quiz || {
      id: `quiz-${Date.now()}`,
      title: '',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      shuffleQuestions: true,
      showResults: true,
      type: 'STANDARD',
      difficulty: 'INTERMEDIATE',
      questions: [],
    }
  );

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<Question['type']>('MULTIPLE_CHOICE');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  // Add new question
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type: selectedQuestionType,
      question: '',
      explanation: '',
      hint: '',
      points: 1,
      difficulty: 'INTERMEDIATE',
      topic: '',
      subtopic: '',
      options: selectedQuestionType === 'TRUE_FALSE'
        ? [
            { id: 'true', text: 'True', isCorrect: false },
            { id: 'false', text: 'False', isCorrect: false },
          ]
        : selectedQuestionType === 'SHORT_ANSWER'
        ? []
        : [
            { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
            { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
          ],
      isExpanded: true,
    };

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setShowAddQuestion(false);
    showNotification('Question added');
  };

  // Delete question
  const handleDeleteQuestion = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
    showNotification('Question deleted');
  };

  // Duplicate question
  const handleDuplicateQuestion = (question: Question) => {
    const newQuestion = {
      ...question,
      id: `question-${Date.now()}`,
      options: question.options.map((opt, idx) => ({
        ...opt,
        id: `opt-${Date.now()}-${idx}`,
      })),
    };
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    showNotification('Question duplicated');
  };

  // Update question
  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  // Add option to question
  const addOption = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: `opt-${Date.now()}`, text: '', isCorrect: false },
              ],
            }
          : q
      ),
    }));
  };

  // Update option
  const updateOption = (questionId: string, optionId: string, updates: Partial<QuestionOption>) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...updates } : opt
              ),
            }
          : q
      ),
    }));
  };

  // Delete option
  const deleteOption = (questionId: string, optionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
            }
          : q
      ),
    }));
  };

  // Toggle correct answer
  const toggleCorrectAnswer = (questionId: string, optionId: string) => {
    const question = quizData.questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
      // Single correct answer
      updateQuestion(questionId, {
        options: question.options.map((opt) => ({
          ...opt,
          isCorrect: opt.id === optionId,
        })),
      });
    } else {
      // Multiple correct answers
      updateOption(questionId, optionId, {
        isCorrect: !question.options.find((opt) => opt.id === optionId)?.isCorrect,
      });
    }
  };

  // Toggle question expanded
  const toggleQuestion = (questionId: string) => {
    updateQuestion(questionId, {
      isExpanded: !quizData.questions.find((q) => q.id === questionId)?.isExpanded,
    });
  };

  // Reorder questions
  const handleReorderQuestions = (newOrder: Question[]) => {
    setQuizData((prev) => ({ ...prev, questions: newOrder }));
  };

  const handleSave = () => {
    if (!quizData.title.trim()) {
      showNotification('Please enter a quiz title');
      return;
    }
    if (quizData.questions.length === 0) {
      showNotification('Please add at least one question');
      return;
    }
    onSave(quizData);
  };

  const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => setQuizData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Quiz Title"
            className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full"
          />
          <input
            type="text"
            value={quizData.description || ''}
            onChange={(e) => setQuizData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Quiz description (optional)"
            className="text-gray-500 bg-transparent border-none focus:outline-none w-full mt-1"
          />
        </div>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Quiz
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quiz Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={quizData.type}
                onChange={(e) => setQuizData((prev) => ({ ...prev, type: e.target.value as Quiz['type'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {quizTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={quizData.difficulty}
                onChange={(e) => setQuizData((prev) => ({ ...prev, difficulty: e.target.value as Quiz['difficulty'] }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Time & Scoring</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={quizData.timeLimit || ''}
                onChange={(e) => setQuizData((prev) => ({ ...prev, timeLimit: Number(e.target.value) || undefined }))}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData((prev) => ({ ...prev, passingScore: Number(e.target.value) }))}
                min={0}
                max={100}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Attempts
              </label>
              <input
                type="number"
                value={quizData.maxAttempts}
                onChange={(e) => setQuizData((prev) => ({ ...prev, maxAttempts: Number(e.target.value) }))}
                min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={quizData.shuffleQuestions}
                onChange={(e) => setQuizData((prev) => ({ ...prev, shuffleQuestions: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Shuffle questions</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={quizData.showResults}
                onChange={(e) => setQuizData((prev) => ({ ...prev, showResults: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Show results after</span>
            </label>
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">Total Points</div>
              <div className="text-2xl font-bold text-gray-900">{totalPoints}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Questions ({quizData.questions.length})
          </h3>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>

        {quizData.questions.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Add your first question to get started</p>
            <button
              onClick={() => setShowAddQuestion(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={quizData.questions}
            onReorder={handleReorderQuestions}
            className="space-y-3"
          >
            {quizData.questions.map((question, qIndex) => (
              <Reorder.Item
                key={question.id}
                value={question}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Question Header */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                  <button
                    onClick={() => toggleQuestion(question.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {question.isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Q{qIndex + 1}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {questionTypes.find((t) => t.value === question.type)?.label}
                      </span>
                      <span className="text-xs text-gray-500">{question.points} pts</span>
                    </div>
                    {question.question && (
                      <div className="text-sm text-gray-600 truncate mt-1">{question.question}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateQuestion(question)}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <AnimatePresence>
                  {question.isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {/* Question Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            placeholder="Enter your question..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                          />
                        </div>

                        {/* Options */}
                        {question.type !== 'SHORT_ANSWER' && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">Options</label>
                              {question.type !== 'TRUE_FALSE' && (
                                <button
                                  onClick={() => addOption(question.id)}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  + Add Option
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={option.id} className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleCorrectAnswer(question.id, option.id)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                      option.isCorrect
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300 hover:border-green-500'
                                    }`}
                                  >
                                    {option.isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                                  </button>
                                  <span className="text-sm text-gray-500 w-6">{String.fromCharCode(65 + optIndex)}</span>
                                  <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                  />
                                  {question.type !== 'TRUE_FALSE' && (
                                    <button
                                      onClick={() => deleteOption(question.id, option.id)}
                                      className="p-2 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Short Answer */}
                        {question.type === 'SHORT_ANSWER' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expected Answer (for reference)
                            </label>
                            <textarea
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                              placeholder="Sample correct answer..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Additional Fields */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                              min={1}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                              value={question.difficulty}
                              onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as Question['difficulty'] })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            >
                              {difficulties.map((diff) => (
                                <option key={diff} value={diff}>
                                  {diff}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                            <input
                              type="text"
                              value={question.topic || ''}
                              onChange={(e) => updateQuestion(question.id, { topic: e.target.value })}
                              placeholder="e.g., Cardiology"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>

                        {/* Explanation & Hint */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Explanation (shown after answer)
                            </label>
                            <textarea
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                              placeholder="Explain the correct answer..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hint (optional)
                            </label>
                            <textarea
                              value={question.hint || ''}
                              onChange={(e) => updateQuestion(question.id, { hint: e.target.value })}
                              placeholder="Provide a hint..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Add Question Modal */}
      <AnimatePresence>
        {showAddQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddQuestion(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Question Type</h3>
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedQuestionType(type.value as Question['type'])}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedQuestionType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className={`w-5 h-5 flex-shrink-0 ${
                      selectedQuestionType === type.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

