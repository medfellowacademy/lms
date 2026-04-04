import HeroSection from '@/components/landing/hero-section';
import FeaturesGrid from '@/components/landing/features-grid';
import { StatsSection } from '@/components/landing/stats-section';
import { FellowshipShowcase } from '@/components/landing/fellowship-showcase';
import { TestimonialCarousel } from '@/components/landing/testimonial-carousel';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Platform Features */}
      <FeaturesGrid />
      
      {/* Live Platform Stats */}
      <StatsSection />
      
      {/* Course Programs Showcase */}
      <FellowshipShowcase />
      
      {/* Success Stories */}
      <TestimonialCarousel />
      
      {/* Call to Action & Pricing */}
      <CtaSection />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
