// backend/src/controllers/projectController.ts
import { Request, Response } from 'express';
import { ProjectModel, MilestoneModel, InvestmentModel } from '../models/Project';
import contractService from '../services/contractService';
import { validateCreateProject } from '../utils/validators';

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      contract_address,
      title,
      description,
      category,
      funding_goal,
      deadline,
      teaser_url,
      pitch_deck_url
    } = req.body;

    // Verify user from auth middleware
    const creator_address = (req as any).user.wallet_address;

    // Validate contract address format
    if (!contract_address || !contractService.isValidProjectContract(contract_address)) {
      return res.status(400).json({ message: 'Invalid or non-existent project contract address' });
    }

    // Additional validation could include checking if the contract was created via our factory
    // This would require maintaining a registry of valid project addresses on the backend

    // Create project
    const project = await ProjectModel.create({
      contract_address,
      creator_address,
      title,
      description,
      category,
      teaser_url,
      pitch_deck_url,
      funding_goal,
      deadline,
      status: 'draft'
    });

    // Optionally sync initial project data from contract
    try {
      await contractService.syncProjectData(contract_address);
    } catch (syncError) {
      // Non-fatal error - log it but continue with the request
      console.error('Error syncing project data:', syncError);
    }

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project.id,
        contract_address: project.contract_address,
        title: project.title,
        status: project.status
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const updates = req.body;
    
    // Verify user is owner in real implementation
    const project = await ProjectModel.updateById(projectId, updates);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Get filters from query params
    const filter = {
      status: req.query.status as string,
      category: req.query.category as string
    };
    
    // In a real implementation, we would apply pagination
    const projects = await ProjectModel.getAll(filter);
    
    // Get total count for pagination
    // This would be implemented with a separate count query in production
    
    res.json({
      projects,
      pagination: {
        page,
        limit,
        total: projects.length, // This should be a separate count query
        pages: Math.ceil(projects.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get related data
    const milestones = await MilestoneModel.getByProjectId(projectId);
    const investments = await InvestmentModel.getByProjectId(projectId);
    
    res.json({
      ...project,
      milestones,
      investments: investments.slice(0, 5), // Limit recent investments
      investment_count: investments.length
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

export const addMilestone = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    const { title, description, amount, deadline, proof_url } = req.body;
    
    // Verify user is the project creator
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // In a real app, we'd verify the user is the creator
    // const user = (req as any).user;
    // if (project.creator_address !== user.wallet_address) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }
    
    const milestone = await MilestoneModel.create({
      project_id: projectId,
      title,
      description,
      amount,
      deadline,
      proof_url,
      status: 'pending'
    });
    
    res.status(201).json({
      message: 'Milestone added successfully',
      milestone
    });
  } catch (error) {
    console.error('Error adding milestone:', error);
    res.status(500).json({ message: 'Error adding milestone', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

// Endpoint untuk sinkronisasi data dari smart contract
// Endpoint untuk membuat proyek baru termasuk smart contract
export const createProjectWithContract = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      funding_goal,
      deadline,
      teaser_url,
      pitch_deck_url
    } = req.body;

    // Verify user from auth middleware
    const creator_address = (req as any).user.wallet_address;

    // Convert funding goal to wei
    const fundingGoalWei = contractService.toWei(funding_goal.toString(), 'ether');
    
    // Set default values for smart contract parameters
    const USDC_TOKEN = process.env.USDC_TOKEN_ADDRESS || '0x9999999999999999999999999999999999999999'; // Mock USDC
    const USDT_TOKEN = process.env.USDT_TOKEN_ADDRESS || '0x8888888888888888888888888888888888888888'; // Mock USDT
    const CREATOR_PERCENTAGE = parseInt(process.env.CREATOR_PERCENTAGE || '2000'); // 20%
    const PLATFORM_PERCENTAGE = parseInt(process.env.PLATFORM_PERCENTAGE || '500'); // 5%
    const EMERGENCY_THRESHOLD = parseInt(process.env.EMERGENCY_THRESHOLD || '5000'); // 50%

    // Create project on smart contract
    const contractAddress = await contractService.createProjectOnContract(
      title,
      description,
      category,
      fundingGoalWei,
      Math.floor(new Date(deadline).getTime() / 1000), // Convert to timestamp
      USDC_TOKEN,
      USDT_TOKEN,
      CREATOR_PERCENTAGE,
      PLATFORM_PERCENTAGE,
      EMERGENCY_THRESHOLD,
      creator_address
    );

    // Create project record in database
    const project = await ProjectModel.create({
      contract_address: contractAddress,
      creator_address,
      title,
      description,
      category,
      teaser_url,
      pitch_deck_url,
      funding_goal,
      deadline: new Date(deadline),
      status: 'active' // Set to active since contract is created
    });

    // Sync initial data from contract
    try {
      await contractService.syncProjectData(contractAddress);
    } catch (syncError) {
      // Non-fatal error - log it but continue
      console.error('Error syncing initial project data:', syncError);
    }

    res.status(201).json({
      message: 'Project created successfully with smart contract',
      project: {
        id: project.id,
        contract_address: project.contract_address,
        title: project.title,
        status: project.status,
        funding_goal: project.funding_goal,
        deadline: project.deadline
      }
    });
  } catch (error) {
    console.error('Error creating project with contract:', error);
    res.status(500).json({ message: 'Error creating project with contract', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};

export const syncProjectWithContract = async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    
    // Get project from database
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Sync data from smart contract
    await contractService.syncProjectData(project.contract_address);
    
    // Return updated project data
    const updatedProject = await ProjectModel.findById(projectId);
    
    res.json({
      message: 'Project data synced successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error syncing project with contract:', error);
    res.status(500).json({ message: 'Error syncing project with contract', error: (error as Error).message });
  }
  return; // Required to satisfy TS7030
};