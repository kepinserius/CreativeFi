// backend/src/routes/users.ts
import express, { Request, Response } from 'express';
import { registerUser, getUserProfile, updateUserProfile, getUserProjects } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUserRegistration } from '../utils/validators';

const router = express.Router();

// POST /api/users/register - Register user (creator/investor)
router.post('/register', (req: Request, res: Response) => {
  // Validate input
  const validation = validateUserRegistration(req.body);
  if (!validation.isValid) {
    res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    return;
  }
  
  registerUser(req, res);
  return; // Added return to satisfy TS7030
});

// GET /api/users/:address - Get user profile
router.get('/:address', (req: Request, res: Response) => {
  getUserProfile(req, res);
  return; // Added return to satisfy TS7030
});

// PUT /api/users/:address - Update user profile
router.put('/:address', authenticateToken, (req: Request, res: Response) => {
  updateUserProfile(req, res);
  return; // Added return to satisfy TS7030
});

// GET /api/users/:address/projects - Get user's projects
router.get('/:address/projects', (req: Request, res: Response) => {
  getUserProjects(req, res);
  return; // Added return to satisfy TS7030
});

export default router;