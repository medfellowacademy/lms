'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Shield,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Share2,
  QrCode,
  MapPin,
  Building,
  FileText,
  Verified,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronRight,
  Star,
  Zap,
  Search,
  Filter,
  Copy,
  Eye,
  Settings,
  Link,
  BadgeCheck,
  Fingerprint,
  Sparkles,
  GraduationCap,
  Briefcase,
  Calendar,
} from 'lucide-react';

// User credentials
const myCredentials = [
  {
    id: 'MF-IC-2024-001',
    title: 'Interventional Cardiology Certification',
    issuer: 'MedFellow Academy',
    issuedDate: 'Dec 1, 2024',
    expiryDate: 'Dec 1, 2029',
    status: 'active',
    blockchain: {
      network: 'Polygon',
      txHash: '0x7f9a...3c2b',
      tokenId: '1284',
      verified: true,
    },
    recognizedIn: ['USA', 'UK', 'EU', 'UAE', 'Singapore', 'Australia'],
    verifications: 24,
    score: 94,
    skills: ['PCI', 'CTO', 'STEMI Management', 'Hemodynamics'],
  },
  {
    id: 'MF-SH-2024-003',
    title: 'Structural Heart Disease Specialist',
    issuer: 'MedFellow Academy',
    issuedDate: 'Sep 15, 2024',
    expiryDate: 'Sep 15, 2029',
    status: 'active',
    blockchain: {
      network: 'Polygon',
      txHash: '0x3e8b...9f1a',
      tokenId: '892',
      verified: true,
    },
    recognizedIn: ['USA', 'UK', 'Germany', 'Japan'],
    verifications: 18,
    score: 91,
    skills: ['TAVR', 'MitraClip', 'LAAO', 'Structural Imaging'],
  },
  {
    id: 'MF-EP-2024-002',
    title: 'Electrophysiology Fundamentals',
    issuer: 'MedFellow Academy',
    issuedDate: 'Nov 1, 2024',
    expiryDate: 'Nov 1, 2027',
    status: 'pending',
    blockchain: {
      network: 'Polygon',
      txHash: null,
      tokenId: null,
      verified: false,
    },
    recognizedIn: ['USA'],
    verifications: 0,
    score: 87,
    skills: ['ECG Interpretation', 'Ablation Basics', 'Device Management'],
  },
];

// Partner organizations
const partnerOrganizations = [
  { name: 'American College of Cardiology', logo: '🏛️', country: 'USA', status: 'verified' },
  { name: 'European Society of Cardiology', logo: '🇪🇺', country: 'Europe', status: 'verified' },
  { name: 'Heart Foundation UK', logo: '🇬🇧', country: 'UK', status: 'verified' },
  { name: 'Asian Pacific Heart Association', logo: '🌏', country: 'APAC', status: 'pending' },
  { name: 'Gulf Heart Association', logo: '🏥', country: 'UAE', status: 'verified' },
  { name: 'World Health Organization', logo: '🌍', country: 'Global', status: 'in-progress' },
];

// Verification history
const verificationHistory = [
  { date: 'Dec 5, 2024', organization: 'Cleveland Clinic', location: 'USA', credential: 'IC Certification' },
  { date: 'Nov 28, 2024', organization: 'NHS Trust', location: 'UK', credential: 'IC Certification' },
  { date: 'Nov 15, 2024', organization: 'Dubai Health Authority', location: 'UAE', credential: 'SH Specialist' },
  { date: 'Oct 30, 2024', organization: 'Singapore General Hospital', location: 'Singapore', credential: 'IC Certification' },
];

// Recognition map regions
const recognitionRegions = [
  { region: 'North America', countries: 2, status: 'full' },
  { region: 'Europe', countries: 27, status: 'full' },
  { region: 'Middle East', countries: 6, status: 'partial' },
  { region: 'Asia Pacific', countries: 12, status: 'partial' },
  { region: 'Africa', countries: 3, status: 'pending' },
  { region: 'South America', countries: 5, status: 'pending' },
];

export default function GlobalCredentialsPage() {
  const [selectedCredential, setSelectedCredential] = useState(myCredentials[0]);
  const [activeTab, setActiveTab] = useState<'credentials' | 'recognition' | 'verification' | 'partners'>('credentials');
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Globe className="w-7 h-7 text-ibmp-500" />
            Global Credentialing Network
          </h1>
          <p className="text-muted-foreground">
            Blockchain-verified credentials recognized in 100+ countries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-health-500/10 border border-health-500/30">
            <Shield className="w-4 h-4 text-health-500" />
            <span className="text-sm font-medium text-health-500">Zero-Knowledge Verified</span>
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Search className="w-4 h-4" />
            Verify Credential
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Award className="w-4 h-4" />
            New Certification
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'credentials', label: 'My Credentials', icon: Award },
          { id: 'recognition', label: 'Global Recognition', icon: Globe },
          { id: 'verification', label: 'Verification History', icon: Eye },
          { id: 'partners', label: 'Partner Organizations', icon: Building },
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

      {activeTab === 'credentials' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Credentials List */}
          <div className="space-y-4">
            <h2 className="font-semibold">Your Credentials</h2>
            {myCredentials.map((credential) => (
              <motion.button
                key={credential.id}
                onClick={() => setSelectedCredential(credential)}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCredential.id === credential.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    credential.status === 'active' ? 'bg-health-500/20' :
                    credential.status === 'pending' ? 'bg-achievement-500/20' :
                    'bg-muted'
                  }`}>
                    <Award className={`w-6 h-6 ${
                      credential.status === 'active' ? 'text-health-500' :
                      credential.status === 'pending' ? 'text-achievement-500' :
                      'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{credential.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className={`px-2 py-0.5 rounded-full ${
                        credential.status === 'active' ? 'bg-health-500/20 text-health-500' :
                        'bg-achievement-500/20 text-achievement-500'
                      }`}>
                        {credential.status === 'active' ? 'Active' : 'Pending Mint'}
                      </span>
                      <span>Score: {credential.score}%</span>
                    </div>
                    {credential.blockchain.verified && (
                      <div className="flex items-center gap-1 text-xs text-neural-500 mt-2">
                        <Verified className="w-3 h-3" />
                        Blockchain Verified
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Credential Detail */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCredential && (
              <>
                {/* Main Credential Card */}
                <div className="card-elevated overflow-hidden">
                  <div className="bg-gradient-to-br from-ibmp-500 via-neural-500 to-bio-500 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                          <Verified className="w-4 h-4" />
                          MedFellow Verified Credential
                        </div>
                        <h2 className="text-2xl font-bold text-white">{selectedCredential.title}</h2>
                      </div>
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <div className="text-white/70 text-xs">Credential ID</div>
                        <div className="text-white font-mono text-sm">{selectedCredential.id}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs">Issued</div>
                        <div className="text-white text-sm">{selectedCredential.issuedDate}</div>
                      </div>
                      <div>
                        <div className="text-white/70 text-xs">Expires</div>
                        <div className="text-white text-sm">{selectedCredential.expiryDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Skills Certified</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCredential.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1.5 rounded-full bg-ibmp-500/10 text-ibmp-500 text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Recognized In</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCredential.recognizedIn.map((country) => (
                            <span key={country} className="px-3 py-1.5 rounded-full bg-muted text-sm">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedCredential.blockchain.verified && (
                      <div className="mt-6 p-4 rounded-xl bg-neural-500/10 border border-neural-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-neural-500" />
                            Blockchain Verification
                          </h4>
                          <span className="px-2 py-1 rounded-full bg-health-500/20 text-health-500 text-xs font-medium">
                            Verified on-chain
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground text-xs">Network</div>
                            <div className="font-medium">{selectedCredential.blockchain.network}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Token ID</div>
                            <div className="font-mono">#{selectedCredential.blockchain.tokenId}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Transaction</div>
                            <button className="font-mono text-ibmp-500 hover:underline flex items-center gap-1">
                              {selectedCredential.blockchain.txHash}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Credential
                      </button>
                      <button 
                        onClick={() => setShowQR(!showQR)}
                        className="btn-outline flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </button>
                      <button className="btn-outline flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Modal */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="card-elevated p-6 text-center"
                    >
                      <h3 className="font-semibold mb-4">Scan to Verify</h3>
                      <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center">
                        <QrCode className="w-24 h-24 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Employers can scan this QR code to instantly verify your credential
                      </p>
                      <div className="flex gap-2 justify-center mt-4">
                        <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </button>
                        <button className="btn-secondary text-sm py-1.5 flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Save QR
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="card-elevated p-5 text-center">
                    <div className="text-3xl font-bold text-health-500">{selectedCredential.score}%</div>
                    <div className="text-sm text-muted-foreground">Exam Score</div>
                  </div>
                  <div className="card-elevated p-5 text-center">
                    <div className="text-3xl font-bold">{selectedCredential.verifications}</div>
                    <div className="text-sm text-muted-foreground">Verifications</div>
                  </div>
                  <div className="card-elevated p-5 text-center">
                    <div className="text-3xl font-bold text-ibmp-500">{selectedCredential.recognizedIn.length}</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'recognition' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* World Map Placeholder */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-ibmp-500" />
              Global Recognition Map
            </h3>
            <div className="aspect-video bg-gradient-to-br from-steel-900 to-ibmp-950 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M20,25 Q30,15 40,25 Q50,35 60,25 Q70,15 80,25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-ibmp-400" />
                  <path d="M10,20 Q25,30 40,20 Q55,10 70,20 Q85,30 100,20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neural-400" />
                </svg>
              </div>
              <div className="text-center z-10">
                <Globe className="w-16 h-16 text-ibmp-400 mx-auto mb-4 animate-pulse" />
                <div className="text-3xl font-bold text-white">55+</div>
                <div className="text-white/70">Countries Recognizing MedFellow Credentials</div>
              </div>
              
              {/* Dots representing countries */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-health-500 animate-pulse"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recognition by Region */}
          <div className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Recognition by Region</h3>
            <div className="space-y-4">
              {recognitionRegions.map((region) => (
                <div key={region.region} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{region.region}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      region.status === 'full' ? 'bg-health-500/20 text-health-500' :
                      region.status === 'partial' ? 'bg-ibmp-500/20 text-ibmp-500' :
                      'bg-achievement-500/20 text-achievement-500'
                    }`}>
                      {region.status === 'full' ? 'Full Recognition' :
                       region.status === 'partial' ? 'Partial Recognition' :
                       'In Progress'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {region.countries} countries with active partnerships
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-elevated p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-ibmp-500" />
              Verification History
            </h3>
            <div className="space-y-4">
              {verificationHistory.map((verification, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-xl bg-health-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-health-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{verification.organization}</div>
                    <div className="text-sm text-muted-foreground">
                      {verification.credential} • {verification.location}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{verification.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-elevated p-5">
              <h3 className="font-semibold mb-4">Verification Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Verifications</span>
                  <span className="font-semibold">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unique Organizations</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Countries</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-health-500">+8</span>
                </div>
              </div>
            </div>

            <div className="card-elevated p-5 bg-gradient-to-br from-neural-500/5 to-ibmp-500/5 border-neural-500/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-neural-500" />
                Zero-Knowledge Proofs
              </h3>
              <p className="text-sm text-muted-foreground">
                Your credentials are verified using ZK-proofs, meaning employers can confirm your qualifications without accessing sensitive data.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {partnerOrganizations.map((org) => (
            <div key={org.name} className="card-elevated p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl">
                  {org.logo}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{org.name}</h3>
                  <div className="text-sm text-muted-foreground">{org.country}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  org.status === 'verified' ? 'bg-health-500/20 text-health-500' :
                  org.status === 'pending' ? 'bg-achievement-500/20 text-achievement-500' :
                  'bg-ibmp-500/20 text-ibmp-500'
                }`}>
                  {org.status === 'verified' ? 'Full Partnership' :
                   org.status === 'pending' ? 'Pending Approval' :
                   'In Progress'}
                </span>
                <button className="text-sm text-primary hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

