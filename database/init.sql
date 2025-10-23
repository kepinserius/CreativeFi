-- Initialize database tables for Content DeFi

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255),
    username VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'investor',
    kyc_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42) UNIQUE,
    creator_address VARCHAR(42) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    teaser_url VARCHAR(255),
    pitch_deck_url VARCHAR(255),
    funding_goal DECIMAL(20, 6),
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft',
    total_raised DECIMAL(20, 6) DEFAULT 0,
    investor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(20, 6),
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    proof_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    investor_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 6) NOT NULL,
    token_amount DECIMAL(20, 6) NOT NULL,
    token VARCHAR(10) NOT NULL,
    tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_address);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_investments_project ON investments(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_investor ON investments(investor_address);