# Dockerfile for backend

FROM node:18-alpine
WORKDIR /app

# COPY package.json yarn.lock ./
COPY package*.json ./

# RUN yarn install --frozen-lockfile
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
