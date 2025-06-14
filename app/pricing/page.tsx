'use client';

import { Navigation } from '@/components/landing/navigation';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />
      <div className="pt-20">
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}