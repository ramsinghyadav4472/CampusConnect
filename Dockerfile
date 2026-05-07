# Stage 1: Build the React Application
# Using node:20-alpine for a lightweight, secure build environment compatible with Vite
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This ensures npm install only runs when dependencies actually change
COPY package*.json ./

# Clean install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the optimized production bundle using Vite
RUN npm run build

# Stage 2: Serve the application with NGINX
# Using nginx:alpine for a minimal and fast web server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the React build artifacts from the build stage to NGINX serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Add a simple custom NGINX configuration for React Router (Single Page Application)
# This prevents 404 errors when refreshing routes
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://backend:5000/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade \$http_upgrade; \
        proxy_set_header Connection 'upgrade'; \
        proxy_set_header Host \$host; \
        proxy_cache_bypass \$http_upgrade; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Expose port 80 for the frontend
EXPOSE 80

# Start NGINX and keep the process running in the foreground
CMD ["nginx", "-g", "daemon off;"]
