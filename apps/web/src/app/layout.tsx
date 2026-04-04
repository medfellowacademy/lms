import type { Metadata, Viewport } from 'next';
import { Outfit, Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Display Font - Modern, Clean
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Medical/Prestige Serif Font
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

// Primary Sans Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Mono Font
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MedFellow Academy | Your Medical Learning Platform',
    template: '%s | MedFellow Academy',
  },
  description:
    'MedFellow Academy - A comprehensive medical learning platform with expert-led courses, quizzes, progress tracking, and certificates for healthcare professionals.',
  keywords: [
    'medical certification',
    'fellowship programs',
    'medical education',
    'online courses',
    'CME',
    'healthcare training',
    'medical learning',
    'MedFellow Academy',
  ],
  authors: [{ name: 'MedFellow Academy' }],
  creator: 'MedFellow Academy',
  publisher: 'MedFellow Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://medfellowacademy.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://medfellowacademy.com',
    siteName: 'MedFellow Academy',
    title: 'MedFellow Academy | Your Medical Learning Platform',
    description:
      'Expert-led medical courses, quizzes, certificates, and progress tracking for healthcare professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedFellow Academy | Your Medical Learning Platform',
    description:
      'Expert-led medical courses, quizzes, certificates, and progress tracking for healthcare professionals.',
    creator: '@MedFellowAcademy',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fefcf7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {/* Main Content */}
            <main className="relative min-h-screen">
              {children}
            </main>
            
            {/* Toast Notifications */}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
