# Step 1: Build the frontend
FROM node:23 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (adjust for your framework if needed)
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built files to Nginx web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Replace with custom Nginx config (optional)
COPY web.conf /etc/nginx/conf.d

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
