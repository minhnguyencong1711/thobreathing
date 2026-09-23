# Thở — Cùng vượt qua Burnout học đường 🌤️

**Thở** là website hỗ trợ học sinh THPT nhận diện và giảm tải áp lực học tập, xây dựng thói quen học tập cân bằng và chăm sóc sức khỏe tinh thần.

---

## 🛠️ Bộ Techstack Fullstack

- **Frontend (`/client`)**: React 18 + Vite + TypeScript + TailwindCSS + Lottie Animations + Sonner Toast + Lucide Icons.
- **Backend (`/server`)**: NestJS 10 + TypeScript + Mongoose (MongoDB Atlas) + `@nestjs/throttler` (Rate Limiter chống DDoS) + `@nestjs/serve-static` + Helmet.
- **Cơ sở dữ liệu**: MongoDB Atlas (Lưu trữ và tổng hợp số liệu khảo sát học sinh thực tế qua Aggregation Pipeline).
- **Cơ chế người dùng**: **Không cần đăng nhập (No-auth)** — học sinh chỉ cần nhập Họ tên/Biệt danh và Năm sinh khi làm khảo sát để tạo phiên ghi nhận.

---

## 📁 Cấu trúc Monorepo

```text
thobreathing/
├── client/                     # Frontend React (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Hero, Quiz, LiveStats, Timer, RelaxSpots...
│   │   ├── services/api.ts     # Axios kết nối NestJS API
│   │   ├── types/              # Định nghĩa TypeScript
│   │   ├── App.tsx             # Single Page Application
│   │   └── main.tsx
│   ├── tailwind.config.js      # Palette: Vibrant Pink, Royal Blue, Dusty Pink...
│   └── package.json
├── server/                     # Backend NestJS
│   ├── src/
│   │   ├── surveys/            # Module Survey (Schema, DTO, Service, Controller)
│   │   ├── app.module.ts       # MongoDB Atlas, Throttler, ServeStatic
│   │   └── main.ts             # Helmet, CORS, Global prefix /api
│   ├── .env.example            # Mẫu cấu hình MONGODB_URI
│   └── package.json
├── package.json                # Điều phối cài đặt và build monorepo
└── README.md
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy dưới Local

### 1. Cài đặt Dependencies
Mở terminal tại thư mục gốc `thobreathing`:
```bash
npm run install:all
```
*(Lệnh trên sẽ tự động cài `node_modules` cho cả server và client).*

### 2. Cấu hình MongoDB Atlas
1. Tạo một Database miễn phí trên [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Tạo file `.env` bên trong thư mục `server/` (sao chép từ `.env.example`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/thobreathing?retryWrites=true&w=majority
PORT=3000
```

### 3. Chạy môi trường Phát triển (Development)
- **Mở Terminal 1 (Backend NestJS):**
  ```bash
  npm run start:server
  ```
  *(Server chạy tại `http://localhost:3000`, API tại `http://localhost:3000/api`)*.

- **Mở Terminal 2 (Frontend React):**
  ```bash
  npm run start:client
  ```
  *(Giao diện mở tại `http://localhost:5173`, tự động proxy gọi API sang port 3000)*.

---

## 🌐 Hướng dẫn Deploy lên Production (Phương án B - All-in-One)

Vì project sử dụng `@nestjs/serve-static`, khi build toàn bộ:
1. `npm run build:client` sẽ biên dịch React thành thư mục `client/dist`.
2. NestJS sẽ phục vụ toàn bộ giao diện tĩnh từ `client/dist` tại trang chủ `/` và cung cấp API tại `/api/*`.
3. Chỉ cần **1 Service duy nhất** trên Render / Railway / Koyeb.

### Các bước deploy lên Render.com (Miễn phí 100%):
1. Đẩy code lên GitHub repository của bạn.
2. Đăng nhập vào [Render.com](https://render.com) $\rightarrow$ Chọn **New Web Service** $\rightarrow$ Kết nối repo GitHub của bạn.
3. Cấu hình Web Service:
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm start`
4. Trong mục **Environment Variables**, thêm biến:
   - `MONGODB_URI`: *Dán chuỗi kết nối MongoDB Atlas của bạn vào.*
   - `PORT`: `3000` (hoặc để Render tự cấp).
5. Bấm **Create Web Service** $\rightarrow$ Render sẽ tự động build và cung cấp cho bạn 1 đường link duy nhất (ví dụ: `https://thobreathing.onrender.com`).

---

## 🛡️ Tính năng An toàn & Tối ưu

- **Chống DDoS & Spam API:** Cấu hình `@nestjs/throttler` giới hạn 60 req/phút cho toàn hệ thống và tối đa 5 lần nộp bài/phút cho mỗi IP tại endpoint khảo sát.
- **Bảo mật HTTP:** Tích hợp `helmet` bảo vệ các HTTP headers.
- **Toast UI mượt mà:** Sử dụng thư viện `sonner` cao cấp, thay thế hoàn toàn các popup `alert()` gây gián đoạn trải nghiệm người dùng.
- **Hiệu ứng trực quan:** Áp dụng hệ thống đốm sáng nhịp thở mờ ảo (*Ambient Breathing Glow Orbs*) giúp xua tan khoảng trống và tạo cảm giác thư giãn cho học sinh.
