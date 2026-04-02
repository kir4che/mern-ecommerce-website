# MERN 電商網站

一個以 React + Express 打造的全端電商平台，支援商品瀏覽、購物車、優惠券、ECPay 金流與後台管理。

## 功能特色

- **商品管理**：依分類、標籤、關鍵字搜尋，支援無限捲動分頁
- **購物車**：訪客使用 localStorage，登入後自動同步至伺服器
- **優惠券**：支援百分比折扣與固定金額折扣，可設定最低消費與有效期限
- **金流整合**：串接 ECPay 全方位金流（台灣）
- **JWT 驗證**：Access Token + Refresh Token，Token 過期時自動刷新
- **後台管理**：管理員可操作商品、訂單、最新消息、優惠券
- **圖片上傳**：透過 Cloudinary 儲存商品與最新消息圖片
- **Email 通知**：使用 Nodemailer 發送密碼重設信件

## 技術架構

| 端 | 技術 |
|---|---|
| 前端 | React 19、TypeScript、Vite、Tailwind CSS v4、DaisyUI、RTK Query |
| 後端 | Express 5、TypeScript、Mongoose（MongoDB） |
| 部署 | Vercel（前後端分開部署） |

## 專案結構

```
mern-ecommerce-website/
├── client/     # React 前端
└── server/     # Express 後端
```

## 快速開始

### 環境需求

- Node.js 18+
- MongoDB（本地或 MongoDB Atlas）
- Cloudinary 帳號
- ECPay 測試帳號（金流）
- SMTP 服務（Email 通知）

### 後端設定

```sh
cd server
npm install
```

在 `server/` 建立 `.env`：

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/mern-ecommerce
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODEMAILER_USER=your_email@gmail.com
NODEMAILER_PASS=your_app_password

# ECPay 相關設定（依 ecpay_aio_nodejs 文件填入）
ECPAY_MERCHANT_ID=...
ECPAY_HASH_KEY=...
ECPAY_HASH_IV=...
```

```sh
npm run dev     # 開發模式（熱重載）
npm run build   # 編譯至 dist/
npm start       # 執行 dist/server.js
```

### 前端設定

```sh
cd client
npm install
```

在 `client/` 建立 `.env.local`：

```env
VITE_API_URL=http://localhost:8080/api
```

```sh
npm run dev          # 啟動 Vite 開發伺服器
npm run build        # 打包
npm run typecheck    # TypeScript 型別檢查
npm run lint:fix     # ESLint 自動修正
npm run format:fix   # Prettier 格式化
```

## 測試

```sh
# 前端（從 client/）
npm run test          # 監聽模式
npm run test:coverage # 覆蓋率報告

# 執行單一測試
npx vitest run src/components/molecules/Modal/__tests__/Modal.test.tsx
```

## API 路由

| 路徑 | 說明 |
|---|---|
| `POST /api/user/register` | 使用者註冊 |
| `POST /api/user/login` | 登入，回傳 JWT |
| `POST /api/user/refresh-token` | 刷新 Access Token |
| `POST /api/user/reset-password` | 寄送密碼重設信 |
| `GET /api/products` | 取得商品列表（支援分頁、篩選） |
| `GET /api/products/:id` | 取得單一商品 |
| `GET /api/news` | 取得最新消息 |
| `GET /api/cart` | 取得購物車（需登入） |
| `POST /api/cart/sync` | 登入後同步訪客購物車 |
| `GET /api/orders` | 取得使用者訂單 |
| `GET /api/orders/all` | 取得所有訂單（管理員） |
| `POST /api/payment` | 建立 ECPay 付款 |
| `POST /api/coupons/validate` | 驗證優惠券 |

## 部署

前後端皆部署至 Vercel。前端 `vercel.json` 已設定 SPA routing rewrite；後端以 `dist/server.js` 作為進入點。
