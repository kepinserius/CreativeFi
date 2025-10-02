// backend/src/routes/analytics.ts
import express, { Request, Response } from 'express';
import pool from '../config/db';

const router = express.Router();

// GET /api/stats - Platform statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Total platform stats
    const totalProjectsResult = await pool.query(
      'SELECT COUNT(*) as total_projects FROM projects WHERE status IN ($1, $2, $3)',
      ['active', 'funded', 'completed']
    );
    
    const totalFundedResult = await pool.query(
      'SELECT COALESCE(SUM(total_raised), 0) as total_funded FROM projects WHERE status IN ($1, $2, $3)',
      ['active', 'funded', 'completed']
    );
    
    const totalInvestorsResult = await pool.query(
      'SELECT COUNT(DISTINCT investor_address) as total_investors FROM investments'
    );
    
    const successfulProjectsResult = await pool.query(
      'SELECT COUNT(*) as successful_projects FROM projects WHERE status = $1',
      ['completed']
    );
    
    // Category distribution
    const categoryDistributionResult = await pool.query(
      `SELECT category, COUNT(*) as count 
       FROM projects 
       WHERE status IN ($1, $2, $3) 
       GROUP BY category 
       ORDER BY count DESC`,
      ['active', 'funded', 'completed']
    );
    
    // Monthly stats (last 6 months)
    const monthlyStatsResult = await pool.query(
      `SELECT 
         DATE_TRUNC('month', created_at) as month,
         COUNT(*) as new_projects,
         COALESCE(SUM(total_raised), 0) as total_funded
       FROM projects 
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC`
    );
    
    res.json({
      totalProjects: parseInt(totalProjectsResult.rows[0].total_projects),
      totalFunded: parseFloat(totalFundedResult.rows[0].total_funded || 0),
      totalInvestors: parseInt(totalInvestorsResult.rows[0].total_investors),
      successfulProjects: parseInt(successfulProjectsResult.rows[0].successful_projects),
      categoryDistribution: categoryDistributionResult.rows,
      monthlyStats: monthlyStatsResult.rows
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: 'Error fetching platform stats', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

// GET /api/projects/:id/analytics - Project analytics
router.get('/projects/:id/analytics', async (req: Request, res: Response) => {
  try {
    const projectId = parseInt(req.params.id);
    
    // Project-specific analytics
    const projectResult = await pool.query(
      `SELECT 
        p.title,
        p.description,
        p.category,
        p.funding_goal,
        p.total_raised,
        p.investor_count,
        p.status,
        EXTRACT(EPOCH FROM (p.deadline - NOW()))/86400 as days_remaining,
        (p.total_raised / p.funding_goal * 100) as percentage_funded
       FROM projects p 
       WHERE p.id = $1`,
      [projectId]
    );
    
    if (projectResult.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    // Investment timeline
    const investmentTimelineResult = await pool.query(
      `SELECT 
         DATE_TRUNC('day', created_at) as day,
         COUNT(*) as investments_count,
         SUM(amount) as total_amount
       FROM investments 
       WHERE project_id = $1
       GROUP BY DATE_TRUNC('day', created_at)
       ORDER BY day DESC
       LIMIT 30`,
      [projectId]
    );
    
    // Investor distribution
    const investorDistributionResult = await pool.query(
      `SELECT 
         CASE 
           WHEN amount < 100 THEN 'Under 100'
           WHEN amount < 500 THEN '100-500'
           WHEN amount < 1000 THEN '500-1000'
           ELSE 'Over 1000'
         END as investment_range,
         COUNT(*) as count,
         AVG(amount) as avg_amount
       FROM investments 
       WHERE project_id = $1
       GROUP BY investment_range
       ORDER BY avg_amount`,
      [projectId]
    );
    
    // Recent investments
    const recentInvestmentsResult = await pool.query(
      `SELECT 
         investor_address, 
         amount, 
         token, 
         created_at,
         token_amount
       FROM investments 
       WHERE project_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [projectId]
    );
    
    res.json({
      project: projectResult.rows[0],
      investmentTimeline: investmentTimelineResult.rows,
      investorDistribution: investorDistributionResult.rows,
      recentInvestments: recentInvestmentsResult.rows
    });
  } catch (error) {
    console.error('Error fetching project analytics:', error);
    res.status(500).json({ message: 'Error fetching project analytics', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

// GET /api/users/:address/analytics - User analytics
router.get('/users/:address/analytics', async (req: Request, res: Response) => {
  try {
    const walletAddress = req.params.address;
    
    // User-specific analytics
    const userProjectsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_projects,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_projects,
         COALESCE(AVG(total_raised), 0) as avg_raised_per_project,
         COALESCE(MAX(total_raised), 0) as highest_raised_project
       FROM projects 
       WHERE creator_address = $1`,
      [walletAddress]
    );
    
    const userInvestmentsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_investments,
         COALESCE(SUM(amount), 0) as total_invested,
         COALESCE(AVG(amount), 0) as avg_investment,
         COUNT(DISTINCT project_id) as invested_projects_count
       FROM investments 
       WHERE investor_address = $1`,
      [walletAddress]
    );
    
    // Top investments by ROI (simplified - would need actual ROI data)
    const topInvestmentsResult = await pool.query(
      `SELECT 
         p.title,
         i.amount,
         i.token,
         i.created_at
       FROM investments i
       JOIN projects p ON i.project_id = p.id
       WHERE i.investor_address = $1
       ORDER BY i.amount DESC
       LIMIT 5`,
      [walletAddress]
    );
    
    res.json({
      projects: userProjectsResult.rows[0],
      investments: userInvestmentsResult.rows[0],
      topInvestments: topInvestmentsResult.rows
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ message: 'Error fetching user analytics', error: (error as Error).message });
  }
  return; // Added return to satisfy TS7030
});

export default router;