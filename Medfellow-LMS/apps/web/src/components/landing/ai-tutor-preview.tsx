'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  Image,
  Mic,
  FileText,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  Send,
  Globe,
  Lightbulb,
  Stethoscope,
} from 'lucide-react';

const capabilities = [
  {
    icon: MessageSquare,
    label: 'Natural Conversation',
    description: 'Socratic dialogue that adapts to your level',
  },
  {
    icon: Image,
    label: 'Medical Imaging',
    description: 'Analyze X-rays, CT scans, pathology slides',
  },
  {
    icon: Mic,
    label: 'Voice Interaction',
    description: 'Speak naturally, get instant answers',
  },
  {
    icon: FileText,
    label: 'Research Synthesis',
    description: 'Summarize 100s of papers in seconds',
  },
  {
    icon: Globe,
    label: '100+ Languages',
    description: 'Medical terminology in your language',
  },
  {
    icon: Lightbulb,
    label: 'Adaptive Learning',
    description: 'Remembers your history, fills your gaps',
  },
];

const demoMessages = [
  {
    role: 'user',
    content: 'What are the differential diagnoses for a patient presenting with acute chest pain, elevated troponins, and ST-elevation in leads V1-V4?',
  },
  {
    role: 'assistant',
    content: `Based on the clinical presentation, here are the key differentials to consider:

**Primary Diagnosis (Most Likely):**
🔴 **Anterior STEMI** - ST-elevation in V1-V4 suggests LAD occlusion

**Critical Differentials to Rule Out:**
• Aortic dissection (especially if tearing pain radiating to back)
• Pulmonary embolism (check D-dimer, consider CTPA)
• Pericarditis (look for diffuse ST changes, PR depression)

**Recommended Immediate Actions:**
1. 12-lead ECG serial monitoring
2. Urgent cardiology consult for cath lab activation
3. Aspirin 325mg + P2Y12 inhibitor
4. Anticoagulation per local STEMI protocol

Would you like me to explain the ECG findings in more detail, or discuss the cath lab decision criteria?`,
  },
];

function TypewriterText({ text, delay = 0, onComplete }: { text: string; delay?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          onComplete?.();
        }
      }, 8);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, onComplete]);

  return (
    <span>
      {displayedText}
      {isTyping && <span className="animate-pulse">▊</span>}
    </span>
  );
}

export function AiTutorPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeMessage, setActiveMessage] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setShowResponse(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-neural-500/5 to-transparent" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-neural-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-ibmp-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neural-500/30"
            >
              <Brain className="w-4 h-4 text-neural-400" />
              <span className="text-sm font-medium">AI-Powered Intelligence</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
                Meet{' '}
                <span className="gradient-text-neural">Dr. Nexus</span>
                <br />
                Your AI Medical Professor
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Beyond ChatGPT—a specialized medical AI tutor that understands 
                clinical context, analyzes medical images, and teaches through 
                Socratic dialogue. Available 24/7 in 100+ languages.
              </p>
            </div>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="group"
                >
                  <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-neural-500/50 transition-colors h-full">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neural-500/20 to-ibmp-500/20 flex items-center justify-center mb-3 group-hover:from-neural-500/30 group-hover:to-ibmp-500/30 transition-colors">
                      <cap.icon className="w-5 h-5 text-neural-500" />
                    </div>
                    <h4 className="text-sm font-semibold mb-1">{cap.label}</h4>
                    <p className="text-xs text-muted-foreground">{cap.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <a href="/features/ai-tutor" className="btn-secondary inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Try Dr. Nexus Free
              </a>
              <a
                href="/features/ai-tutor"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                See all capabilities
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Chat Window */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-neural-500/30 via-ibmp-500/30 to-bio-500/30 rounded-3xl blur-xl opacity-70" />
              
              <div className="relative glass-card rounded-2xl overflow-hidden border border-neural-500/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-neural-500/10 to-ibmp-500/10 px-6 py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-health-500 border-2 border-background flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Dr. Nexus</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-health-500"></span>
                        </span>
                        Online • Powered by GPT-4 + Medical Knowledge Base
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-6 h-[400px] overflow-y-auto">
                  {/* User Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] bg-ibmp-500/10 border border-ibmp-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm">{demoMessages[0].content}</p>
                    </div>
                  </motion.div>

                  {/* AI Response */}
                  <AnimatePresence>
                    {showResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="max-w-[85%] bg-card/50 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="text-sm prose prose-sm dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0">
                            <TypewriterText text={demoMessages[1].content} delay={200} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Ask Dr. Nexus anything..."
                        className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neural-500/50"
                      />
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-500 to-ibmp-500 flex items-center justify-center hover:shadow-lg hover:shadow-neural-500/25 transition-all">
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Image className="w-3 h-3" />
                      Upload Image
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Mic className="w-3 h-3" />
                      Voice Input
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <FileText className="w-3 h-3" />
                      Attach PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 glass-card px-3 py-2 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-health-500" />
              <span className="text-xs font-medium">HIPAA Compliant</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="absolute -top-4 -right-4 glass-card px-3 py-2 flex items-center gap-2"
            >
              <Brain className="w-4 h-4 text-neural-500" />
              <span className="text-xs font-medium">100M+ Medical Facts</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

