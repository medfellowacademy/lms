import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variable Colors for theming
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // ─── Domain color aliases ───────────────────────────────────────────
        // Used throughout dashboard & landing components
        // ibmp  → teal  (platform brand)
        ibmp: {
          50:  '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#2d9596', 600: '#1e6b6e', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a', 950: '#042f2e',
        },
        // neural → indigo/blue (AI, analytics)
        neural: {
          50:  '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
        },
        // achievement → amber/gold (XP, badges)
        achievement: {
          50:  '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f', 950: '#451a03',
        },
        // critical → rose/red (alerts, urgent)
        critical: {
          50:  '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
          400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
          800: '#9f1239', 900: '#881337', 950: '#4c0519',
        },
        // health → emerald/green (success, completion)
        health: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b', 950: '#022c22',
        },
        // bio → cyan (research, science)
        bio: {
          50:  '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
          400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490',
          800: '#155e75', 900: '#164e63', 950: '#083344',
        },
        // steel → slate (neutral, UI chrome)
        steel: {
          50:  '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },

        // ─── Original refined palette ───────────────────────────────────────
        teal: {
          50:  '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#2d9596', 600: '#1e6b6e', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a', 950: '#042f2e',
        },
        gold: {
          50:  '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#f5a623', 500: '#d4941f', 600: '#b8860b', 700: '#92400e',
          800: '#78350f', 900: '#5c2d0e',
        },
        blue: {
          50:  '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#4a90d9', 600: '#357abd', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        slate: {
          50:  '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
        success: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        warning: {
          50:  '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12',
        },
        error: {
          50:  '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
        cream: {
          50:  '#fefcf7', 100: '#fdf8ed', 200: '#f9f0db',
          300: '#f4e5c3', 400: '#edd5a5', 500: '#e4c282',
        },
      },

      fontFamily: {
        sans:    ['var(--font-inter)',      'system-ui', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-outfit)',    'system-ui', 'sans-serif'],
        serif:   ['var(--font-instrument)','Georgia',   'serif'],
      },

      backgroundImage: {
        'gradient-warm':    'linear-gradient(135deg, #fefcf7 0%, #f9f0db 50%, #e8f5f5 100%)',
        'gradient-teal':    'linear-gradient(135deg, #2d9596 0%, #1e6b6e 100%)',
        'gradient-gold':    'linear-gradient(135deg, #f5a623 0%, #d4941f 100%)',
        'gradient-elegant': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark':    'linear-gradient(135deg, #1a1f2e 0%, #16192a 50%, #0f1219 100%)',
        'gradient-dark-teal':'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)',
        'mesh-warm': `
          radial-gradient(at 20% 30%, rgba(45, 149, 150, 0.08) 0px, transparent 50%),
          radial-gradient(at 80% 20%, rgba(245, 166, 35, 0.08) 0px, transparent 50%),
          radial-gradient(at 40% 80%, rgba(74, 144, 217, 0.05) 0px, transparent 50%)
        `,
        'mesh-dark': `
          radial-gradient(at 20% 30%, rgba(45, 149, 150, 0.15) 0px, transparent 50%),
          radial-gradient(at 80% 20%, rgba(245, 166, 35, 0.1) 0px, transparent 50%),
          radial-gradient(at 40% 80%, rgba(74, 144, 217, 0.1) 0px, transparent 50%)
        `,
        'pattern-dots': 'radial-gradient(rgba(45, 149, 150, 0.1) 1px, transparent 1px)',
        'pattern-grid': `
          linear-gradient(rgba(45, 149, 150, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(45, 149, 150, 0.05) 1px, transparent 1px)
        `,
      },

      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0,0,0,0.04)',
        'soft':    '0 4px 20px rgba(0,0,0,0.06)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.08)',
        'soft-xl': '0 12px 60px rgba(0,0,0,0.10)',
        'teal':    '0 4px 20px rgba(45,149,150,0.20)',
        'teal-lg': '0 8px 40px rgba(45,149,150,0.25)',
        'gold':    '0 4px 20px rgba(245,166,35,0.20)',
        'gold-lg': '0 8px 40px rgba(245,166,35,0.25)',
        'dark':    '0 4px 20px rgba(0,0,0,0.30)',
        'dark-lg': '0 8px 40px rgba(0,0,0,0.40)',
      },

      animation: {
        'float':       'float 5s ease-in-out infinite',
        'float-slow':  'float 8s ease-in-out infinite',
        'pulse-soft':  'pulse-soft 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'spin-slow':   'spin 10s linear infinite',
        'fade-in':     'fade-in 0.6s ease-out',
        'slide-up':    'slide-up 0.6s ease-out',
        'scale-in':    'scale-in 0.4s ease-out',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
