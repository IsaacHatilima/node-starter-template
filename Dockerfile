# ---------- Single-Stage Dockerfile (Robust for Prisma Testing) ----------
FROM node:20-alpine

WORKDIR /app

# 1. Copy essential configuration files first
# Assuming schema.prisma is inside 'prisma' directory
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# Copy other config files like tsconfig.json, etc. if needed for generate/runtime

# 2. Install dependencies (Prisma CLI, adapters, etc.)
RUN npm install

# 3. Copy ALL your application source code
# This step is critical and MUST happen before generate, but after install.
COPY . .

# 4. CRITICAL: Generate the Prisma Client
# This creates /app/src/generated/prisma/client.js
RUN npx prisma generate

RUN npm run build


EXPOSE 3000

# Run the entry file
CMD [ "node", "dist/server.js" ]