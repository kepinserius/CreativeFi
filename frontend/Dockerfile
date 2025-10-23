# Use Node.js 18 LTS image for building
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application
COPY . .

# Expose port for frontend
EXPOSE 3000

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]