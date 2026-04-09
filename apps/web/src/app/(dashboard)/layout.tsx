'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  BarChart3,
  Award,
  User,
  MessageSquare,
  Calendar,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  Zap,
  Flame,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

/* ─── Nav structure ─── */
const sidebarSections = [
  {
    label: 'Learn',
    items: [
      { href: '/dashboard',              icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/courses',       icon: BookOpen,        label: 'My Courses' },
      { href: '/dashboard/achievements',  icon: Trophy,          label: 'Achievements' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { href: '/dashboard/analytics',    icon: BarChart3, label: 'Analytics' },
      { href: '/dashboard/certificates', icon: Award,     label: 'Certificates' },
      { href: '/dashboard/profile',      icon: User,      label: 'Profile' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/dashboard/discussions', icon: MessageSquare, label: 'Discussions' },
      { href: '/dashboard/events',      icon: Calendar,       label: 'Events' },
    ],
  },
];

/* Mobile bottom-nav items (most-used) */
const bottomNavItems = [
  { href: '/dashboard',             icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/courses',      icon: BookOpen,        label: 'Courses' },
  { href: '/dashboard/achievements', icon: Trophy,          label: 'Achievements' },
  { href: '/dashboard/analytics',   icon: BarChart3,       label: 'Progress' },
  { href: '/dashboard/profile',     icon: User,            label: 'Profile' },
];

const mockUser = { level: 12, xp: 4850, xpToNext: 5000, streak: 7, rank: 'Fellow', name: 'John Doe', role: 'Cardiology Fellow' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]       = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [mounted, setMounted]           = useState(false);
  const pathname  = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); setProfileOpen(false); setNotifOpen(false); }, [pathname]);

  const xpPct = Math.round((mockUser.xp / mockUser.xpToNext) * 100);

  return (
    <div className="min-h-dvh bg-background flex">

      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR
         ══════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-card border-r border-border transition-all duration-300 ${
          collapsed ? 'w-[4.5rem]' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-border flex-shrink-0 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt="MedFellow Logo"
              width={36}
              height={36}
              className="flex-shrink-0"
            />
            {!collapsed && (
              <span className="font-display font-bold text-base gradient-text truncate">MedFellow</span>
            )}
          </Link>
        </div>

        {/* XP level card */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-border">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Level {mockUser.level}</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{mockUser.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">XP</p>
                  <p className="text-xs font-bold gradient-text">{mockUser.xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{mockUser.xpToNext - mockUser.xp} XP to next level</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                        collapsed ? 'justify-center' : ''
                      } ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-border space-y-0.5">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span className="font-medium">Settings</span>}
          </Link>
          <Link
            href="/help"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Help' : undefined}
          >
            <HelpCircle className="w-4 h-4" />
            {!collapsed && <span className="font-medium">Help</span>}
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-0 top-20 translate-x-1/2 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:border-primary hover:text-primary transition-colors z-10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft  className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* ══════════════════════════════════════
          MOBILE DRAWER
         ══════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="absolute left-0 inset-y-0 w-64 bg-card border-r border-border flex flex-col overflow-hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/logo.png"
                    alt="MedFellow Logo"
                    width={32}
                    height={32}
                  />
                  <span className="font-display font-bold gradient-text">MedFellow</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* XP mini card */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold">{mockUser.rank} · Level {mockUser.level}</span>
                  </div>
                  <span className="text-xs gradient-text font-bold">{mockUser.xp.toLocaleString()} XP</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${xpPct}%` }} />
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
                {sidebarSections.map((section) => (
                  <div key={section.label}>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 px-2">{section.label}</p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                              active
                                ? 'bg-primary text-primary-foreground'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 py-4 border-t border-border">
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          MAIN CONTENT AREA
         ══════════════════════════════════════ */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-64'
        }`}
      >
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border h-16 flex items-center px-4 lg:px-6 gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile logo */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">MF</span>
            </div>
            <span className="font-display font-bold text-sm gradient-text">MedFellow</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search courses, topics…"
                className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 font-mono">⌘K</kbd>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5">
            {/* Streak badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{mockUser.streak}d streak</span>
            </div>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-card p-4 z-50"
                  >
                    <h4 className="font-semibold text-sm mb-3">Notifications</h4>
                    {[
                      { icon: Trophy, title: 'Achievement Unlocked!', desc: '7-day learning streak complete', time: '2m ago', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                      { icon: GraduationCap, title: 'Course Update', desc: 'New module added to Cardiology', time: '1h ago', color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
                      { icon: BookOpen, title: 'New Course Available', desc: 'Clinical Pharmacology is live', time: '3h ago', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    ].map((n, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.color}`}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{n.desc}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                      </div>
                    ))}
                    <button className="w-full mt-3 py-2 text-xs text-primary font-medium hover:underline">
                      View all notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">JD</span>
                </div>
                <span className="text-xs font-medium hidden sm:block">John Doe</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-card p-3 z-50"
                  >
                    <div className="flex items-center gap-3 pb-3 mb-2 border-b border-border">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">JD</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{mockUser.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{mockUser.role}</p>
                      </div>
                    </div>
                    {[
                      { href: '/dashboard/profile',  icon: User,      label: 'Profile' },
                      { href: '/dashboard/settings', icon: Settings,  label: 'Settings' },
                      { href: '/help',               icon: HelpCircle,label: 'Help Center' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border">
                      <button
                        onClick={async () => {
                          await fetch('/api/auth/logout', { method: 'POST' });
                          window.location.href = '/login';
                        }}
                        className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-lg text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-4 pb-24 lg:p-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV
         ══════════════════════════════════════ */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-card border-t border-border">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
