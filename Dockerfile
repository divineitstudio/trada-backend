# Use official Node.js LTS slim runtime
FROM node:20-slim

# Install OpenSSL (required for Prisma engines)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and prisma directory first for efficient Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (ignoring scripts where appropriate, generating prisma)
RUN npm install

# Generate Prisma Client for Linux inside the container
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose port matching docker-compose expose (3000)
EXPOSE 3000

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Start server
CMD ["npm", "start"]

