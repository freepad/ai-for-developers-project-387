FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl nginx

FROM base AS backend-deps

COPY server/package.json server/package-lock.json ./
RUN npm ci --ignore-scripts

FROM base AS backend-builder

COPY --from=backend-deps /app/node_modules ./node_modules
COPY server/package.json server/package-lock.json ./
COPY server/tsconfig.json .
COPY server/src ./src
COPY server/prisma ./prisma
COPY schema ./schema

RUN npx prisma generate
RUN npm run build

FROM base AS frontend-deps

COPY web/package.json web/package-lock.json ./
RUN npm ci --ignore-scripts

FROM base AS frontend-builder

COPY --from=frontend-deps /app/node_modules ./node_modules
COPY web ./

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
ENV PORT=3000

COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/schema /schema
COPY --from=backend-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY server/prisma ./prisma

COPY --from=frontend-builder /app/dist /web-dist
COPY --from=frontend-deps /app/node_modules ./web-node-modules

ENV NODE_PATH=/app/web-node-modules

COPY ssr-server.mjs ./

RUN printf 'server {\n    listen 80;\n    server_name _;\n\n    location /api/ {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection '"'"'upgrade'"'"';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n\n    location / {\n        proxy_pass http://localhost:3001;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection '"'"'upgrade'"'"';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}\n' > /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "node dist/index.js & node ssr-server.mjs & nginx -g 'daemon off;'"]