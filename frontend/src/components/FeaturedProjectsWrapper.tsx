'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FeaturedProjects component with lazy loading
const LazyFeaturedProjects = dynamic(
  () => import('./FeaturedProjects'),
  {
    loading: () => (
      <div className="py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  }
);

export default function FeaturedProjectsWrapper() {
  return (
    <Suspense 
      fallback={
        <div className="py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <LazyFeaturedProjects />
    </Suspense>
  );
}