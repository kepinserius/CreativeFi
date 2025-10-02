// backend/src/models/User.ts
import pool from '../config/db';

export interface User {
  id: number;
  wallet_address: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  role: string; // 'creator' or 'investor'
  kyc_status?: string;
  created_at: Date;
}

export class UserModel {
  static async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    return result.rows[0] || null;
  }

  static async create(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const { wallet_address, username, email, bio, avatar_url, role, kyc_status } = userData;
    const result = await pool.query(
      `INSERT INTO users (wallet_address, username, email, bio, avatar_url, role, kyc_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [wallet_address, username, email, bio, avatar_url, role, kyc_status]
    );
    return result.rows[0];
  }

  static async updateByWalletAddress(walletAddress: string, updates: Partial<User>): Promise<User | null> {
    const updateFields = Object.keys(updates).filter(key => 
      ['username', 'email', 'bio', 'avatar_url', 'kyc_status'].includes(key)
    );
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [walletAddress, ...updateFields.map(field => updates[field as keyof User])];
    
    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE wallet_address = $1 RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  static async getAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }
}