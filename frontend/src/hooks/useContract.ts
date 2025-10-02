// src/hooks/useContract.ts
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, PROJECT_FACTORY_ABI, CREATOR_PROJECT_ABI } from '@/lib/wagmi';
import { parseEther } from 'viem';

export const useProjectFactory = () => {
  const { address } = useAccount();

  const { writeContract: createProject, isPending: isCreatingProject } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error('Error creating project:', error);
      }
    }
  });

  const { writeContract: investInProject, isPending: isInvesting } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error('Error investing in project:', error);
      }
    }
  });

  const { data: projectCount, refetch: refetchProjectCount } = useReadContract({
    address: CONTRACT_ADDRESSES.PROJECT_FACTORY as `0x${string}`,
    abi: PROJECT_FACTORY_ABI,
    functionName: 'getProjectsCount',
  });

  return {
    createProject: (args: any) => createProject({
      address: CONTRACT_ADDRESSES.PROJECT_FACTORY as `0x${string}`,
      abi: PROJECT_FACTORY_ABI,
      functionName: 'createProject',
      args: args
    }),
    investInProject: (projectAddress: `0x${string}`, args: any) => investInProject({
      address: projectAddress,
      abi: CREATOR_PROJECT_ABI,
      functionName: 'invest',
      args: args
    }),
    projectCount: projectCount ? Number(projectCount) : 0,
    refetchProjectCount,
    isCreatingProject,
    isInvesting,
    isConnected: !!address,
  };
};

export const useProjectDetails = (projectId: number) => {
  const { data: projectData, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESSES.PROJECT_FACTORY as `0x${string}`,
    abi: PROJECT_FACTORY_ABI,
    functionName: 'getProject',
    args: [projectId],
  });

  return {
    project: projectData ? {
      id: projectId,
      title: (projectData as any)[1],
      creator: (projectData as any)[2],
      fundingGoal: Number((projectData as any)[3]),
      totalRaised: Number((projectData as any)[4]),
      deadline: Number((projectData as any)[5]),
      isActive: (projectData as any)[6],
    } : null,
    isLoading,
    isError
  };
};

export const useInvestInProject = (projectAddress: `0x${string}`) => {
  const { writeContract: invest, isPending: isLoading } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error('Error investing:', error);
      }
    }
  });

  return { 
    invest: (args: any) => invest({
      address: projectAddress,
      abi: CREATOR_PROJECT_ABI,
      functionName: 'invest',
      args: args
    }), 
    isLoading 
  };
};