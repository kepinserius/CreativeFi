// backend/src/models/User.ts
import { Pool } from 'pg';

export interface User {
  id: number;
  wallet_address: string;
  email?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  role?: string;
  kyc_status?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  private static pool: Pool;

  static setPool(newPool: Pool) {
    this.pool = newPool;
  }

  static async findByWalletAddress(wallet_address: string): Promise<User | null> {
    if (!this.pool) {
      throw new Error('Database pool not set');
    }
    
    const query = 'SELECT * FROM users WHERE wallet_address = $1';
    const result = await this.pool.query(query, [wallet_address]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findById(id: number): Promise<User | null> {
    if (!this.pool) {
      throw new Error('Database pool not set');
    }
    
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async create(wallet_address: string, email?: string, username?: string, role?: string, kyc_status?: string): Promise<User> {
    if (!this.pool) {
      throw new Error('Database pool not set');
    }
    
    const query = `
      INSERT INTO users (wallet_address, email, username, role, kyc_status) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const result = await this.pool.query(query, [wallet_address, email, username, role, kyc_status]);
    
    return result.rows[0];
  }

  static async updateByWalletAddress(wallet_address: string, updates: Partial<User>): Promise<User | null> {
    if (!this.pool) {
      throw new Error('Database pool not set');
    }
    
    // Build dynamic query
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return await this.findByWalletAddress(wallet_address);
    }

    const setClause = fields.map((field, index) => `${field} = ${index + 2}`).join(', ');
    const values = [wallet_address, ...Object.values(updates)];

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW() 
      WHERE wallet_address = $1 
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}