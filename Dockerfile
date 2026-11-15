# Stage 1: Build the Vite React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency manifests and install packages
COPY package*.json ./
RUN npm install

# Copy source code and produce production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx container
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Google Cloud Run routes to port 8080 by default
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

