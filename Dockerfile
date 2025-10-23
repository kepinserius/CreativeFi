# Use Node.js 20 LTS image for better Hardhat support
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install PostgreSQL client (for health checks)
RUN apk add --no-cache postgresql-client

# Copy package files for root
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy backend package files and install dependencies
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Install contracts dependencies if they exist
WORKDIR /app
RUN npm install @openzeppelin/contracts || echo "OpenZeppelin contracts will be installed at runtime"

# Copy backend source
WORKDIR /app/backend
COPY backend/ ./

# Expose port for backend
EXPOSE 5000

# Create a script to wait for PostgreSQL
RUN echo '#!/bin/sh\nset -e\nuntil pg_isready -h postgres -p 5432; do\n  echo "Waiting for PostgreSQL to be ready..."\n  sleep 2\ndone\necho "PostgreSQL is ready!"\n\n# Start the server\nexec "$@"' > /wait-for-postgres.sh && chmod +x /wait-for-postgres.sh

# Set working directory back to root for npm scripts
WORKDIR /app

# Start the application
CMD ["/wait-for-postgres.sh", "npm", "run", "dev:backend"]