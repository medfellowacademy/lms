'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Mail,
  CreditCard,
  Users,
  Brain,
  Server,
  Database,
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Save,
  RefreshCw,
  AlertTriangle,
  Info,
  Palette,
  Zap,
  FileText,
} from 'lucide-react';

const settingsTabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'authentication', label: 'Authentication', icon: Shield },
  { id: 'ai', label: 'AI Configuration', icon: Brain },
  { id: 'email', label: 'Email & Notifications', icon: Mail },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'advanced', label: 'Advanced', icon: Zap },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Settings className="w-7 h-7 text-gray-400" />
            System Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Configure platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-sm flex items-center gap-2 transition-colors"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <>
              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">Platform Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="MedFellow Academy"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tagline</label>
                    <input
                      type="text"
                      defaultValue="Your Medical Learning Platform"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Support Email</label>
                    <input
                      type="email"
                      defaultValue="support@medfellow.academy"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Default Timezone</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <option>UTC</option>
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">Feature Toggles</h2>
                <div className="space-y-4">
                  {[
                    { name: 'VR Surgery Lab', description: 'Enable VR surgery simulations', enabled: true },
                    { name: 'AI Tutor (Dr. Nexus)', description: 'Enable AI-powered tutoring', enabled: true },
                    { name: 'Social Features', description: 'Enable social network features', enabled: true },
                    { name: 'Gamification', description: 'Enable XP, levels, and achievements', enabled: true },
                    { name: 'Community Governance', description: 'Enable proposal voting system', enabled: true },
                    { name: 'Research Accelerator', description: 'Enable research tools', enabled: false },
                  ].map((feature) => (
                    <div key={feature.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-medium text-sm">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                      <button className={`relative w-12 h-6 rounded-full transition-colors ${
                        feature.enabled ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          feature.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">AI Model Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Primary Model</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <option>GPT-4-Turbo (Recommended)</option>
                      <option>GPT-4</option>
                      <option>Claude 3 Opus</option>
                      <option>Claude 3 Sonnet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Fallback Model</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                      <option>Claude 3 Sonnet</option>
                      <option>GPT-3.5-Turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Max Tokens per Response</label>
                    <input
                      type="number"
                      defaultValue="2048"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Temperature</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Precise (0)</span>
                      <span>Creative (1)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">AI Safety & Moderation</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Content Filtering', description: 'Filter inappropriate medical advice', enabled: true },
                    { name: 'Citation Required', description: 'Require citations for medical claims', enabled: true },
                    { name: 'Human Review Queue', description: 'Flag uncertain responses for review', enabled: false },
                    { name: 'Rate Limiting', description: 'Limit requests per user per minute', enabled: true },
                  ].map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-medium text-sm">{setting.name}</div>
                        <div className="text-xs text-gray-500">{setting.description}</div>
                      </div>
                      <button className={`relative w-12 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          setting.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'api' && (
            <>
              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">API Keys</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Keep your API keys secure. Never share them publicly.
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">OpenAI API Key</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Anthropic API Key</label>
                    <div className="relative">
                      <input
                        type="password"
                        defaultValue="sk-ant-xxxxxxxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Auth0 Domain</label>
                    <input
                      type="text"
                      defaultValue="medfellow.us.auth0.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Database URL</label>
                    <div className="relative">
                      <input
                        type="password"
                        defaultValue="postgresql://user:pass@host:5432/medfellow"
                        className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
                <h2 className="font-semibold mb-4">Public API</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-sm">Enable Public API</div>
                      <div className="text-xs text-gray-500">Allow external applications to access platform data</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full bg-blue-500 transition-colors">
                      <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white transition-all" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Rate Limit (requests/min)</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'authentication' && (
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
              <h2 className="font-semibold mb-4">Authentication Settings</h2>
              <div className="space-y-4">
                {[
                  { name: 'Email/Password Login', description: 'Allow traditional email login', enabled: true },
                  { name: 'Google OAuth', description: 'Allow Google sign-in', enabled: true },
                  { name: 'Medical ID Verification', description: 'Require medical credential verification', enabled: true },
                  { name: 'Two-Factor Authentication', description: 'Optional 2FA for users', enabled: true },
                  { name: 'SSO (Enterprise)', description: 'SAML/OIDC single sign-on', enabled: false },
                ].map((setting) => (
                  <div key={setting.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-sm">{setting.name}</div>
                      <div className="text-xs text-gray-500">{setting.description}</div>
                    </div>
                    <button className={`relative w-12 h-6 rounded-full transition-colors ${
                      setting.enabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        setting.enabled ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'email' || activeTab === 'billing' || activeTab === 'appearance' || activeTab === 'advanced') && (
            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm text-center">
              <Settings className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h2 className="font-semibold mb-2">{settingsTabs.find(t => t.id === activeTab)?.label} Settings</h2>
              <p className="text-gray-500 text-sm">Configuration options for {activeTab} coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

