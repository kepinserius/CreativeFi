'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the HowItWorks component with lazy loading
const LazyHowItWorks = dynamic(
  () => import('./HowItWorks').then((mod) => ({ default: mod.HowItWorks })),
  {
    loading: () => (
      <div className="py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  }
);

export default function HowItWorksWrapper() {
  return (
    <Suspense 
      fallback={
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <LazyHowItWorks />
    </Suspense>
  );
}