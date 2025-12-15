FROM node:20-alpine AS base
RUN corepack enable pnpm

FROM base AS dependencies
WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Copy packages (needed for @repo/types during build)
COPY packages ./packages

# Install ALL workspace dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app/apps/backend

# Copy installed node_modules from root
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./node_modules

# Copy packages (needed for TypeScript compilation)
COPY --from=dependencies /app/packages /app/packages

# Copy backend source
COPY apps/backend/package.json ./package.json
COPY apps/backend/tsconfig*.json ./
COPY apps/backend/nest-cli.json ./
COPY apps/backend/src ./src
COPY apps/backend/prisma ./prisma

# Generate Prisma Client
RUN pnpm pgen

# Build (types are compiled away here)
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy ALL node_modules from builder (includes generated Prisma client)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy built application
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3000

CMD ["node", "apps/backend/dist/main.js"]