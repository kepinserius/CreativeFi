# Use Node.js 20 LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for backend
EXPOSE 5000

# Install PostgreSQL client (for health checks)
RUN apk add --no-cache postgresql-client

# Create a script to wait for PostgreSQL
RUN echo '#!/bin/sh\nset -e\nuntil pg_isready -h postgres -p 5432; do\n  echo "Waiting for PostgreSQL to be ready..."\n  sleep 2\ndone\necho "PostgreSQL is ready!"\n\n# Start the server\nexec "$@"' > /wait-for-postgres.sh && chmod +x /wait-for-postgres.sh

# Start the application
CMD ["/wait-for-postgres.sh", "npm", "run", "dev"]