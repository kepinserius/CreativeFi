# CreativeFi - Decentralized Crowdfunding Platform

CreativeFi is a decentralized crowdfunding platform for content creators, built on Polygon blockchain. It enables creators to raise funds for their projects by offering token rewards to investors, with automated revenue distribution and milestone-based fund releases.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Security](#security)

## Features

### Smart Contracts
- **ProjectFactory**: Factory contract to create new project contracts
- **CreatorProject**: Individual project contracts with:
  - ERC20 token for each project
  - Multi-token investment support (ETH/USDC/USDT)
  - Milestone-based fund release mechanism
  - Automated revenue distribution to token holders
  - Emergency withdrawal mechanism with voting
  - Vesting schedule for creators (3-month cliff, 12-month vesting)
- **RevenueDistributor**: Automated royalty distribution contract

### Frontend
- **Homepage**: Featured projects, stats, and how it works
- **Project Detail**: Investment calculator, milestone tracking, token holder info
- **Create Project**: Multi-step form with teaser upload and milestone planning
- **Creator Dashboard**: Project management, milestone tracking, revenue distribution
- **Investor Portfolio**: Investment tracking, ROI analysis, transaction history
- **Explore Projects**: Advanced filtering and sorting
- **Web3 Integration**: Wallet connection, contract interactions, transaction tracking

### Backend
- **API Endpoints**: Projects, users, analytics, media upload, payment integration
- **Database**: PostgreSQL with comprehensive schema
- **IPFS Integration**: For media uploads via Pinata
- **Payment Gateway**: Fiat on/off ramp via Transak
- **Security**: Helmet.js, rate limiting, input validation, authentication

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- TailwindCSS for styling
- RainbowKit for wallet connection
- Wagmi and viem for contract interactions
- Shadcn/ui for components

### Smart Contracts
- Solidity
- Hardhat for development
- OpenZeppelin for secure implementations
- Polygon Mumbai Testnet

### Backend
- Node.js with Express
- PostgreSQL for persistent data
- Pinata SDK for IPFS
- JWT for authentication
- Bcrypt for password hashing

## Architecture

```
┌─────────────┐    ┌──────────────────┐    ┌──────────────┐
│   Frontend  │◄──►│     Backend      │◄──►│  PostgreSQL  │
│ (Next.js)   │    │   (Express)      │    │   Database   │
└─────────────┘    └──────────────────┘    └──────────────┘
                        │    ▲
                        │    │
              ┌─────────▼────┼─────────┐
              │ Smart Contracts │    │ IPFS (Pinata)
              │ (Polygon)     │    │
              └───────────────────┘
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker (for PostgreSQL)
- MetaMask wallet

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd creativefi
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Install smart contract dependencies:
```bash
cd creativefi
npm install
```

## Smart Contract Deployment

1. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_deployer_private_key
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

2. Compile the contracts:
```bash
npx hardhat compile
```

3. Deploy to Polygon Mumbai:
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

4. Update the frontend environment with deployed contract addresses:
```env
NEXT_PUBLIC_FACTORY_ADDRESS=your_deployed_factory_address
```

## Environment Setup

Create `.env` files in both frontend and backend:

### Frontend (.env.local)
```env
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_FACTORY_ADDRESS=your_factory_contract_address
NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS=your_revenue_distributor_address
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=creativefi
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your_jwt_secret

# IPFS (Pinata)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Payments (Transak)
TRANSAK_API_KEY=your_transak_api_key
TRANSAK_ENV=STAGING

# Platform
PLATFORM_FEE_PERCENTAGE=5
```

## Development

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

### Smart Contracts
```bash
# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node

# In another terminal, deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

## Deployment

### Frontend (to Vercel)
1. Push code to GitHub
2. Connect Vercel to your repository
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (to Railway)
1. Install Railway CLI
2. Create Railway project
3. Deploy using:
```bash
railway up
```
4. Set environment variables in Railway dashboard

### Smart Contracts
Deploy to Polygon Mainnet:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Testing

### Frontend
```bash
npm run test
```

### Smart Contracts
```bash
npx hardhat test
```

### Backend
```bash
npm run test
```

## API Documentation

### Projects API
- `GET /api/projects` - List projects with pagination and filtering
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `POST /api/projects/:id/milestones` - Add milestone (auth required)

### Users API
- `POST /api/users/register` - Register user
- `GET /api/users/:address` - Get user profile
- `PUT /api/users/:address` - Update user profile (auth required)

### Analytics API
- `GET /api/stats` - Platform statistics
- `GET /api/projects/:id/analytics` - Project analytics
- `GET /api/users/:address/analytics` - User analytics

### Media API
- `POST /api/upload` - Upload file to IPFS
- `GET /api/media/:hash` - Get media from IPFS

### Payment API
- `POST /api/onramp/quote` - Get fiat to crypto quote
- `POST /api/offramp/initiate` - Initiate crypto to fiat conversion

## Security

### Smart Contracts
- ReentrancyGuard protection
- Access control (Ownable)
- Input validation
- Pausable mechanism
- Proper error handling

### Frontend
- XSS prevention
- Input sanitization
- Secure wallet connection

### Backend
- JWT authentication
- SQL injection prevention
- Rate limiting
- File upload validation
- Helmet.js security headers
- CORS configuration

---