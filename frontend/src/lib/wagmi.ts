// src/lib/wagmi.ts
import { createConfig, http } from 'wagmi';
import { getDefaultConfig } from 'connectkit';
import { polygonMumbai } from 'wagmi/chains';

export const config = createConfig({
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

// Contract addresses - these would be deployed addresses
export const CONTRACT_ADDRESSES = {
  PROJECT_FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x5FbD1AdC8e49a82778A7A9342656A2fC63585b73', // This would be the deployed address
  REVENUE_DISTRIBUTOR: process.env.NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS || '0x0000000000000000000000000000000000000000', // Placeholder
};

// ABI imports would go here
// For now, we'll define placeholder ABIs
export const PROJECT_FACTORY_ABI = [
  "function createProject(string title, string description, string category, uint256 fundingGoal, uint256 deadline, address usdcToken, address usdtToken, uint256 creatorPercentage, uint256 platformPercentage, uint256 emergencyThreshold) external returns (address)",
  "function getProject(uint256 projectId) external view returns (address projectAddress, string title, address creator, uint256 fundingGoal, uint256 totalRaised, uint256 deadline, bool isActive)",
  "function getProjectsCount() external view returns (uint256)"
] as const;

export const CREATOR_PROJECT_ABI = [
  "function title() external view returns (string)",
  "function description() external view returns (string)",
  "function category() external view returns (string)",
  "function fundingGoal() external view returns (uint256)",
  "function totalRaised() external view returns (uint256)",
  "function deadline() external view returns (uint256)",
  "function creator() external view returns (address)",
  "function isFunded() external view returns (bool)",
  "function isFailed() external view returns (bool)",
  "function isCompleted() external view returns (bool)",
  "function invest(address token, uint256 amount) external payable",
  "function balanceOf(address account) external view returns (uint256)",
  "function addMilestone(string title, string description, uint256 amount, uint256 deadline, string proofUrl) external",
  "function completeMilestone(uint256 milestoneId) external",
  "function releaseMilestoneFunds(uint256 milestoneId) external"
] as const;