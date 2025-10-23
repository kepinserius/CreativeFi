// backend/src/routes/projects.ts
import express, { Request, Response } from 'express';
import { createProject, updateProject, getAllProjects, getProjectById, addMilestone, syncProjectWithContract, createProjectWithContract } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validateCreateProject } from '../utils/validators';

const router = express.Router();

// POST /api/projects - Create project metadata (using existing contract address)
router.post('/', authenticateToken, (req: Request, res: Response) => {
  // Validate input
  const validation = validateCreateProject(req.body);
  if (!validation.isValid) {
    res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    return;
  }
  
  createProject(req, res);
});

// POST /api/projects/with-contract - Create project with new smart contract
router.post('/with-contract', authenticateToken, (req: Request, res: Response) => {
  // Validate input
  const validation = validateCreateProject(req.body);
  if (!validation.isValid) {
    res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    return;
  }
  
  createProjectWithContract(req, res);
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateToken, (req: Request, res: Response) => {
  updateProject(req, res);
});

// GET /api/projects - List projects with pagination and filtering
router.get('/', (req: Request, res: Response) => {
  getAllProjects(req, res);
});

// GET /api/projects/:id - Get project detail
router.get('/:id', (req: Request, res: Response) => {
  getProjectById(req, res);
});

// POST /api/projects/:id/milestones - Add milestone
router.post('/:id/milestones', authenticateToken, (req: Request, res: Response) => {
  addMilestone(req, res);
});

// POST /api/projects/:id/sync - Sync project data with smart contract
router.post('/:id/sync', authenticateToken, (req: Request, res: Response) => {
  syncProjectWithContract(req, res);
});

export default router;