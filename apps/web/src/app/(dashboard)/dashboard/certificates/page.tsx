'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Shield,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Lock,
  Eye,
  Copy,
  QrCode,
  Sparkles,
  Calendar,
  Building2,
  Globe,
  Wallet,
  ChevronRight,
} from 'lucide-react';

const certificates = [
  {
    id: '1',
    name: 'Interventional Cardiology Fundamentals',
    issueDate: '2024-03-01',
    expiryDate: '2027-03-01',
    credentialId: '0x1a2b3c4d5e6f7890...',
    transactionHash: '0x9876543210fedcba...',
    status: 'verified',
    blockchain: 'Polygon',
    type: 'Fellowship',
    skills: ['PCI Basics', 'Coronary Anatomy', 'Catheterization'],
    institution: 'MedFellow Academy',
    instructor: 'User Name',
    xpEarned: 5000,
    image: '/certificates/cardiology.png',
  },
  {
    id: '2',
    name: 'Cardiac Catheterization Certification',
    issueDate: '2024-02-15',
    expiryDate: '2027-02-15',
    credentialId: '0x5e6f7g8h9i0j1k2l...',
    transactionHash: '0xabcdef1234567890...',
    status: 'verified',
    blockchain: 'Polygon',
    type: 'Certification',
    skills: ['Diagnostic Angiography', 'Image Interpretation', 'Patient Care'],
    institution: 'MedFellow Academy',
    instructor: 'User Name',
    xpEarned: 3500,
    image: '/certificates/cath.png',
  },
  {
    id: '3',
    name: 'ECG Interpretation Mastery',
    issueDate: '2024-01-20',
    expiryDate: '2027-01-20',
    credentialId: '0x9i0j1k2l3m4n5o6p...',
    transactionHash: '0x567890abcdef1234...',
    status: 'verified',
    blockchain: 'Polygon',
    type: 'Certification',
    skills: ['ECG Reading', 'Arrhythmia Detection', 'STEMI Recognition'],
    institution: 'MedFellow Academy',
    instructor: 'User Name',
    xpEarned: 2500,
    image: '/certificates/ecg.png',
  },
];

const pendingCertificates = [
  {
    id: 'p1',
    name: 'Complex PCI Specialist',
    progress: 68,
    requiredModules: 24,
    completedModules: 16,
    estimatedCompletion: '2024-04-15',
  },
  {
    id: 'p2',
    name: 'Structural Heart Disease',
    progress: 25,
    requiredModules: 32,
    completedModules: 8,
    estimatedCompletion: '2024-06-01',
  },
];

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'fellowship' | 'certification'>('all');

  const filteredCertificates = certificates.filter((cert) => {
    if (filter === 'all') return true;
    return cert.type.toLowerCase() === filter;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Award className="w-7 h-7 text-neural-500" />
            NFT Certificates
          </h1>
          <p className="text-muted-foreground">
            Blockchain-verified credentials that prove your expertise
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Public Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Certificates', value: '3', icon: Award, color: 'neural' },
          { label: 'Verified on Chain', value: '3', icon: Shield, color: 'health' },
          { label: 'In Progress', value: '2', icon: Clock, color: 'achievement' },
          { label: 'Total XP Earned', value: '11,000', icon: Sparkles, color: 'ibmp' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-interactive p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        {[
          { id: 'all', label: 'All Certificates' },
          { id: 'fellowship', label: 'Fellowship' },
          { id: 'certification', label: 'Certification' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Earned Certificates */}
      <div className="space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-health-500" />
          Earned Certificates ({filteredCertificates.length})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCertificate(cert)}
              className="card-interactive overflow-hidden cursor-pointer group"
            >
              {/* Certificate Preview */}
              <div className="h-40 bg-gradient-to-br from-neural-500/20 via-ibmp-500/20 to-bio-500/20 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-neural-500 mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground">NFT Certificate</div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-health-500/20 text-health-500 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm text-white text-xs">
                  {cert.blockchain}
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    cert.type === 'Fellowship'
                      ? 'bg-neural-500/10 text-neural-500'
                      : 'bg-ibmp-500/10 text-ibmp-500'
                  }`}>
                    {cert.type}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    +{cert.xpEarned.toLocaleString()} XP
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>Issued {cert.issueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{cert.instructor}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* In Progress */}
      <div className="space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-achievement-500" />
          In Progress ({pendingCertificates.length})
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pendingCertificates.map((cert) => (
            <div key={cert.id} className="card-elevated p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-achievement-500/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-achievement-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {cert.completedModules}/{cert.requiredModules} modules
                    </div>
                  </div>
                </div>
                <span className="text-lg font-bold text-achievement-500">{cert.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-achievement-500 to-achievement-600 rounded-full"
                  style={{ width: `${cert.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Est. completion: {cert.estimatedCompletion}
                </span>
                <button className="text-primary hover:underline flex items-center gap-1">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedCertificate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl card-elevated p-0 overflow-hidden"
          >
            {/* Certificate Header */}
            <div className="h-48 bg-gradient-to-br from-neural-500/30 via-ibmp-500/30 to-bio-500/30 relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-neural-500 mx-auto mb-2" />
                  <div className="text-2xl font-display font-bold">{selectedCertificate.name}</div>
                  <div className="text-muted-foreground mt-1">
                    Issued by {selectedCertificate.institution}
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-health-500 text-white text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Blockchain Verified
              </div>
            </div>

            {/* Certificate Details */}
            <div className="p-6 space-y-6">
              {/* Blockchain Info */}
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credential ID</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{selectedCertificate.credentialId}</code>
                    <button
                      onClick={() => copyToClipboard(selectedCertificate.credentialId)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Hash</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{selectedCertificate.transactionHash}</code>
                    <button className="p-1 hover:bg-muted rounded">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="text-sm font-medium">{selectedCertificate.blockchain}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Issue Date</div>
                  <div className="font-medium">{selectedCertificate.issueDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expiry Date</div>
                  <div className="font-medium">{selectedCertificate.expiryDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Instructor</div>
                  <div className="font-medium">{selectedCertificate.instructor}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">XP Earned</div>
                  <div className="font-medium text-achievement-500">
                    +{selectedCertificate.xpEarned.toLocaleString()} XP
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Verified Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-neural-500/10 text-neural-500 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex-1 btn-outline flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="btn-outline p-3">
                  <QrCode className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

