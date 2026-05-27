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

COPY --from=frontend-builder /app/dist/client /usr/share/nginx/html

RUN ENTRY_FILE=$(ls /usr/share/nginx/html/assets/entries/entry-client-routing.*.js 2>/dev/null | head -1) && \
    ENTRY_NAME=$(basename "$ENTRY_FILE") && \
    cat > /usr/share/nginx/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calendar App</title>
  <link rel="stylesheet" href="/assets/static/src_styles_globals-8da7f7cb.BLjhguyl.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/assets/entries/${ENTRY_NAME}"></script>
</body>
</html>
EOF

RUN chmod -R 755 /usr/share/nginx/html

RUN cat > /etc/nginx/http.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

EXPOSE 80

CMD ["sh", "-c", "node dist/index.js & nginx -g 'daemon off;'"]