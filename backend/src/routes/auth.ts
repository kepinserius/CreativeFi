// backend/src/routes/auth.ts
import express, { Request, Response } from 'express';
import { registerUser, getUserProfile, updateUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUserRegistration } from '../utils/validators';

const router = express.Router();

// POST /api/auth/register - Register user with wallet address
router.post('/register', (req: Request, res: Response) => {
  // Validate input
  const validation = validateUserRegistration(req.body);
  if (!validation.isValid) {
    res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    return;
  }
  
  registerUser(req, res);
});

// GET /api/auth/profile - Get authenticated user profile
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  // This will return the profile of the authenticated user
  (req as any).params = { address: (req as any).user.wallet_address };
  getUserProfile(req, res);
});

// PUT /api/auth/profile - Update authenticated user profile
router.put('/profile', authenticateToken, (req: Request, res: Response) => {
  // This will update the profile of the authenticated user
  (req as any).params = { address: (req as any).user.wallet_address };
  updateUserProfile(req, res);
});

export default router;