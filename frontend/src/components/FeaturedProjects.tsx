// src/components/FeaturedProjects.tsx
import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number;
  contract_address: string;
  creator_address: string;
  title: string;
  description?: string;
  category?: string;
  teaser_url?: string;
  funding_goal?: number;
  deadline?: string;
  status: string;
  total_raised: number;
  investor_count: number;
  created_at: string;
}

export const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects?status=active&limit=3');
      if (!response.ok) {
        throw new Error('Failed to fetch featured projects');
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching featured projects:', err);
      setError('Failed to load featured projects');
      // Set mock data as fallback
      setProjects([
        {
          id: 1,
          contract_address: "0x1234567890123456789012345678901234567890",
          creator_address: "0x1234567890123456789012345678901234567890",
          title: "Metaverse Music Festival",
          description: "Immersive virtual music festival experience with NFT ticketing",
          category: "Music",
          funding_goal: 50000,
          total_raised: 38450,
          deadline: "2023-12-31T00:00:00.000Z",
          status: "active",
          investor_count: 124,
          created_at: "2023-06-15T10:30:00.000Z"
        },
        {
          id: 2,
          contract_address: "0x1234567890123456789012345678901234567891",
          creator_address: "0x1234567890123456789012345678901234567891",
          title: "Eco-Friendly Fashion Line",
          description: "Sustainable clothing line made from recycled materials",
          category: "Fashion",
          funding_goal: 25000,
          total_raised: 22100,
          deadline: "2023-11-15T00:00:00.000Z",
          status: "active",
          investor_count: 89,
          created_at: "2023-05-20T14:20:00.000Z"
        },
        {
          id: 3,
          contract_address: "0x1234567890123456789012345678901234567892",
          creator_address: "0x1234567890123456789012345678901234567892",
          title: "Indie Documentary Series",
          description: "Documentary exploring the impact of technology on society",
          category: "Film",
          funding_goal: 75000,
          total_raised: 45600,
          deadline: "2024-01-20T00:00:00.000Z",
          status: "active",
          investor_count: 156,
          created_at: "2023-07-10T09:15:00.000Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30 mb-4">
              <span className="text-purple-400 text-lg">✨</span>
              <span className="text-purple-400 text-sm font-medium">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 p-6">
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse"></div>
                <div className="mt-4 space-y-3">
                  <div className="h-5 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-4/5"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30 mb-4">
            <span className="text-purple-400 text-lg">✨</span>
            <span className="text-purple-400 text-sm font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Projects</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Discover innovative projects from creative minds around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={{ 
                id: project.id,
                title: project.title,
                description: project.description || "No description provided",
                creator: project.creator_address.substring(0, 6) + "..." + project.creator_address.substring(38),
                category: project.category || "General",
                fundingGoal: Number(project.funding_goal) || 0,
                totalRaised: Number(project.total_raised) || 0,
                deadline: project.deadline || "",
                image: project.teaser_url || "/placeholder-project.jpg",
                status: project.status as any,
                investorCount: project.investor_count,
                roi: 0 // Placeholder, would need calculation from API
              }} 
            />
          ))}
        </div>
        
        <div className="text-center mt-14">
          <a 
            href="/explore" 
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all transform hover:-translate-y-1 shadow-lg shadow-purple-500/20 inline-flex items-center gap-2"
          >
            View All Projects <span className="ml-2">✨</span>
          </a>
        </div>
      </div>
    </section>
  );
};