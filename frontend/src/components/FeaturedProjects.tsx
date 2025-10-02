// src/components/FeaturedProjects.tsx
import { ProjectCard } from './ProjectCard';

export const FeaturedProjects = () => {
  // Mock data for featured projects
  const projects = [
    {
      id: 1,
      title: "Metaverse Music Festival",
      description: "Immersive virtual music festival experience with NFT ticketing",
      creator: "MusicMetaverseDAO",
      category: "Music",
      fundingGoal: 50000,
      totalRaised: 38450,
      deadline: "2023-12-31",
      image: "/placeholder-project.jpg"
    },
    {
      id: 2,
      title: "Eco-Friendly Fashion Line",
      description: "Sustainable clothing line made from recycled materials",
      creator: "GreenFashionCo",
      category: "Fashion",
      fundingGoal: 25000,
      totalRaised: 22100,
      deadline: "2023-11-15",
      image: "/placeholder-project.jpg"
    },
    {
      id: 3,
      title: "Indie Documentary Series",
      description: "Documentary exploring the impact of technology on society",
      creator: "TechDocProductions",
      category: "Film",
      fundingGoal: 75000,
      totalRaised: 45600,
      deadline: "2024-01-20",
      image: "/placeholder-project.jpg"
    }
  ];

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
            <ProjectCard key={project.id} project={project} />
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