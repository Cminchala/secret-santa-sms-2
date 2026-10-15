# Build and run the Next.js app inside Docker.
# Place this file at frontend/secret-santa/Dockerfile.
FROM node:22-alpine

WORKDIR /app

# Install dependencies from the app's lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the application source. Sensitive .env files should be excluded by .dockerignore.
COPY . .

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Build happens inside the image; no host-side dist directory is needed.
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
