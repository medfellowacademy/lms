import HeroSection from '@/components/landing/hero-section';
import FeaturesGrid from '@/components/landing/features-grid';
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
      
      {/* Call to Action */}
      <CtaSection />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
