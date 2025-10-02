// src/components/ProjectCard.tsx
import Link from 'next/link';
import { formatEther } from 'viem';

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
}

export const ProjectCard = ({ project }: { project: Project }) => {
  const percentageRaised = (project.totalRaised / project.fundingGoal) * 100;
  
  // Calculate days remaining
  const today = new Date();
  const deadlineDate = new Date(project.deadline);
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl shadow-gray-900/30">
      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 flex items-end p-4">
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-purple-400 text-sm font-medium">{project.category}</span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className={`text-xs font-medium ${percentageRaised >= 100 ? 'text-green-400' : percentageRaised >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {percentageRaised.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{formatEther(BigInt(project.totalRaised))} ETH</span>
            <span>{formatEther(BigInt(project.fundingGoal))} ETH</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(percentageRaised, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span className="w-4 h-4 mr-1">👤</span>
            <span>{project.creator}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <span className="w-4 h-4 mr-1">📅</span>
            <span>{daysRemaining > 0 ? `${daysRemaining}d` : 'Ended'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="text-gray-400">Raised</p>
            <p className="text-white font-semibold">{formatEther(BigInt(project.totalRaised))} ETH</p>
          </div>
          
          <Link 
            href={`/project/${project.id}`} 
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm transition-all flex items-center gap-2"
          >
            View Project <span className="ml-1">💳</span>
          </Link>
        </div>
      </div>
    </div>
  );
};