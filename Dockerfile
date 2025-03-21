# Stage 1: Build
FROM node:18-alpine AS builder

# Cài đặt OpenSSL và các thư viện cần thiết
RUN apk add --no-cache openssl libc6-compat

# Set thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json trước để tận dụng cache layer
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies cho Prisma)
RUN npm install

# Copy Prisma schema và tạo Prisma Client
COPY src/infrastructure/database/prisma ./src/infrastructure/database/prisma
RUN npx prisma generate --schema=./src/infrastructure/database/prisma/schema.prisma

# Copy toàn bộ mã nguồn
COPY . .

# Biên dịch ứng dụng NestJS
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Cài đặt OpenSSL trong production image
RUN apk add --no-cache openssl libc6-compat

# Set thư mục làm việc
WORKDIR /app

# Copy file package.json để cài đặt dependencies production-only
COPY package*.json ./
RUN npm install --production

# Copy mã nguồn đã build và Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy file môi trường nếu cần
# COPY .env ./.env

# Mở cổng ứng dụng
EXPOSE 3001

# Tự động chạy migration khi container khởi động
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
