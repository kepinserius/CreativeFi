// src/components/ProjectDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProjectDetails, useInvestInProject } from '@/hooks/useContract';
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
  milestones: Array<{
    id: number;
    title: string;
    description: string;
    amount: number;
    deadline: string;
    status: 'pending' | 'completed' | 'released';
  }>;
  tokenHolders: Array<{
    address: string;
    tokens: number;
    percentage: number;
  }>;
}

// Mock data for the project
const mockProject: Project = {
  id: 1,
  title: "Metaverse Music Festival",
  description: "Immersive virtual music festival experience with NFT ticketing. Experience live performances in stunning virtual environments with thousands of music lovers from around the world.",
  creator: "MusicMetaverseDAO",
  category: "Music",
  fundingGoal: 50000,
  totalRaised: 38450,
  deadline: "2023-12-31",
  image: "/placeholder-project.jpg",
  milestones: [
    {
      id: 1,
      title: "Platform Development",
      description: "Complete core metaverse platform development",
      amount: 20000,
      deadline: "2023-09-30",
      status: 'completed'
    },
    {
      id: 2,
      title: "Artist Partnerships",
      description: "Sign contracts with 10+ artists for performances",
      amount: 15000,
      deadline: "2023-10-31",
      status: 'pending'
    },
    {
      id: 3,
      title: "Marketing Campaign",
      description: "Launch marketing and ticket sales",
      amount: 10000,
      deadline: "2023-11-30",
      status: 'pending'
    }
  ],
  tokenHolders: [
    { address: "0x1234...5678", tokens: 125000, percentage: 12.5 },
    { address: "0x9876...5432", tokens: 85000, percentage: 8.5 },
    { address: "0xabcd...efgh", tokens: 65000, percentage: 6.5 },
    { address: "0xhijk...lmno", tokens: 45000, percentage: 4.5 },
  ]
};

export const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('ETH');
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [investmentStatus, setInvestmentStatus] = useState<'idle' | 'approving' | 'investing' | 'success' | 'error'>('idle');
  
  // Using the contract hook
  const projectDetails = useProjectDetails(parseInt(projectId));
  const { invest, isLoading: isInvesting } = useInvestInProject('0x0000000000000000000000000000000000000000' as `0x${string}`); // Placeholder address

  useEffect(() => {
    // In a real app, fetch from backend or contract
    // For now using mock data
    setProject(mockProject);
  }, [projectId]);

  // Handle investment
  const handleInvest = async () => {
    if (!isConnected || !amount) return;
    
    try {
      setInvestmentStatus('investing');
      
      // In a real implementation, we would call the invest function
      // with the project contract address and investment details
      console.log("Investing", { amount, token });
      
      // Mock success
      setTimeout(() => {
        setInvestmentStatus('success');
        // Reset after success message
        setTimeout(() => setInvestmentStatus('idle'), 3000);
      }, 1500);
    } catch (error) {
      console.error("Investment failed:", error);
      setInvestmentStatus('error');
      setTimeout(() => setInvestmentStatus('idle'), 3000);
    }
  };

  if (projectDetails.isLoading && !project) {
    return <div className="container mx-auto px-4 py-10">Loading project...</div>;
  }

  const currentProject = project || {
    ...mockProject,
    totalRaised: Number(projectDetails.project?.totalRaised || 0),
    fundingGoal: Number(projectDetails.project?.fundingGoal || 50000),
  };
  
  const percentageRaised = (currentProject.totalRaised / currentProject.fundingGoal) * 100;

  return (
    <div>
      {/* Header - Reusing header from home but with back button */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-purple-500 mr-6">Creative<span className="text-white">Fi</span></a>
            <a href="/explore" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Creator Dashboard
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Info Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{currentProject.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <span>by {currentProject.creator}</span>
                    <span>·</span>
                    <span>{currentProject.category}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{percentageRaised.toFixed(1)}% funded</span>
                  <span>{formatEther(BigInt(currentProject.totalRaised))} ETH / {formatEther(BigInt(currentProject.fundingGoal))} ETH</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full" 
                    style={{ width: `${Math.min(percentageRaised, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">{formatEther(BigInt(currentProject.totalRaised))} ETH</p>
                  <p className="text-gray-400 text-sm">Raised</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-purple-500">{currentProject.milestones.length}</p>
                  <p className="text-gray-400 text-sm">Milestones</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{currentProject.description}</p>

              {/* Video player placeholder */}
              <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Project Teaser Video</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="border-b border-gray-700">
                <div className="flex">
                  {['overview', 'milestones', 'token', 'comments'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-4 font-medium capitalize ${activeTab === tab ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                    <p className="text-gray-300 mb-4">{currentProject.description}</p>
                    <p className="text-gray-300">This project aims to revolutionize the music industry by bringing concerts to the metaverse, allowing fans to experience live performances with interactive elements, and creating new revenue streams for artists. The platform will feature:</p>
                    <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                      <li>High-quality immersive virtual environments</li>
                      <li>Real-time audio streaming with spatial audio</li>
                      <li>Interactive elements and artist meet and greets</li>
                      <li>NFT ticketing system with special perks</li>
                      <li>Revenue sharing with token holders</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Project Milestones</h3>
                    <div className="space-y-4">
                      {currentProject.milestones.map((milestone) => (
                        <div key={milestone.id} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold">{milestone.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              milestone.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                              milestone.status === 'released' ? 'bg-purple-900/50 text-purple-400' :
                              'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">{milestone.description}</p>
                          <div className="flex justify-between mt-3 text-sm">
                            <span className="text-purple-500">Funding: {formatEther(BigInt(milestone.amount))} ETH</span>
                            <span>Deadline: {new Date(milestone.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'token' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Token Holders</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3">Address</th>
                            <th className="text-right py-3">Tokens</th>
                            <th className="text-right py-3">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProject.tokenHolders.map((holder, index) => (
                            <tr key={index} className="border-b border-gray-800">
                              <td className="py-3 text-purple-500">{holder.address}</td>
                              <td className="py-3 text-right">{holder.tokens.toLocaleString()}</td>
                              <td className="py-3 text-right">{holder.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Investor Comments</h3>
                    <div className="text-gray-400 text-center py-10">
                      No comments yet. Be the first to comment on this project!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Investment Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Invest in this Project</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Investment Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pr-24 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <select
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="absolute right-0 top-0 h-full bg-purple-600 text-white rounded-r-lg px-4 border-0 focus:outline-none"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Expected Tokens</span>
                    <span className="font-medium">{amount ? (parseFloat(amount) * 1000).toLocaleString() : '0'} CRMTK</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated ROI</span>
                    <span className="font-medium text-green-400">25.5%</span>
                  </div>
                </div>
              </div>
              
              {isConnected ? (
                <button 
                  onClick={handleInvest}
                  disabled={isInvesting || investmentStatus === 'investing' || !amount}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    isInvesting || investmentStatus === 'investing'
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {investmentStatus === 'investing' ? 'Processing...' : 'Invest Now'}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Connect your wallet to invest</p>
                  <ConnectButton />
                </div>
              )}
              
              {/* Status messages */}
              {investmentStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-center">
                  Investment successful!
                </div>
              )}
              {investmentStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-center">
                  Investment failed. Please try again.
                </div>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span>{currentProject.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span>{currentProject.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Funding Goal</span>
                  <span>{formatEther(BigInt(currentProject.fundingGoal))} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline</span>
                  <span>{new Date(currentProject.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};