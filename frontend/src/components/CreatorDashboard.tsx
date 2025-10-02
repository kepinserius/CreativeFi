// src/components/CreatorDashboard.tsx
import { useState } from 'react';
import { ProjectCard } from '../components/ProjectCard';

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
  status: 'draft' | 'active' | 'funded' | 'completed' | 'failed';
  investorCount: number;
  roi: number;
}

export const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Mock data for creator's projects
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
      status: "active",
      investorCount: 124,
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
      status: "funded",
      investorCount: 89,
      roi: 32.1
    },
    {
      id: 3,
      title: "Indie Documentary Series",
      description: "Documentary exploring the impact of technology on society",
      creator: "TechDocProductions",
      category: "Film",
      fundingGoal: 75000,
      totalRaised: 12000,
      deadline: "2024-01-20",
      image: "/placeholder-project.jpg",
      status: "active",
      investorCount: 32,
      roi: 12.3
    }
  ];

  // Mock stats
  const stats = {
    totalProjects: 3,
    totalFunded: 75000,
    totalInvestors: 245,
    avgROI: 23.3
  };

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Projects</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalProjects}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Funded</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalFunded.toLocaleString()} ETH</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Investors</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalInvestors}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Avg. ROI</p>
          <p className="text-3xl font-bold text-purple-500">{stats.avgROI}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex">
          {['projects', 'analytics', 'milestones', 'revenue'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Projects</h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Create New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'active' ? 'bg-yellow-900/50 text-yellow-400' :
                      project.status === 'funded' ? 'bg-green-900/50 text-green-400' :
                      project.status === 'completed' ? 'bg-blue-900/50 text-blue-400' :
                      project.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Funded</span>
                      <span>{((project.totalRaised / project.fundingGoal) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((project.totalRaised / project.fundingGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Raised</p>
                      <p>{project.totalRaised.toLocaleString()} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Investors</p>
                      <p>{project.investorCount}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">
                      View
                    </button>
                    <button className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Project Analytics</h2>
            <p className="text-gray-400 mb-6">Detailed analytics and performance metrics for your projects.</p>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="font-bold mb-4">Investor Demographics</h3>
              <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                <p className="text-gray-500">Analytics Chart Placeholder</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4">Funding Timeline</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-500">Timeline Chart Placeholder</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4">ROI Comparison</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-500">ROI Chart Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Milestone Management</h2>
            <p className="text-gray-400 mb-6">Track and manage project milestones.</p>
            
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'active' ? 'bg-yellow-900/50 text-yellow-400' :
                      project.status === 'funded' ? 'bg-green-900/50 text-green-400' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Platform Development</p>
                        <p className="text-sm text-gray-400">Complete core metaverse platform development</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-green-500 text-sm">Completed</span>
                        <button className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded">
                          Release Funds
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Artist Partnerships</p>
                        <p className="text-sm text-gray-400">Sign contracts with 10+ artists for performances</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-yellow-500 text-sm">In Progress</span>
                        <button className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">
                          Submit Proof
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Marketing Campaign</p>
                        <p className="text-sm text-gray-400">Launch marketing and ticket sales</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500 text-sm">Pending</span>
                        <button className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">
                          Submit Proof
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Revenue Distribution</h2>
            <p className="text-gray-400 mb-6">Manage and track revenue sharing with investors.</p>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Revenue Distribution Settings</h3>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                  Distribute Revenue
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400">Total Revenue</p>
                  <p className="text-xl font-bold">12,500 ETH</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400">Platform Fee</p>
                  <p className="text-xl font-bold">625 ETH (5%)</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-gray-400">Distributable</p>
                  <p className="text-xl font-bold">11,875 ETH</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="font-bold mb-4">Distribution History</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Project</th>
                    <th className="text-right py-3">Total Amount</th>
                    <th className="text-right py-3">Platform Share</th>
                    <th className="text-right py-3">Creator Share</th>
                    <th className="text-right py-3">Investor Share</th>
                    <th className="text-right py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Metaverse Music Festival</td>
                    <td className="py-3 text-right">500.00 ETH</td>
                    <td className="py-3 text-right">25.00 ETH</td>
                    <td className="py-3 text-right">100.00 ETH</td>
                    <td className="py-3 text-right">375.00 ETH</td>
                    <td className="py-3 text-right">2023-05-15</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Eco-Friendly Fashion</td>
                    <td className="py-3 text-right">325.50 ETH</td>
                    <td className="py-3 text-right">16.28 ETH</td>
                    <td className="py-3 text-right">65.10 ETH</td>
                    <td className="py-3 text-right">244.12 ETH</td>
                    <td className="py-3 text-right">2023-04-22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};