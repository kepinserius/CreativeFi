# Smart Contract Integration Documentation

## Overview
The Content DeFi platform integrates with Ethereum smart contracts through a hybrid architecture where:
- The frontend directly interacts with smart contracts using Web3 providers (e.g., Metamask)
- The backend provides additional services like authentication, user management, and data synchronization
- The backend also maintains a database that mirrors relevant data from the blockchain

## Architecture

### Frontend → Smart Contract
- Direct connection through Web3 provider
- Users sign transactions in their Web3 wallet (e.g., Metamask)
- Transactions are sent directly to the blockchain

### Backend ↔ Smart Contract
- Backend can validate and interact with smart contracts using `ContractService`
- Backend maintains database records that correspond to on-chain data
- Provides API endpoints for data synchronization between blockchain and database

## Contract Service

The `ContractService` provides the following functionality:

### Creating Projects on Smart Contract
- `createProjectWithContract` endpoint creates a new smart contract via the ProjectFactory
- Automatically syncs created contract address to the database
- Validates contract creation and updates project status

### Data Synchronization
- `syncProjectWithContract` endpoint syncs data from smart contract to database
- Updates fields like total raised, investor count from on-chain data
- Keeps backend data consistent with blockchain state

### Validation
- `isValidProjectContract` verifies that a contract address corresponds to a valid CreatorProject
- Ensures only legitimate project contracts are registered in the system

## API Endpoints

### Projects
- `POST /api/projects/with-contract` - Creates new project with smart contract
- `POST /api/projects/:id/sync` - Sync project data with smart contract
- `POST /api/projects` - Register existing project contract in system

## Environment Variables
- `WEB3_PROVIDER_URL` - URL for Ethereum node (e.g., localhost:8545)
- `PROJECT_FACTORY_ADDRESS` - Address of deployed ProjectFactory contract
- `USDC_TOKEN_ADDRESS` - Address of USDC token contract
- `USDT_TOKEN_ADDRESS` - Address of USDT token contract

## Security Considerations
- All smart contract interactions are validated
- User wallet addresses are verified through authentication
- Contract addresses are validated before database storage
- Gas costs are estimated before transactions are sent

## Development
To test the integration locally:
1. Start Hardhat node: `npx hardhat node`
2. Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
3. Update `.env` with deployed contract addresses
4. Start backend: `npm run dev`
5. Use the test HTML page to verify all integrations work

## Error Handling
- Network errors are caught and reported
- Invalid contract addresses are rejected
- Transaction failures are logged for debugging
- Graceful degradation if blockchain unavailable