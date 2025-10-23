// backend/src/config/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Explicitly load environment variables first
dotenv.config();

// Log current configuration
console.log('Database configuration:');
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DB_PASSWORD provided:', !!process.env.DB_PASSWORD);
console.log('- DB_PORT:', process.env.DB_PORT || '5432');

// Create a pool configuration object
const poolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'creativefi',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

console.log('Creating PostgreSQL pool with config:', {
  user: poolConfig.user,
  host: poolConfig.host,
  database: poolConfig.database,
  hasPassword: !!poolConfig.password,
  port: poolConfig.port
});

const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Database pool connected successfully');
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export default pool;