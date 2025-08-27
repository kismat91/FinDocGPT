# 🚀 TradePro Platform - Docker Configuration
# Multi-stage build for optimal production and development

# =============================================================================
# 📦 BASE IMAGE
# =============================================================================
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# =============================================================================
# 🔧 DEVELOPMENT STAGE
# =============================================================================
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start development server
CMD ["npm", "run", "dev"]

# =============================================================================
# 🧪 TESTING STAGE
# =============================================================================
FROM base AS testing

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Set testing environment
ENV NODE_ENV=test
ENV NEXT_TELEMETRY_DISABLED=1

# Run tests
CMD ["npm", "test"]

# =============================================================================
# 🏗️ BUILD STAGE
# =============================================================================
FROM base AS builder

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# =============================================================================
# 🚀 PRODUCTION STAGE
# =============================================================================
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose production port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start production server
CMD ["node", "server.js"]

# =============================================================================
# 🔍 LINTING STAGE
# =============================================================================
FROM base AS linting

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Set linting environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Run linting
CMD ["npm", "run", "lint"]

# =============================================================================
# 📊 ANALYZE STAGE
# =============================================================================
FROM base AS analyze

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Set analyze environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run bundle analysis
CMD ["npm", "run", "analyze"]

# =============================================================================
# 🐳 DOCKER COMPOSE OVERRIDE
# =============================================================================
# This file can be used with docker-compose.override.yml for development
# Example:
# version: '3.8'
# services:
#   app:
#     build:
#       context: .
#       target: development
#     volumes:
#       - .:/app
#       - /app/node_modules
#     environment:
#       - NODE_ENV=development
#     ports:
#       - "3000:3000"
#     command: npm run dev
