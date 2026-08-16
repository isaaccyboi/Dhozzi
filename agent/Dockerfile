# Build stage: needs devDependencies (typescript) to compile.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage: production dependencies and compiled output only.
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Railway injects PORT; 8080 is the fallback the server uses.
EXPOSE 8080

CMD ["npm", "start"]
