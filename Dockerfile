FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

FROM base AS deps

COPY server/package.json server/package-lock.json ./
RUN npm ci --ignore-scripts

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY server/package.json server/package-lock.json ./
COPY server/tsconfig.json .
COPY server/src ./src
COPY server/prisma ./prisma
COPY schema ./schema

RUN npx prisma generate

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY server/prisma ./prisma

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]