# Use a lightweight Node.js 20 image based on Alpine Linux for production
FROM node:20-alpine

# Create and set the application working directory
WORKDIR /usr/src/app

# Copy package files first to utilize Docker layer caching
COPY package*.json ./

# Install only production dependencies for a smaller, more secure image footprint
RUN npm ci --only=production

# Copy the remaining application source code
COPY . .

# Ensure the app runs as a non-root user for security best practices
USER node

# Expose the API port
EXPOSE 5000

# Start the Node.js application
CMD ["npm", "start"]
