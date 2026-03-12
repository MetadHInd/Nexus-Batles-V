# Multi-stage build for production optimization
FROM node:22.14-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Install necessary packages including Chromium for Puppeteer
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Build arguments for npm authentication
ARG NPM_USER
ARG NPM_PASS

# Copy package files and npm configuration
COPY package.json package-lock.json* ./
COPY .npmrc ./

# Configure npm authentication for private registry
RUN if [ -n "$NPM_USER" ] && [ -n "$NPM_PASS" ]; then \
        echo "//agents.askaia.ai/:username=${NPM_USER}" >> ~/.npmrc && \
        echo "//agents.askaia.ai/:_password=$(echo -n ${NPM_PASS} | base64)" >> ~/.npmrc && \
        echo "//agents.askaia.ai/:email=noreply@askaia.ai" >> ~/.npmrc; \
    fi

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Clear npm credentials after installation
RUN rm -f ~/.npmrc

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install build dependencies including Chromium
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Build arguments for npm authentication (needed again)
ARG NPM_USER
ARG NPM_PASS

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configure npm authentication again for dev dependencies
RUN if [ -n "$NPM_USER" ] && [ -n "$NPM_PASS" ]; then \
        echo "//agents.askaia.ai/:username=${NPM_USER}" >> ~/.npmrc && \
        echo "//agents.askaia.ai/:_password=$(echo -n ${NPM_PASS} | base64)" >> ~/.npmrc && \
        echo "//agents.askaia.ai/:email=noreply@askaia.ai" >> ~/.npmrc; \
    fi

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Create missing directories only if they don't exist
RUN mkdir -p /app/uploads /app/templates

# Clear npm credentials again
RUN rm -f ~/.npmrc

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Install runtime dependencies including Chromium for Puppeteer
RUN apk add --no-cache \
    openssl \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files (necessary for runtime)
COPY --from=builder /app/prisma ./prisma

# Copy Google Cloud credentials
COPY --from=builder /app/credentials ./credentials

# Copy static files directories directly from source
COPY public ./public

# Create additional directories that might be needed
RUN mkdir -p /app/logs /app/uploads /app/templates

# Set permissions
RUN chown -R nestjs:nodejs /app && \
    chmod -R 755 /app

# Switch to non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Puppeteer configuration for Alpine Linux
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/bin/chromium-browser

# Health check for container health monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

# Start the application (cloud version uses dist/main directly)
CMD ["npm", "run", "start:cloud"]