FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* npm-shrinkwrap.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Railway sets PORT env var, but we default to 8080)
EXPOSE 8080

# Start the API server
CMD ["npm", "start"]
