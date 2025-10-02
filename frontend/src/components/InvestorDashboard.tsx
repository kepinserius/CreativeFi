// src/components/InvestorDashboard.tsx
import { useState } from 'react';

interface Investment {
  id: number;
  projectId: number;
  projectName: string;
  amount: number;
  tokenAmount: number;
  token: string;
  date: string;
  roi: number;
  status: 'active' | 'completed' | 'failed';
}

interface Transaction {
  id: number;
  type: 'investment' | 'revenue' | 'withdrawal';
  project: string;
  amount: number;
  token: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for investments
  const investments: Investment[] = [
    {
      id: 1,
      projectId: 1,
      projectName: "Metaverse Music Festival",
      amount: 2.5,
      tokenAmount: 2500,
      token: 'ETH',
      date: "2023-05-15",
      roi: 12.5,
      status: 'active'
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Eco-Friendly Fashion Line",
      amount: 1.2,
      tokenAmount: 1200,
      token: 'ETH',
      date: "2023-04-22",
      roi: 32.1,
      status: 'completed'
    },
    {
      id: 3,
      projectId: 3,
      projectName: "Indie Documentary Series",
      amount: 0.8,
      tokenAmount: 800,
      token: 'ETH',
      date: "2023-06-10",
      roi: -5.2,
      status: 'active'
    }
  ];

  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'investment',
      project: "Metaverse Music Festival",
      amount: 2.5,
      token: 'ETH',
      date: "2023-05-15",
      status: 'completed'
    },
    {
      id: 2,
      type: 'revenue',
      project: "Eco-Friendly Fashion Line",
      amount: 0.325,
      token: 'ETH',
      date: "2023-05-20",
      status: 'completed'
    },
    {
      id: 3,
      type: 'investment',
      project: "Indie Documentary Series",
      amount: 0.8,
      token: 'ETH',
      date: "2023-06-10",
      status: 'completed'
    },
    {
      id: 4,
      type: 'investment',
      project: "Eco-Friendly Fashion Line",
      amount: 1.2,
      token: 'ETH',
      date: "2023-04-22",
      status: 'completed'
    }
  ];

  // Watchlist projects
  const watchlist = [
    {
      id: 4,
      title: "Virtual Reality Art Gallery",
      description: "Immersive VR experience for digital art",
      category: "Art",
      fundingGoal: 30000,
      totalRaised: 18500,
      deadline: "2023-11-30"
    },
    {
      id: 5,
      title: "Sustainable Architecture Platform",
      description: "Digital tools for sustainable building design",
      category: "Technology",
      fundingGoal: 45000,
      totalRaised: 22100,
      deadline: "2023-12-15"
    }
  ];

  // Calculate portfolio stats
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments
    .filter(inv => inv.status === 'completed')
    .reduce((sum, inv) => sum + (inv.amount * (1 + inv.roi/100)), 0);
  const currentPortfolioValue = investments
    .filter(inv => inv.status === 'active')
    .reduce((sum, inv) => sum + (inv.amount * (1 + inv.roi/100)), 0);
  const totalROI = ((totalReturns + currentPortfolioValue - totalInvested) / totalInvested) * 100;

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Invested</p>
          <p className="text-3xl font-bold text-purple-500">{totalInvested.toFixed(2)} ETH</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Current Value</p>
          <p className="text-3xl font-bold text-purple-500">{(totalInvested + (totalInvested * totalROI/100)).toFixed(2)} ETH</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400">Total Returns</p>
          <p className="text-3xl font-bold text-purple-500">{totalReturns.toFixed(2)} ETH</p>
        </div>
        <div className={`bg-gray-800/50 p-6 rounded-xl border border-gray-700`}>
          <p className="text-gray-400">Total ROI</p>
          <p className={`text-3xl font-bold ${totalROI >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex">
          {['overview', 'investments', 'transactions', 'watchlist'].map((tab) => (
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
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Portfolio Overview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
                  <h3 className="font-bold mb-4">Portfolio Performance</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500">Portfolio Performance Chart Placeholder</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <h3 className="font-bold mb-4">Asset Allocation</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500">Asset Allocation Chart Placeholder</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
                  <h3 className="font-bold mb-4">Top Performers</h3>
                  <div className="space-y-4">
                    {investments
                      .filter(inv => inv.roi > 0)
                      .sort((a, b) => b.roi - a.roi)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{investment.projectName}</p>
                            <p className="text-sm text-gray-400">{investment.token}</p>
                          </div>
                          <span className="text-green-500 font-bold">+{investment.roi}%</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <h3 className="font-bold mb-4">Top Risks</h3>
                  <div className="space-y-4">
                    {investments
                      .filter(inv => inv.roi < 0)
                      .sort((a, b) => a.roi - b.roi)
                      .slice(0, 3)
                      .map((investment) => (
                        <div key={investment.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{investment.projectName}</p>
                            <p className="text-sm text-gray-400">{investment.token}</p>
                          </div>
                          <span className="text-red-500 font-bold">{investment.roi}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Investments</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Project</th>
                    <th className="text-right py-3">Invested</th>
                    <th className="text-right py-3">Tokens</th>
                    <th className="text-right py-3">ROI</th>
                    <th className="text-right py-3">Status</th>
                    <th className="text-right py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3">
                        <div className="font-medium">{investment.projectName}</div>
                        <div className="text-sm text-gray-400">Project #{investment.projectId}</div>
                      </td>
                      <td className="py-3 text-right">{investment.amount} {investment.token}</td>
                      <td className="py-3 text-right">{investment.tokenAmount.toLocaleString()}</td>
                      <td className={`py-3 text-right font-medium ${investment.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          investment.status === 'active' ? 'bg-yellow-900/50 text-yellow-400' :
                          investment.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right">{new Date(investment.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3">Type</th>
                    <th className="text-left py-3">Project</th>
                    <th className="text-right py-3">Amount</th>
                    <th className="text-right py-3">Status</th>
                    <th className="text-right py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.type === 'investment' ? 'bg-purple-900/50 text-purple-400' :
                          transaction.type === 'revenue' ? 'bg-green-900/50 text-green-400' :
                          'bg-blue-900/50 text-blue-400'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">{transaction.project}</td>
                      <td className="py-3 text-right">{transaction.amount} {transaction.token}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                          transaction.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right">{new Date(transaction.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Watchlist</h2>
            <p className="text-gray-400 mb-6">Projects you're monitoring.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((project) => {
                const percentageRaised = (project.totalRaised / project.fundingGoal) * 100;
                return (
                  <div key={project.id} className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold">{project.title}</h3>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>{percentageRaised.toFixed(1)}% funded</span>
                        <span>{project.totalRaised.toLocaleString()} / {project.fundingGoal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(percentageRaised, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      <button className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};