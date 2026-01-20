FROM node:18-alpine

WORKDIR /app

# Copy package files để cài thư viện trước
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Build TS sang JS
RUN npm run build

# Kiểm tra xem file có tồn tại không (dòng này để debug nếu vẫn lỗi)
RUN ls -la dist/

EXPOSE 3000

# Chạy bằng file đã build trong folder dist
CMD ["sh", "-c", "npm run migrate:up && node dist/app.js"]