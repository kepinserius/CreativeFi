# Content DeFi Platform

Content DeFi is a comprehensive decentralized crowdfunding platform for creators, enabling them to fund their projects through token-based investments. The platform leverages blockchain technology to create a transparent, secure, and efficient funding ecosystem.

## 🚀 Features

- **Decentralized Crowdfunding**: Creators can launch funding campaigns with transparent milestone tracking
- **Multi-token Support**: Accept investments in ETH, USDC, and USDT
- **Smart Contract Integration**: Secure, automated contract execution
- **Revenue Distribution**: Automatic profit sharing with token holders
- **Vesting Schedules**: Creator funds are released gradually to prevent immediate dumping
- **Milestone Tracking**: Transparent project progress verification
- **Web3 Integration**: Seamless wallet connection and transactions

## 🏗️ Architecture

The platform consists of three interconnected components:

### 1. Smart Contracts
- **CreatorProject.sol**: Individual funding campaigns with investment handling
- **ProjectFactory.sol**: Project creation and management hub
- **RevenueDistributor.sol**: Revenue distribution mechanism

### 2. Backend API
- User authentication and management
- Project metadata storage
- Smart contract interaction service
- Investment tracking and analytics

### 3. Frontend Application
- Modern Next.js interface
- Web3 wallet integration
- Project discovery and investment
- Creator dashboard

## 📦 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized deployment)
- **Git**

## 🛠️ Local Development Setup

### Quick Start with Docker (Recommended)

The easiest way to run Content DeFi locally is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd contentdefi

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - Hardhat Node: http://localhost:8545
# - PostgreSQL: localhost:5432
```

### Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd contentdefi
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install smart contract dependencies**
```bash
npm install @openzeppelin/contracts
```

4. **Set up backend**
```bash
cd backend
npm install
```

5. **Set up frontend**
```bash
cd ../frontend
npm install
```

6. **Return to root and compile smart contracts**
```bash
cd ..
npx hardhat compile
```

7. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

8. **Run services separately**
```bash
# Terminal 1 - Start blockchain node
npx hardhat node

# Terminal 2 - Start backend
npm run dev:backend

# Terminal 3 - Start frontend
npm run dev:frontend
```

## 🧪 Testing

### Smart Contract Tests
Run comprehensive smart contract tests:
```bash
npx hardhat test
```

### Integration Tests
Use the comprehensive integration test page:
```bash
# Open in browser
open test_integration.html
```

This provides a full test suite for:
- Backend API connectivity
- Web3 provider connection
- Smart contract interaction
- Full frontend-backend-contract integration

## 🔧 Configuration

### Environment Variables
Create `.env` file with the following variables:

```bash
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=contentdefi

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Web3 Configuration
WEB3_PROVIDER_URL=http://localhost:8545
PROJECT_FACTORY_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Token Addresses (for testing)
USDC_TOKEN_ADDRESS=0x9999999999999999999999999999999999999999
USDT_TOKEN_ADDRESS=0x8888888888888888888888888888888888888888

# Default Percentages
CREATOR_PERCENTAGE=2000
PLATFORM_PERCENTAGE=500
EMERGENCY_THRESHOLD=5000

# Deployment (for production)
MUMBAI_RPC_URL=<your_mumbai_rpc_url>
POLYGON_RPC_URL=<your_polygon_rpc_url>
PRIVATE_KEY=<your_private_key>
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```

## 🚀 Deployment

### Local Deployment
```bash
# Deploy contracts to local Hardhat network
npx hardhat run scripts/deploy.js --network localhost

# Or use Docker Compose for full stack deployment
docker-compose up --build
```

### Testnet Deployment
```bash
# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai
```

### Production Deployment
```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `POST /api/projects` - Create project (with existing contract)
- `POST /api/projects/with-contract` - Create project with new smart contract
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/milestones` - Add milestone
- `POST /api/projects/:id/sync` - Sync with smart contract
