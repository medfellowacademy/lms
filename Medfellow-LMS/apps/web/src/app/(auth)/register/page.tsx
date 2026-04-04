'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Torus } from '@react-three/drei';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  Sparkles,
  Award,
  Brain,
} from 'lucide-react';

function DNAVisualization() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
        <group rotation={[0.5, 0, 0]}>
          {/* DNA Helix Representation */}
          <Torus args={[0.8, 0.15, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <MeshDistortMaterial
              color="#0ba5ec"
              attach="material"
              distort={0.2}
              speed={2}
              roughness={0.2}
              metalness={0.8}
              transparent
              opacity={0.7}
            />
          </Torus>
          <Torus args={[0.6, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.3, 0]}>
            <MeshDistortMaterial
              color="#a855f7"
              attach="material"
              distort={0.3}
              speed={3}
              roughness={0.3}
              metalness={0.7}
              transparent
              opacity={0.6}
            />
          </Torus>
          <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
            <MeshDistortMaterial
              color="#14b8a6"
              attach="material"
              distort={0.4}
              speed={4}
              roughness={0.2}
              metalness={0.9}
              transparent
              opacity={0.5}
            />
          </Sphere>
        </group>
      </Float>
      <Float speed={3} rotationIntensity={0.4} floatIntensity={2}>
        <Sphere args={[0.15, 32, 32]} position={[1.5, 0.8, 0]}>
          <MeshDistortMaterial
            color="#f59e0b"
            attach="material"
            distort={0.5}
            speed={5}
            roughness={0.2}
            metalness={0.9}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>
    </>
  );
}

const specialties = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery',
  'Radiology',
  'Anesthesiology',
  'Psychiatry',
  'Other',
];

const features = [
  { icon: Sparkles, text: 'Expert-Led Medical Courses' },
  { icon: Brain, text: 'Interactive Case Studies' },
  { icon: Award, text: 'Verified Certificates' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialty: '',
    institution: '',
    yearsExperience: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length < 8) return { strength: 0, label: 'Too short', color: 'bg-critical-500' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    
    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-critical-500' };
    if (strength === 3) return { strength: 2, label: 'Good', color: 'bg-achievement-500' };
    return { strength: 3, label: 'Strong', color: 'bg-health-500' };
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center">
              <span className="text-white font-bold">MF</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text">MedFellow</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-2">
              {step === 1 ? 'Create your account' : 'Complete your profile'}
            </h2>
            <p className="text-muted-foreground">
              {step === 1 ? (
                <>
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </>
              ) : (
                'Tell us about your medical background'
              )}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="John"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="doctor@hospital.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength().strength
                                ? passwordStrength().color
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength: <span className="font-medium">{passwordStrength().label}</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Specialty */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Specialty</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={formData.specialty}
                      onChange={(e) => updateFormData('specialty', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                      required
                    >
                      <option value="">Select your specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Institution */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Institution</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => updateFormData('institution', e.target.value)}
                      placeholder="e.g., Mayo Clinic"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Years of Experience</label>
                  <select
                    value={formData.yearsExperience}
                    onChange={(e) => updateFormData('yearsExperience', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option value="student">Medical Student</option>
                    <option value="0-2">0-2 years (Resident)</option>
                    <option value="3-5">3-5 years (Fellow)</option>
                    <option value="6-10">6-10 years (Attending)</option>
                    <option value="10+">10+ years (Senior)</option>
                  </select>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    , and I acknowledge MedFellow Academy's use of educational content.
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors font-medium"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || (step === 2 && !agreeTerms)}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 1 ? 'Continue' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-neural-950 via-ibmp-950 to-bio-950 items-center justify-center overflow-hidden">
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[-10, -10, -10]} color="#0ba5ec" intensity={0.4} />
            <DNAVisualization />
          </Canvas>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Start Your Journey to
              <span className="block gradient-text">Medical Excellence</span>
            </h2>

            <p className="text-white/70 text-lg mb-8">
              Join 10,000+ doctors worldwide who are learning smarter 
              and advancing faster with MedFellow Academy.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur border border-white/10">
              <p className="text-white/80 italic mb-4">
                "MedFellow Academy transformed my approach to learning. The structured courses 
                and assessments gave me confidence. Absolutely game-changing."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ibmp-500 to-neural-500 flex items-center justify-center text-sm font-bold">
                  PS
                </div>
                <div>
                  <div className="font-semibold">User Name</div>
                  <div className="text-sm text-white/60">Interventional Cardiologist</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      </div>
    </div>
  );
}

