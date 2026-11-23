FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Public build-time values (the landing makes no API calls).
ARG PUBLIC_APP_URL=https://dashboard.ideep.ir
ARG SITE_URL=https://ideep.ir
ENV PUBLIC_APP_URL=$PUBLIC_APP_URL SITE_URL=$SITE_URL
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
