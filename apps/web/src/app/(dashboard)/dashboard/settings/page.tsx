'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Smartphone,
  Key,
  Mail,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Lock,
  Fingerprint,
  Languages,
  Volume2,
  Download,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const settingsSections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'devices', label: 'Connected Devices', icon: Smartphone },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    weeklyDigest: true,
    courseUpdates: true,
    achievementAlerts: true,
    mentorMessages: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="card-elevated p-2 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          {activeSection === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-ibmp-500" />
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>

              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6 flex items-center gap-2">
                  <Key className="w-5 h-5 text-neural-500" />
                  Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary pr-12"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                  <button className="btn-outline">Update Password</button>
                </div>
              </div>

              <div className="card-elevated p-6 border-critical-500/30">
                <h2 className="font-semibold mb-4 flex items-center gap-2 text-critical-500">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 rounded-xl border border-critical-500 text-critical-500 hover:bg-critical-500 hover:text-white transition-colors">
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6"
            >
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-ibmp-500" />
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Channels
                  </h3>
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Browser and mobile notifications' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Topics
                  </h3>
                  {[
                    { key: 'courseUpdates', label: 'Course Updates', desc: 'New lessons and content' },
                    { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Badges and milestones' },
                    { key: 'mentorMessages', label: 'Mentor Messages', desc: 'Direct messages from instructors' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of your learning progress' },
                    { key: 'marketing', label: 'Marketing', desc: 'News and special offers' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6"
            >
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-neural-500" />
                Appearance
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          theme === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <option.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {theme === option.value && (
                          <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Accent Color</h3>
                  <div className="flex gap-3">
                    {['#0ba5ec', '#a855f7', '#14b8a6', '#f59e0b', '#ef4444', '#10b981'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-xl border-2 border-transparent hover:border-foreground/20 transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Font Size</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">A</span>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      defaultValue="16"
                      className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer"
                    />
                    <span className="text-lg">A</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy & Security */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-health-500" />
                  Security Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                      </div>
                    </div>
                    <button className="btn-outline py-2 px-4 text-sm">Enable</button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Login Sessions</div>
                        <div className="text-sm text-muted-foreground">Manage active sessions</div>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">View all</button>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6 flex items-center gap-2">
                  <Download className="w-5 h-5 text-ibmp-500" />
                  Data & Privacy
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <div className="font-medium">Download Your Data</div>
                      <div className="text-sm text-muted-foreground">Get a copy of all your MedFellow data</div>
                    </div>
                    <button className="btn-outline py-2 px-4 text-sm">Request</button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <div className="font-medium">Profile Visibility</div>
                      <div className="text-sm text-muted-foreground">Control who can see your profile</div>
                    </div>
                    <select className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm">
                      <option>Public</option>
                      <option>MedFellow Members Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Billing */}
          {activeSection === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-achievement-500" />
                  Current Plan
                </h2>
                <div className="p-6 rounded-xl bg-gradient-to-br from-ibmp-500/10 to-neural-500/10 border border-ibmp-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">Professional</div>
                      <div className="text-muted-foreground">$99/month • Billed monthly</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-health-500/20 text-health-500 text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary py-2">Upgrade to Elite</button>
                    <button className="btn-outline py-2">Cancel Subscription</button>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6">Payment Method</h2>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-steel-800 flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-muted-foreground">Expires 12/25</div>
                    </div>
                  </div>
                  <button className="text-sm text-primary hover:underline">Update</button>
                </div>
              </div>

              <div className="card-elevated p-6">
                <h2 className="font-semibold mb-6">Billing History</h2>
                <div className="space-y-2">
                  {[
                    { date: 'Dec 1, 2024', amount: '$99.00', status: 'Paid' },
                    { date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid' },
                    { date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">{invoice.date}</div>
                        <div className="text-sm text-muted-foreground">Professional Plan</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{invoice.amount}</div>
                        <div className="text-sm text-health-500">{invoice.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Language */}
          {activeSection === 'language' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6"
            >
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Languages className="w-5 h-5 text-bio-500" />
                Language & Region
              </h2>
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-card">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>Mandarin Chinese</option>
                    <option>Hindi</option>
                    <option>Arabic</option>
                    <option>Portuguese</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-card">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central European Time (CET)</option>
                    <option>India Standard Time (IST)</option>
                    <option>Japan Standard Time (JST)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-card">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>INR (₹)</option>
                    <option>JPY (¥)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Devices */}
          {activeSection === 'devices' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6"
            >
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-neural-500" />
                Connected Devices
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'MacBook Pro', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
                  { name: 'iPhone 15 Pro', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
                  { name: 'iPad Pro', location: 'San Francisco, CA', lastActive: '3 days ago', current: false },
                ].map((device, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {device.name}
                          {device.current && (
                            <span className="px-2 py-0.5 rounded-full bg-health-500/20 text-health-500 text-xs">
                              This device
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {device.location} • {device.lastActive}
                        </div>
                      </div>
                    </div>
                    {!device.current && (
                      <button className="text-sm text-critical-500 hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-critical-500 hover:underline flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                Sign out of all other devices
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

