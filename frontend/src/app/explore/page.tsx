// src/app/explore/page.tsx
import { ExploreProjects } from '@/components/ExploreProjects';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Projects</h1>
        <ExploreProjects />
      </div>
    </div>
  );
}