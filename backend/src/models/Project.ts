// backend/src/models/Project.ts
import pool from '../config/db';

export interface Project {
  id: number;
  contract_address: string;
  creator_address: string;
  title: string;
  description?: string;
  category?: string;
  teaser_url?: string;
  pitch_deck_url?: string;
  funding_goal?: number;
  deadline?: Date;
  status: string; // 'draft', 'active', 'funded', 'completed', 'failed'
  total_raised: number;
  investor_count: number;
  created_at: Date;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  amount?: number;
  deadline?: Date;
  status: string; // 'pending', 'completed', 'released'
  proof_url?: string;
  created_at: Date;
}

export interface Investment {
  id: number;
  project_id: number;
  investor_address: string;
  amount: number;
  token_amount: number;
  token: string; // 'ETH', 'USDC', 'USDT'
  tx_hash?: string;
  created_at: Date;
}

export class ProjectModel {
  static async findById(id: number): Promise<Project | null> {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByContractAddress(contractAddress: string): Promise<Project | null> {
    const result = await pool.query(
      'SELECT * FROM projects WHERE contract_address = $1',
      [contractAddress]
    );
    return result.rows[0] || null;
  }

  static async create(projectData: Omit<Project, 'id' | 'total_raised' | 'investor_count' | 'created_at'>): Promise<Project> {
    const {
      contract_address, creator_address, title, description, category,
      teaser_url, pitch_deck_url, funding_goal, deadline, status
    } = projectData;
    
    const result = await pool.query(
      `INSERT INTO projects 
       (contract_address, creator_address, title, description, category, 
        teaser_url, pitch_deck_url, funding_goal, deadline, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [contract_address, creator_address, title, description, category,
       teaser_url, pitch_deck_url, funding_goal, deadline, status]
    );
    return result.rows[0];
  }

  static async updateById(id: number, updates: Partial<Project>): Promise<Project | null> {
    const updateFields = Object.keys(updates).filter(key => 
      ['title', 'description', 'category', 'funding_goal', 'deadline', 'teaser_url', 'pitch_deck_url', 'status'].includes(key)
    );
    
    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const setClause = updateFields.map((field, index) => `${field} = ${index + 2}`).join(', ');
    const values = [id, ...updateFields.map(field => updates[field as keyof Partial<Project>])];
    
    const result = await pool.query(
      `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    
    return result.rows[0] || null;
  }

  static async getByCreatorAddress(creatorAddress: string): Promise<Project[]> {
    const result = await pool.query(
      'SELECT * FROM projects WHERE creator_address = $1 ORDER BY created_at DESC',
      [creatorAddress]
    );
    return result.rows;
  }

  static async getAll(filter: { status?: string; category?: string; } = {}): Promise<Project[]> {
    let query = 'SELECT * FROM projects';
    const params: (string | undefined)[] = [];
    
    const conditions: string[] = [];
    if (filter.status) {
      params.push(filter.status);
      conditions.push(`status = ${params.length}`);
    }
    
    if (filter.category) {
      params.push(filter.category);
      conditions.push(`category = ${params.length}`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }
}

export class MilestoneModel {
  static async create(milestoneData: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> {
    const {
      project_id, title, description, amount, deadline, proof_url
    } = milestoneData;
    
    const result = await pool.query(
      `INSERT INTO milestones 
       (project_id, title, description, amount, deadline, proof_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [project_id, title, description, amount, deadline, proof_url]
    );
    return result.rows[0];
  }

  static async getByProjectId(projectId: number): Promise<Milestone[]> {
    const result = await pool.query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY created_at',
      [projectId]
    );
    return result.rows;
  }
}

export class InvestmentModel {
  static async create(investmentData: Omit<Investment, 'id' | 'created_at'>): Promise<Investment> {
    const {
      project_id, investor_address, amount, token_amount, token, tx_hash
    } = investmentData;
    
    const result = await pool.query(
      `INSERT INTO investments 
       (project_id, investor_address, amount, token_amount, token, tx_hash) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [project_id, investor_address, amount, token_amount, token, tx_hash]
    );
    return result.rows[0];
  }

  static async getByProjectId(projectId: number): Promise<Investment[]> {
    const result = await pool.query(
      'SELECT * FROM investments WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  }

  static async getByInvestorAddress(investorAddress: string): Promise<Investment[]> {
    const result = await pool.query(
      'SELECT * FROM investments WHERE investor_address = $1 ORDER BY created_at DESC',
      [investorAddress]
    );
    return result.rows;
  }
}