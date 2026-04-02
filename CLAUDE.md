# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MERN e-commerce website with a React/TypeScript frontend (`client/`) and Express/TypeScript backend (`server/`). Payments are handled via ECPay (Taiwan payment gateway). Images are stored in Cloudinary.

## Development Commands

### Client (from `client/`)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run lint:fix     # ESLint auto-fix
npm run format:fix   # Prettier auto-format
npm run typecheck    # TypeScript type check (no emit)
npm run test         # Run tests in watch mode (Vitest)
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report
```

### Server (from `server/`)
```bash
npm run dev    # tsx watch (hot reload)
npm run build  # tsc compile to dist/
npm run start  # Run compiled dist/server.js
```

### Running a single test
```bash
# From client/
npx vitest run src/components/molecules/Modal/__tests__/Modal.test.tsx
```

## Architecture

### Monorepo structure
- `client/` — React 19, TypeScript, Vite, Tailwind v4 + DaisyUI, RTK Query
- `server/` — Express 5, TypeScript, Mongoose, compiled to `dist/`
- Both are deployed to Vercel separately (`client/vercel.json` configures SPA routing)

### Client state management
State lives in two layers:
1. **RTK Query (`apiSlice`)** — all server data (products, orders, cart, news, coupons). Single `createApi` definition in `src/store/slices/apiSlice.ts` with all endpoints. Uses a mutex-protected `baseQueryWithReauth` that automatically refreshes the access token on `401 TOKEN_EXPIRED` responses.
2. **Redux slices** — `authSlice` (user/tokens), `guestCartSlice` (unauthenticated cart backed by `localStorage`).

**Listener middleware** handles side-effects declaratively:
- `authListenerMiddleware` — syncs auth tokens/user to `localStorage` on `setCredentials`/`clearCredentials`/`setAccessToken`
- `cartListenerMiddleware` — syncs guest cart to `localStorage`; on login (`setCredentials`), calls `syncCart` API then clears local cart; on logout, clears local cart

### Auth flow
- JWT access tokens (short-lived) + refresh tokens (stored in `localStorage` + MongoDB on user record)
- Access token sent as `Authorization: Bearer <token>` header
- Token refresh is automatic via mutex in `apiSlice`; manual refresh endpoint: `POST /api/user/refresh-token`
- Server middleware: `authMiddleware` (verifies JWT, attaches `req.userId` / `req.role`), `isAdmin` (checks `req.role === "admin"`)

### Cart: dual-mode
- **Guests**: Redux `guestCartSlice` + `localStorage`
- **Authenticated**: RTK Query `getCart` / mutations hitting `/api/cart`
- On login, guest items are synced to server via `POST /api/cart/sync` then cleared locally
- Cart mutations use optimistic updates (`onQueryStarted`) and roll back on error

### Client path alias
`@/` resolves to `client/src/`. Use this for all internal imports.

### Component structure
- `src/components/atoms/` — primitive UI elements
- `src/components/molecules/` — composite components
- `src/components/organisms/` — full sections/features
- `src/layouts/AppLayout/` — root layout wrapping all routes
- `src/pages/<name>/` — page components, co-located with route segments (e.g. `pages/products/[id]`)
- `src/routes/` — router config, `PrivateRoute`, `AdminRoute` guards

### Server structure
- `src/app.ts` — Express app setup (CORS, routes, error handler)
- `src/server.ts` — HTTP listener entry point
- `src/routes/*.route.ts` → `src/controllers/*.controller.ts` → `src/models/*.model.ts`
- `src/middlewares/auth.middleware.ts` — JWT verification
- `src/middlewares/error.middleware.ts` — global error handler

### API base URLs
- Client reads `VITE_API_URL` env var (falls back to `/api`)
- Server uses `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CLOUDINARY_*`, `NODEMAILER_*`, ECPay vars

### Products pagination
`getProducts` uses a custom RTK Query `merge` strategy: results accumulate across pages using the same cache key (page excluded from `serializeQueryArgs`). Page 1 or undefined resets the cache; subsequent pages append non-duplicate items.

### Global alerts
`AlertContext` (`src/context/AlertContext.tsx`) provides `showAlert`. Can also be triggered from outside React via `window.dispatchEvent(new CustomEvent("app:alert", { detail: { variant, message } }))` — used by `cartListenerMiddleware`.

## TypeScript notes
- Client: `strict: false`, `moduleResolution: "Bundler"`
- Server: separate `tsconfig.json`, compiled with `tsc`, uses `tsconfig-paths` for path resolution
- Server types for `req.userId` and `req.role` are augmented on the Express `Request` interface (check `src/types/`)
