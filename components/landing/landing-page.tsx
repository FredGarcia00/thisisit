'use client';

import { Hero } from './hero';
import { Features } from './features';
import { Pricing } from './pricing';
import { Footer } from './footer';
import { Navigation } from './navigation';

export function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}