// src/components/InvestorDashboard.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Investment {
  id: number;
  projectId: number;
  projectName: string;
  amount: number;
  tokenSymbol: string;
  tokensReceived: number;
  date: string;
  status: 'active' | 'completed' | 'failed';
  roi: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  totalRaised: number;
  deadline: string;
  image: string;
  roi: number;
  tokensOwned: number;
}

export const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();

  // Mock stats
  const stats = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    totalValue: investments.reduce((sum, inv) => sum + inv.amount * (1 + inv.roi/100), 0),
    totalProjects: investments.length,
    avgROI: investments.length ? investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length : 0
  };

  // Fetch investor's data when component mounts
  useEffect(() => {
    if (isConnected && address) {
      fetchInvestorData();
    }
  }, [isConnected, address]);

  const fetchInvestorData = async () => {
    try {
      setLoading(true);
      
      // Mock investments data
      const mockInvestments: Investment[] = [
        {
          id: 1,
          projectId: 1,
          projectName: "Metaverse Music Festival",
          amount: 500,
          tokenSymbol: "MMF",
          tokensReceived: 1000,
          date: "2023-03-15",
          status: "active",
          roi: 25.5
        },
        {
          id: 2,
          projectId: 2,
          projectName: "Eco-Friendly Fashion Line",
          amount: 250,
          tokenSymbol: "EFG",
          tokensReceived: 500,
          date: "2023-04-20",
          status: "active",
          roi: 32.1
        },
        {
          id: 3,
          projectId: 3,
          projectName: "Indie Documentary Series",
          amount: 100,
          tokenSymbol: "IDS",
          tokensReceived: 200,
          date: "2023-05-10",
          status: "active",
          roi: 12.3
        }
      ];
      
      setInvestments(mockInvestments);
      
      // Mock projects data
      const mockProjects: Project[] = [
        {
          id: 1,
          title: "Metaverse Music Festival",
          description: "Immersive virtual music festival experience with NFT ticketing",
          category: "Music",
          fundingGoal: 50000,
          totalRaised: 38450,
          deadline: "2023-12-31",
          image: "/placeholder-project.jpg",
          roi: 25.5,
          tokensOwned: 1000
        },
        {
          id: 2,
          title: "Eco-Friendly Fashion Line",
          description: "Sustainable clothing line made from recycled materials",
          category: "Fashion",
          fundingGoal: 25000,
          totalRaised: 25000,
          deadline: "2023-11-15",
          image: "/placeholder-project.jpg",
          roi: 32.1,
          tokensOwned: 500
        },
        {
          id: 3,
          title: "Indie Documentary Series",
          description: "Documentary exploring the impact of technology on society",
          category: "Film",
          fundingGoal: 75000,
          totalRaised: 12000,
          deadline: "2024-01-20",
          image: "/placeholder-project.jpg",
          roi: 12.3,
          tokensOwned: 200
        }
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching investor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">Please connect your wallet to access your investor dashboard</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Invested</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalInvested.toLocaleString()} ETH</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Portfolio Value</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalValue.toLocaleString()} ETH</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Projects Invested</p>
          <p className="text-3xl font-bold text-purple-500">{stats.totalProjects}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Avg. ROI</p>
          <p className="text-3xl font-bold text-purple-500">{stats.avgROI.toFixed(1)}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex">
          {['portfolio', 'investments', 'analytics', 'rewards'].map((tab) => (
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
        {activeTab === 'portfolio' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Portfolio</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <span className="px-2 py-1 rounded text-xs bg-purple-900/50 text-purple-400">
                      {project.category}
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
                      <p className="text-gray-400">Tokens Owned</p>
                      <p>{project.tokensOwned.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">ROI</p>
                      <p className={project.roi >= 0 ? "text-green-500" : "text-red-500"}>{project.roi}%</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                      onClick={() => window.location.href = `/project/${project.id}`}
                    >
                      View Details
                    </button>
                    <button 
                      className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded"
                    >
                      Trade Tokens
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Investment History</h2>
            <p className="text-gray-400 mb-6">All your investments on the platform.</p>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Project</th>
                    <th className="text-right py-3">Amount</th>
                    <th className="text-right py-3">Tokens</th>
                    <th className="text-right py-3">ROI</th>
                    <th className="text-center py-3">Status</th>
                    <th className="text-right py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map(investment => (
                    <tr key={investment.id} className="border-b border-gray-800">
                      <td className="py-3">{investment.projectName}</td>
                      <td className="py-3 text-right">{investment.amount} ETH</td>
                      <td className="py-3 text-right">{investment.tokensReceived} {investment.tokenSymbol}</td>
                      <td className={`py-3 text-right ${investment.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          investment.status === 'active' ? 'bg-yellow-900/50 text-yellow-400' :
                          investment.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{investment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Investment Analytics</h2>
            <p className="text-gray-400 mb-6">Detailed analytics of your investment portfolio.</p>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
              <h3 className="font-bold mb-4">Portfolio Performance</h3>
              <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                <p className="text-gray-500">Portfolio Performance Chart Placeholder</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4">Investment Distribution</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-500">Distribution Chart Placeholder</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <h3 className="font-bold mb-4">ROI by Category</h3>
                <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <p className="text-gray-500">ROI Chart Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Rewards & Distributions</h2>
            <p className="text-gray-400 mb-6">Revenue sharing and token rewards from your investments.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400">Total Rewards</p>
                <p className="text-3xl font-bold text-purple-500">1,250 ETH</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400">Available to Claim</p>
                <p className="text-3xl font-bold text-purple-500">245 ETH</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <p className="text-gray-400">Next Distribution</p>
                <p className="text-3xl font-bold text-purple-500">2023-06-01</p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="font-bold mb-4">Recent Distributions</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Project</th>
                    <th className="text-right py-3">Amount</th>
                    <th className="text-right py-3">Token</th>
                    <th className="text-center py-3">Status</th>
                    <th className="text-right py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Metaverse Music Festival</td>
                    <td className="py-3 text-right">25.00 ETH</td>
                    <td className="py-3 text-right">MMF</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400">
                        Claimed
                      </span>
                    </td>
                    <td className="py-3 text-right">2023-05-15</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Eco-Friendly Fashion</td>
                    <td className="py-3 text-right">16.28 ETH</td>
                    <td className="py-3 text-right">EFG</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400">
                        Claimed
                      </span>
                    </td>
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