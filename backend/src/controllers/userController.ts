// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { wallet_address, username, email, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByWalletAddress(wallet_address);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this wallet address already exists' });
    }

    // Create new user
    const user = await UserModel.create({
      wallet_address,
      username,
      email,
      role: role || 'investor',
      kyc_status: 'pending'
    });

    // Generate JWT token
    const token = jwt.sign(
      { wallet_address: user.wallet_address, id: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const walletAddress = req.params.address;

    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      wallet_address: user.wallet_address,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      role: user.role,
      kyc_status: user.kyc_status,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const walletAddress = req.params.address;
    const updates = req.body;

    // Verify user owns this wallet address (from auth middleware)
    const requestingUser = (req as any).user;
    if (requestingUser.wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to update this user profile' });
    }

    const updatedUser = await UserModel.updateByWalletAddress(walletAddress, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        wallet_address: updatedUser.wallet_address,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar_url: updatedUser.avatar_url,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const walletAddress = req.params.address;

    // This would be implemented in the projects controller
    // For now, returning a placeholder response
    res.json({
      message: 'This endpoint would return projects associated with the user',
      walletAddress
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching user projects', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
};