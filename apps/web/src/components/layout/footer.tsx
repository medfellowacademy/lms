'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart,
  Brain,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Github,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const footerLinks = {
  programs: {
    title: 'Programs',
    links: [
      { label: 'All Courses', href: '/dashboard/courses' },
      { label: 'Fellowship Programs', href: '/dashboard/courses?type=fellowship' },
      { label: 'CME Credits', href: '/programs/cme' },
      { label: 'Specialty Training', href: '/programs/specialties' },
      { label: 'Enterprise Training', href: '/enterprise' },
    ],
  },
  features: {
    title: 'Features',
    links: [
      { label: 'Video Courses', href: '/features/courses' },
      { label: 'Quizzes & Assessments', href: '/features/quizzes' },
      { label: 'Progress Tracking', href: '/features/progress' },
      { label: 'Certificates', href: '/features/certificates' },
      { label: 'Community', href: '/features/community' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Webinars', href: '/webinars' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

const accreditations = [
  { name: 'ACCME', description: 'Accredited CME Provider' },
  { name: 'WFME', description: 'World Federation Recognition' },
  { name: 'ISO 27001', description: 'Information Security' },
  { name: 'SOC 2', description: 'Type II Certified' },
];

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 pt-20 pb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ibmp-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neural-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="relative mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-ibmp-500/20 via-neural-500/20 to-bio-500/20 rounded-3xl blur-xl" />
          <div className="relative glass-card rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ibmp-500/10 border border-ibmp-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-ibmp-400" />
                  <span className="text-sm font-medium">Stay Updated</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">
                  Get the Latest in Medical Education
                </h3>
                <p className="text-muted-foreground">
                Weekly insights on medical education and career advancement tips 
                  from top physicians worldwide.
                </p>
              </div>
              <div>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-ibmp-500 focus:ring-2 focus:ring-ibmp-500/20 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="btn-primary whitespace-nowrap inline-flex items-center gap-2"
                  >
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-3">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="MedFellow Logo"
                width={40}
                height={40}
              />
              <span className="font-display font-bold text-xl gradient-text">MedFellow</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your Medical Learning Platform. Expert-led courses, 
              progress tracking, and verified certificates.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      {'badge' in link && link.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-health-500/10 text-health-500">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accreditations */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {accreditations.map((accreditation) => (
              <div
                key={accreditation.name}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">{accreditation.name}</div>
                  <div className="text-xs text-muted-foreground">{accreditation.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <a href="mailto:hello@medfellowacademy.com" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
              hello@medfellowacademy.com
            </a>
            <a href="tel:+1-888-MED-LEARN" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              +1-888-MED-LEARN
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              San Francisco, CA • London • Singapore • Dubai
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MedFellow Academy. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-critical-500 fill-critical-500" />
              <span>for the future of medicine</span>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="bg-transparent text-sm text-muted-foreground border-none focus:ring-0 cursor-pointer"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
                <option value="hi">हिंदी</option>
                <option value="ar">العربية</option>
              </select>
              <select
                className="bg-transparent text-sm text-muted-foreground border-none focus:ring-0 cursor-pointer"
                defaultValue="usd"
              >
                <option value="usd">USD $</option>
                <option value="eur">EUR €</option>
                <option value="gbp">GBP £</option>
                <option value="inr">INR ₹</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

