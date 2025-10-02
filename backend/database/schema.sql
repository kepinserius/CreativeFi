-- backend/database/schema.sql

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(50),
  email VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  role VARCHAR(20), -- creator/investor
  kyc_status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  contract_address VARCHAR(42) UNIQUE NOT NULL,
  creator_address VARCHAR(42) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  teaser_url TEXT,
  pitch_deck_url TEXT,
  funding_goal DECIMAL(20,2),
  deadline TIMESTAMP,
  status VARCHAR(20), -- draft/active/funded/completed/failed
  total_raised DECIMAL(20,2) DEFAULT 0,
  investor_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (creator_address) REFERENCES users(wallet_address)
);

-- Create milestones table
CREATE TABLE milestones (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200),
  description TEXT,
  amount DECIMAL(20,2),
  deadline TIMESTAMP,
  status VARCHAR(20), -- pending/completed/released
  proof_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Create investments table
CREATE TABLE investments (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  investor_address VARCHAR(42) NOT NULL,
  amount DECIMAL(20,2),
  token_amount DECIMAL(20,2),
  token VARCHAR(10), -- ETH/USDC/USDT
  tx_hash VARCHAR(66),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (investor_address) REFERENCES users(wallet_address)
);

-- Create revenue distributions table
CREATE TABLE revenue_distributions (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  total_amount DECIMAL(20,2),
  distribution_date TIMESTAMP DEFAULT NOW(),
  tx_hash VARCHAR(66),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);