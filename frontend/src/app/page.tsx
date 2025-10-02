// src/app/page.tsx
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import FeaturedProjectsWrapper from '@/components/FeaturedProjectsWrapper';
import HowItWorksWrapper from '@/components/HowItWorksWrapper';
import FooterWrapper from '@/components/FooterWrapper';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProjectsWrapper />
        <HowItWorksWrapper />
      </main>
      <FooterWrapper />
    </div>
  );
}