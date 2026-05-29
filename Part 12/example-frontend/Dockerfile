# STAGE 1: Build the static assets
FROM node:16-alpine AS build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_URL
RUN npm run build

# STAGE 2: Deploy assets to an unprivileged production web server
FROM nginxinc/nginx-unprivileged:1.21-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html