'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Brain,
  Image,
  Mic,
  FileText,
  Stethoscope,
  Lightbulb,
  BookOpen,
  Zap,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  History,
  Settings,
  ChevronRight,
  Plus,
  MessageSquare,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useConversations, streamChat, api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Suggestion {
  icon: any;
  title: string;
  description: string;
  prompt: string;
}

const suggestions: Suggestion[] = [
  {
    icon: Stethoscope,
    title: 'Differential Diagnosis',
    description: 'Help me work through a complex case',
    prompt: 'I have a patient presenting with acute chest pain. Help me work through the differential diagnosis.',
  },
  {
    icon: BookOpen,
    title: 'Explain a Concept',
    description: 'Break down complex medical topics',
    prompt: 'Can you explain the pathophysiology of heart failure in simple terms?',
  },
  {
    icon: Lightbulb,
    title: 'Quiz Me',
    description: 'Test my knowledge with questions',
    prompt: 'Quiz me on interventional cardiology concepts. Start with 5 questions.',
  },
  {
    icon: FileText,
    title: 'Review Guidelines',
    description: 'Summarize clinical guidelines',
    prompt: 'Summarize the latest ACC/AHA guidelines for STEMI management.',
  },
];

const chatHistory = [
  { id: '1', title: 'STEMI Treatment Protocol', date: 'Today' },
  { id: '2', title: 'Cardiac Catheterization', date: 'Yesterday' },
  { id: '3', title: 'Heart Failure Management', date: '2 days ago' },
  { id: '4', title: 'ECG Interpretation', date: '3 days ago' },
];

const mockResponses: { [key: string]: string } = {
  'differential': `Based on the presentation of acute chest pain, let's systematically work through the differential diagnosis:

## 🚨 Life-Threatening Causes (Rule Out First)

### 1. **Acute Coronary Syndrome (ACS)**
- **STEMI**: Look for ST-elevation on ECG
- **NSTEMI**: Troponin elevation without ST-elevation
- **Unstable Angina**: Negative troponins, ischemic symptoms

### 2. **Aortic Dissection**
- Consider if: Tearing pain radiating to back, BP differential between arms
- Order: CT angiography or TEE

### 3. **Pulmonary Embolism**
- Risk factors: Recent surgery, immobility, malignancy
- Order: D-dimer, CT pulmonary angiography

### 4. **Tension Pneumothorax**
- Physical exam: Decreased breath sounds, tracheal deviation

## 📋 Key Questions to Ask

1. Character of pain (pressure vs. tearing vs. pleuritic)
2. Radiation pattern
3. Associated symptoms (dyspnea, diaphoresis, nausea)
4. Risk factors for each condition

## 🔬 Immediate Workup

| Test | Purpose |
|------|---------|
| 12-lead ECG | ACS evaluation |
| Troponin | Myocardial injury |
| Chest X-ray | Pneumothorax, widened mediastinum |
| D-dimer | PE screening |

Would you like me to elaborate on any specific condition or discuss the management algorithm?`,

  'default': `I understand you're asking about medical concepts. Let me provide a comprehensive explanation.

## Key Points

This is a complex topic that involves several interconnected factors. Here's what you need to know:

### Understanding the Basics
- The fundamental mechanism involves cellular and molecular pathways
- Clinical presentation can vary significantly between patients
- Diagnosis requires a systematic approach

### Clinical Implications
1. Early recognition is crucial for optimal outcomes
2. Treatment should be tailored to individual patient factors
3. Monitoring and follow-up are essential components of care

### Evidence-Based Approach
According to current guidelines and recent literature:
- Level I evidence supports certain interventions
- Ongoing research continues to refine our understanding
- Practice patterns may vary by institution

Would you like me to:
- Elaborate on any specific aspect?
- Provide relevant case examples?
- Quiz you on this topic?

I'm here to support your learning journey! 🎓`,
};

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'chat' | 'socratic' | 'quiz'>('chat');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversation history from API
  const { data: conversationsData } = useConversations();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string, messageId: string) => {
    let currentContent = '';
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      currentContent += (i === 0 ? '' : ' ') + words[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: currentContent } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30));
    }
    
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
  };

  const handleSend = async (customPrompt?: string) => {
    const messageContent = customPrompt || input;
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      // Try to use real API with streaming
      let fullContent = '';
      const generator = streamChat({
        message: messageContent,
        conversationId: conversationId || undefined,
        mode: selectedMode,
      });

      setIsLoading(false);

      for await (const chunk of generator) {
        fullContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isTyping: false } : msg
        )
      );
    } catch (error) {
      // Fallback to mock response if API fails
      console.warn('API call failed, using mock response:', error);
      setIsLoading(false);
      
      const response = messageContent.toLowerCase().includes('differential') ||
                       messageContent.toLowerCase().includes('chest pain')
        ? mockResponses['differential']
        : mockResponses['default'];

      await simulateTyping(response, aiMessageId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - Chat History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block overflow-hidden"
          >
            <div className="h-full card-elevated p-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Chat History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-4"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto space-y-2">
                {(conversationsData?.conversations || chatHistory).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setConversationId(chat.id)}
                    className={`w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-colors group ${
                      conversationId === chat.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate flex-1">
                        {chat.title || 'New Conversation'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {'createdAt' in chat 
                        ? new Date(chat.createdAt).toLocaleDateString() 
                        : (chat as { date: string }).date}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col card-elevated overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-muted rounded-xl transition-colors hidden lg:block"
            >
              <History className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                Dr. Nexus
                <span className="px-2 py-0.5 rounded-full bg-health-500/10 text-health-500 text-xs font-medium">
                  Online
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                AI Medical Tutor • Powered by GPT-4 + Medical Knowledge Base
              </p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-muted">
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'socratic', label: 'Socratic', icon: Lightbulb },
              { id: 'quiz', label: 'Quiz', icon: Brain },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedMode === mode.id
                    ? 'bg-background shadow-sm font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>

          <button className="p-2 hover:bg-muted rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">
                  Hello! I'm <span className="gradient-text">Dr. Nexus</span>
                </h2>
                <p className="text-muted-foreground">
                  Your AI medical tutor, available 24/7. I can help you with differential
                  diagnoses, explain complex concepts, quiz you on topics, or discuss clinical
                  guidelines. How can I help you today?
                </p>
              </motion.div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleSend(suggestion.prompt)}
                    className="text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neural-500/10 flex items-center justify-center group-hover:bg-neural-500/20 transition-colors">
                        <suggestion.icon className="w-5 h-5 text-neural-500" />
                      </div>
                      <div>
                        <div className="font-medium mb-1 group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {suggestion.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                        : 'bg-muted/50 rounded-2xl rounded-tl-sm'
                    } p-4`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">Dr. Nexus</span>
                      </div>
                    )}
                    <div className="prose prose-sm dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:my-3 prose-table:my-2 max-w-none">
                      {message.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) {
                          return <h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>;
                        }
                        if (line.startsWith('### ')) {
                          return <h4 key={i} className="text-sm font-semibold mt-3 mb-1">{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={i} className="text-sm ml-4">{line.replace('- ', '')}</li>;
                        }
                        if (line.startsWith('| ')) {
                          return <code key={i} className="text-xs bg-muted p-1 rounded">{line}</code>;
                        }
                        return <p key={i} className="text-sm">{line}</p>;
                      })}
                      {message.isTyping && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    {message.role === 'assistant' && !message.isTyping && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Good response">
                          <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Poor response">
                          <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Regenerate">
                          <RotateCcw className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Dr. Nexus is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dr. Nexus anything about medicine..."
              rows={1}
              className="w-full resize-none px-4 py-3 pr-32 rounded-xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              style={{ minHeight: '50px', maxHeight: '200px' }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Upload Image"
              >
                <Image className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Voice Input"
              >
                <Mic className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                <FileText className="w-3 h-3" />
                Attach PDF
              </button>
              <span>•</span>
              <span>Dr. Nexus may occasionally provide incorrect information. Verify with clinical guidelines.</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-health-500" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

