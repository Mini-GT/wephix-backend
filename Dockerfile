FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/package.json

# Install all workspace dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source
COPY . .

RUN pnpm build --filter=backend...

EXPOSE 3000
CMD ["node", "apps/backend/dist/main.js"]