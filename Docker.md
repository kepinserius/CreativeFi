# Docker Setup for Content DeFi

This document explains how to use Docker to run the Content DeFi platform in different environments.

## Overview

The Content DeFi platform is containerized using Docker to ensure consistent, reproducible environments across different machines. The platform consists of multiple services:

- **PostgreSQL**: Database for storing application data
- **Hardhat Node**: Local Ethereum blockchain for development
- **Backend**: API server (Node.js/Express)
- **Frontend**: Web application (Next.js)

## Prerequisites

Before running the Docker setup, ensure you have:

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

## Quick Start (Development)

To run the full platform in development mode:

```bash
# Copy environment variables
cp .env.example .env

# Build and run all services
docker-compose up --build

# Access the services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - Blockchain: http://localhost:8545
```

## Development vs Production

### Development Environment

Use `docker-compose.dev.yml` for development:

```bash
# Build and run with development configuration
docker-compose -f docker-compose.dev.yml up --build

# Or use the default docker-compose.yml (which is configured for development)
docker-compose up --build
```

Features of development environment:
- Hot reloading for code changes
- Development build configuration
- Exposed services for debugging
- Volume mounts for real-time file updates

### Production Environment

Use `docker-compose.prod.yml` for production:

```bash
# Build and run with production configuration
docker-compose -f docker-compose.prod.yml up --build
```

Features of production environment:
- Optimized builds
- No hot reloading
- Production environment variables
- Optimized for performance and security

## Environment Variables

Create a `.env` file in the root directory with appropriate values:

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
WEB3_PROVIDER_URL=http://hardhat-node:8545  # Use service name in Docker
PROJECT_FACTORY_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Token Addresses (for testing)
USDC_TOKEN_ADDRESS=0x9999999999999999999999999999999999999999
USDT_TOKEN_ADDRESS=0x8888888888888888888888888888888888888888
```

## Service Descriptions

### PostgreSQL
- **Image**: postgres:15
- **Port**: 5432 (exposed to host)
- **Volume**: postgres_data (persistent data storage)
- **Initialization**: Runs init.sql on first start

### Hardhat Node
- **Image**: node:20-alpine
- **Port**: 8545 (exposed to host)
- **Purpose**: Local Ethereum blockchain for development
- **Command**: Runs `npx hardhat node --hostname 0.0.0.0`

### Backend
- **Port**: 5000 (exposed to host)
- **Dependencies**: Waits for PostgreSQL to be ready
- **Configuration**: Environment variables for database and blockchain connection

### Frontend
- **Port**: 3000 (exposed to host)
- **Dependencies**: Waits for backend to be ready
- **Configuration**: Connects to backend API

## Building Images

To build Docker images individually:

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

## Running in Background

To run services in the background:

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Managing Containers

```bash
# View running containers
docker ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Execute command in running container
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Make sure no other processes are using ports 3000, 5000, 5432, or 8545

2. **Database connection issues**: Verify that PostgreSQL is ready before backend tries to connect

3. **Hardhat node not starting**: Check Node.js version compatibility

### Useful Commands

```bash
# Clean up Docker resources
docker system prune -a

# Remove volumes
docker volume prune

# Check service health
docker-compose ps
```

## Customization

You can customize the Docker setup by:

1. Modifying the docker-compose files for your specific requirements
2. Adjusting environment variables in `.env`
3. Customizing Dockerfiles for specific build requirements

For production deployments, ensure to:
- Use secure passwords and secrets
- Configure SSL/TLS
- Set up proper logging and monitoring
- Use production-grade database configurations