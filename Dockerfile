# Dockerfile
# Stage 1: Build the Vue.js app
FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static files with a lightweight HTTP server
FROM node:20 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist /app
RUN npm install -g http-server

EXPOSE 80
CMD ["http-server", "-g", "daemon", "-p", "80"]
