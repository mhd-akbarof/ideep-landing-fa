FROM node:22-alpine

WORKDIR /app

COPY . /app/public
COPY server.mjs /app/server.mjs

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["node", "/app/server.mjs"]
