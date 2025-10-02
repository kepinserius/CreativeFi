// src/components/ExploreProjects.tsx
import { useState } from 'react';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number;
  title: string;
  description: string;
  creator: string;
  category: string;
  fundingGoal: number;
  totalRaised: number;
  deadline: string;
  image: string;
  roi: number;
}

export const ExploreProjects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('trending');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    minROI: 0,
    timeline: 'all'
  });
  
  // Mock data for projects
  const projects: Project[] = [
    {
      id: 1,
      title: "Metaverse Music Festival",
      description: "Immersive virtual music festival experience with NFT ticketing",
      creator: "MusicMetaverseDAO",
      category: "Music",
      fundingGoal: 50000,
      totalRaised: 38450,
      deadline: "2023-12-31",
      image: "/placeholder-project.jpg",
      roi: 25.5
    },
    {
      id: 2,
      title: "Eco-Friendly Fashion Line",
      description: "Sustainable clothing line made from recycled materials",
      creator: "GreenFashionCo",
      category: "Fashion",
      fundingGoal: 25000,
      totalRaised: 25000,
      deadline: "2023-11-15",
      image: "/placeholder-project.jpg",
      roi: 32.1
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
      image: "/placeholder-project.jpg",
      roi: 18.7
    },
    {
      id: 4,
      title: "Virtual Reality Art Gallery",
      description: "Immersive VR experience for digital art",
      creator: "ArtVRStudio",
      category: "Art",
      fundingGoal: 30000,
      totalRaised: 18500,
      deadline: "2023-11-30",
      image: "/placeholder-project.jpg",
      roi: 12.3
    },
    {
      id: 5,
      title: "Sustainable Architecture Platform",
      description: "Digital tools for sustainable building design",
      creator: "GreenBuildTech",
      category: "Technology",
      fundingGoal: 45000,
      totalRaised: 22100,
      deadline: "2023-12-15",
      image: "/placeholder-project.jpg",
      roi: 28.9
    },
    {
      id: 6,
      title: "Blockchain Gaming Hub",
      description: "Decentralized platform for blockchain games",
      creator: "GameTechDAO",
      category: "Gaming",
      fundingGoal: 60000,
      totalRaised: 52000,
      deadline: "2024-02-10",
      image: "/placeholder-project.jpg",
      roi: 22.1
    }
  ];

  // Apply filters and sorting
  const filteredProjects = projects
    .filter(project => {
      if (filters.category !== 'all' && project.category !== filters.category) return false;
      if (filters.status !== 'all' && !project.title.toLowerCase().includes(filters.status)) return false;
      if (project.roi < filters.minROI) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return b.roi - a.roi; // Sort by ROI as proxy for trending
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'ending-soon') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === 'most-funded') return b.totalRaised - a.totalRaised;
      return 0;
    });

  const categories = ['all', 'Technology', 'Music', 'Film', 'Art', 'Fashion', 'Gaming', 'Education'];

  return (
    <div>
      {/* Filters and Sorting */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Min ROI</label>
            <select
              value={filters.minROI}
              onChange={(e) => setFilters({...filters, minROI: parseInt(e.target.value)})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="0">Any ROI</option>
              <option value="5">5%+</option>
              <option value="10">10%+</option>
              <option value="15">15%+</option>
              <option value="20">20%+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Timeline</label>
            <select
              value={filters.timeline}
              onChange={(e) => setFilters({...filters, timeline: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Timelines</option>
              <option value="week">Ending this week</option>
              <option value="month">Ending this month</option>
              <option value="3months">3 months</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="most-funded">Most Funded</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">
          Showing <span className="text-white">{filteredProjects.length}</span> projects
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">View:</span>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 flex">
              <div className="w-32 h-24 bg-gray-700 rounded-lg mr-6 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">
                    {project.roi}% ROI
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>by {project.creator}</span>
                  <span className="mx-2">•</span>
                  <span>{project.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-3/4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>{((project.totalRaised / project.fundingGoal) * 100).toFixed(1)}% funded</span>
                      <span>{project.totalRaised.toLocaleString()} / {project.fundingGoal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((project.totalRaised / project.fundingGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <a 
                    href={`/project/${project.id}`} 
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Invest
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredProjects.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg inline-block transition-colors">
            Load More Projects
          </button>
        </div>
      )}
    </div>
  );
};