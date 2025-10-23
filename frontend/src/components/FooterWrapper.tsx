'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Footer component with lazy loading
const LazyFooter = dynamic(
  () => import('./Footer').then((mod) => ({ default: mod.Footer })),
  {
    loading: () => (
      <div className="bg-gray-900 border-t border-gray-800 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  }
);

export default function FooterWrapper() {
  return (
    <Suspense 
      fallback={
        <div className="bg-gray-900 border-t border-gray-800 py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <LazyFooter />
    </Suspense>
  );
}