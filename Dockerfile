# syntax=docker/dockerfile:1

##############
# Dependencies
##############
FROM node:22-alpine AS deps
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

# Cache the pnpm store across builds via BuildKit
RUN --mount=type=cache,target=/pnpm/store pnpm config set store-dir /pnpm/store

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile

############
# Build
############
FROM node:22-alpine AS build
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV HUSKY=0
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

# NEXT_PUBLIC_* vars are inlined at build time; pass at `docker build`
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `prebuild` regenerates public/assets/og-default.png at build time
RUN pnpm build

##############
# Runtime
##############
FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# .next/standalone bundles the server + server-side node_modules;
# .next/static and public are served by the standalone server directly
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]