'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Clock,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

function FloatingOrbs() {
  return (
    <>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={2}>
        <Sphere args={[0.3, 32, 32]} position={[-2, 0.5, 0]}>
          <MeshDistortMaterial
            color="#0ba5ec"
            attach="material"
            distort={0.4}
            speed={3}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={0.3} floatIntensity={1.5}>
        <Sphere args={[0.2, 32, 32]} position={[2, -0.3, 0.5]}>
          <MeshDistortMaterial
            color="#a855f7"
            attach="material"
            distort={0.5}
            speed={4}
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>
      <Float speed={5} rotationIntensity={0.4} floatIntensity={1}>
        <Sphere args={[0.15, 32, 32]} position={[1.5, 1, -0.5]}>
          <MeshDistortMaterial
            color="#14b8a6"
            attach="material"
            distort={0.3}
            speed={5}
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>
    </>
  );
}

const benefits = [
  { icon: Clock, text: '14-day free trial' },
  { icon: CreditCard, text: 'No credit card required' },
  { icon: Globe, text: 'Access from anywhere' },
  { icon: Shield, text: 'HIPAA compliant' },
];

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    description: 'Experience the platform',
    features: [
      '3 sample courses',
      'Basic quizzes',
      'Community forums',
      'Certificate preview',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For serious learners',
    features: [
      'All courses access',
      'Unlimited quizzes & assessments',
      'Progress tracking & analytics',
      'Verified certificates',
      'Study groups',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Elite',
    price: '$149',
    period: '/month',
    description: 'Complete medical education',
    features: [
      'All Professional features',
      'Fellowship programs',
      'Priority support',
      'CME credit tracking',
      '1-on-1 mentorship (2 hrs/mo)',
      'Custom learning path',
    ],
    cta: 'Go Elite',
    popular: false,
  },
];

export function CtaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-32 relative overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.3} />
          <FloatingOrbs />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-health-500/30 mb-6"
          >
            <Zap className="w-4 h-4 text-health-400" />
            <span className="text-sm font-medium">Limited Time: 20% Off Annual Plans</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="gradient-text">Medical Career?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 10,000+ doctors who are learning smarter with 
            expert-led courses and earning certificates that 
            matter globally.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <benefit.icon className="w-4 h-4 text-health-500" />
                {benefit.text}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="btn-outline text-lg px-8 py-4"
            >
              Schedule Demo
            </Link>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-ibmp-500 to-neural-500 text-white text-xs font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`h-full rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-b from-ibmp-500/10 to-neural-500/10 border-ibmp-500/50 shadow-lg shadow-ibmp-500/10'
                    : 'glass border-border/50 hover:border-border'
                }`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-health-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-ibmp-500 to-neural-500 text-white hover:shadow-lg hover:shadow-ibmp-500/25'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-2">
            Training a team of 10+ physicians?
          </p>
          <Link
            href="/enterprise"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Learn about Enterprise plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

