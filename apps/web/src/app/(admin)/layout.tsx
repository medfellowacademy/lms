'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  Activity,
  AlertTriangle,
  FileText,
  Globe,
  Server,
  Database,
  Bell,
  ChevronRight,
  Menu,
  X,
  Search,
  LogOut,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  Eye,
  Flag,
  Vote,
  ScrollText,
  Network,
  FileQuestion,
  Video,
  Image,
  FolderOpen,
} from 'lucide-react';

const adminNavigation = [
  {
    section: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ],
  },
  {
    section: 'Users',
    items: [
      { href: '/admin/users',              icon: Users,         label: 'All Users' },
      { href: '/admin/users/roles',        icon: Shield,        label: 'Roles & Permissions' },
    ],
  },
  {
    section: 'Enrollments',
    items: [
      { href: '/admin/enrollments',        icon: GraduationCap, label: 'Enrollment Management' },
      { href: '/admin/certificates',       icon: Award,         label: 'Certificates' },
    ],
  },
  {
    section: 'Content',
    items: [
      { href: '/admin/courses',      icon: BookOpen,     label: 'Courses' },
      { href: '/admin/templates',    icon: FileText,     label: 'Templates' },
      { href: '/admin/media',        icon: FolderOpen,   label: 'Media Library' },
      { href: '/admin/achievements', icon: Zap,          label: 'Achievements' },
      { href: '/admin/assessments',  icon: FileQuestion, label: 'Assessments' },
    ],
  },
  {
    section: 'Community',
    items: [
      { href: '/admin/moderation', icon: Flag, label: 'Content Moderation' },
      { href: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
      { href: '/admin/system', icon: Server, label: 'System Health' },
      { href: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-800">
              MedFellow <span className="text-red-500">Admin</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, courses, logs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              SA
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-medium text-gray-800">Super Admin</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 shadow-sm"
          >
            <nav className="p-4 space-y-6">
              {adminNavigation.map((group) => (
                <div key={group.section}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                    {group.section}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? 'bg-red-50 text-red-600 border border-red-200 font-medium'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                  Back to Main App
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className={`pt-16 min-h-screen transition-all ${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

