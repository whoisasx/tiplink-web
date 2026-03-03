# tiplink-web

React + TypeScript frontend for TipLink — a Solana-powered payment link platform. Users sign in with Google, manage a custodial MPC wallet, send tokens, swap via Jupiter, and create or claim shareable one-time payment links.

---

## Tech Stack

| Category        | Library / Version                             |
| --------------- | --------------------------------------------- |
| Framework       | React 19                                      |
| Language        | TypeScript 5.9                                |
| Build tool      | Vite 7                                        |
| Styling         | Tailwind CSS v4                               |
| UI primitives   | Radix UI                                      |
| Icons           | Lucide React                                  |
| Routing         | React Router v7                               |
| Data fetching   | TanStack Query v5                             |
| Global state    | Zustand v5                                    |
| Forms           | React Hook Form + Zod                         |
| Solana          | `@solana/wallet-adapter-*`, `@solana/web3.js` |
| HTTP client     | Axios                                         |
| Notifications   | Sonner                                        |
| QR codes        | qrcode.react                                  |
| Date formatting | date-fns                                      |

---

## Features

- **Google OAuth login** — one-click sign-in, JWT stored in a secure cookie
- **Custodial wallet dashboard** — view SOL + SPL token balances
- **Send tokens** — transfer SOL or any SPL token to an arbitrary Solana address
- **Token swaps** — get quotes and execute swaps through the Jupiter Aggregator
- **Payment links** — create shareable one-time links for any amount/token; cancel or track status
- **Claim page** — fully public page at `/claim/:token` that lets anyone claim a payment link to their connected wallet (Solana Wallet Adapter)
- **Transaction history** — paginated list of past transfers and swaps
- **Profile** — view and edit display name / avatar

---

## Pages & Routes

| Path             | Auth      | Component          | Description                              |
| ---------------- | --------- | ------------------ | ---------------------------------------- |
| `/`              | Public    | `LandingPage`      | Marketing / hero page                    |
| `/login`         | Public    | `LoginPage`        | Google OAuth entry point                 |
| `/auth/callback` | Public    | `AuthCallbackPage` | Handles OAuth redirect                   |
| `/claim/:token`  | Public    | `ClaimPage`        | Claim a payment link                     |
| `/dashboard`     | Protected | `DashboardPage`    | Overview of balances + recent activity   |
| `/wallet`        | Protected | `WalletPage`       | Full wallet with balances, send, history |
| `/links`         | Protected | `LinksPage`        | List of all created payment links        |
| `/links/create`  | Protected | `CreateLinkPage`   | Form to create a new payment link        |
| `/links/:token`  | Protected | `LinkDetailPage`   | Details + QR code for a specific link    |
| `/swap`          | Protected | `SwapPage`         | Token swap interface (Jupiter)           |
| `/profile`       | Protected | `ProfilePage`      | User settings                            |
| `*`              | Public    | `NotFoundPage`     | 404 fallback                             |

---

## Project Structure

```
tiplink-web/
├── index.html
├── vite.config.ts
├── tsconfig*.json
├── eslint.config.js
├── package.json
│
└── src/
    ├── main.tsx                # App entry point, provider tree
    ├── App.tsx                 # Router definition
    ├── App.css / index.css     # Global styles + Tailwind base
    │
    ├── api/                    # Axios API layer
    │   ├── client.ts           # Axios instance (base URL, interceptors)
    │   ├── auth.ts             # /api/auth/* calls
    │   ├── user.ts             # /api/user/* calls
    │   ├── wallet.ts           # /api/wallet/* calls
    │   ├── swap.ts             # /api/swap/* calls
    │   └── link.ts             # /api/link/* calls
    │
    ├── hooks/                  # TanStack Query hooks (data + mutations)
    │   ├── useUser.ts
    │   ├── useBalances.ts
    │   ├── useTransactions.ts
    │   ├── useSwap.ts
    │   ├── useLinks.ts
    │   └── useCreateLink.ts
    │
    ├── store/
    │   └── auth.store.ts       # Zustand auth slice (user, token, status)
    │
    ├── types/                  # Shared TypeScript interfaces
    │   ├── auth.ts
    │   ├── user.ts
    │   ├── wallet.ts
    │   ├── swap.ts
    │   └── link.ts
    │
    ├── lib/
    │   ├── utils.ts            # cn() + general helpers
    │   ├── validators.ts       # Zod schemas (forms)
    │   └── cookies.ts          # Cookie read/write helpers
    │
    ├── providers/
    │   ├── AuthBootstrap.tsx   # Rehydrates auth state on mount
    │   └── SolanaProviders.tsx # Wallet Adapter + Connection providers
    │
    ├── components/
    │   ├── auth/
    │   │   └── ProtectedRoute.tsx        # Redirects unauthenticated users
    │   ├── layout/
    │   │   ├── AppLayout.tsx             # Shell with sidebar + topbar
    │   │   ├── Sidebar.tsx               # Navigation links
    │   │   └── TopBar.tsx                # User avatar + actions
    │   ├── wallet/
    │   │   └── WalletAdapterButton.tsx   # Solana wallet connect button
    │   └── common/
    │       ├── AddressDisplay.tsx        # Truncated pubkey + copy
    │       ├── CopyButton.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorState.tsx
    │       ├── LoadingSpinner.tsx
    │       ├── Pagination.tsx
    │       ├── SendModal.tsx             # Transfer dialog
    │       ├── StatusBadge.tsx           # Link status chip
    │       ├── TokenIcon.tsx
    │       ├── WalletAddressModal.tsx    # QR + address modal
    │       └── ComingSoonBanner.tsx
    │
    └── pages/
        ├── LandingPage.tsx
        ├── LoginPage.tsx
        ├── AuthCallbackPage.tsx
        ├── DashboardPage.tsx
        ├── WalletPage.tsx
        ├── LinksPage.tsx
        ├── CreateLinkPage.tsx
        ├── LinkDetailPage.tsx
        ├── SwapPage.tsx
        ├── ProfilePage.tsx
        ├── ClaimPage.tsx
        └── NotFoundPage.tsx
```

---

## Prerequisites

| Tool              | Version    |
| ----------------- | ---------- |
| Node.js           | 18+        |
| npm / pnpm / yarn | any recent |

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```dotenv
# Full URL of the running tiplink-server backend
VITE_API_URL=http://localhost:3000

# Public URL of this frontend (used for shareable link generation)
VITE_APP_URL=http://localhost:5173

# Solana RPC endpoint (use devnet for development)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

> All variables must be prefixed with `VITE_` to be accessible in browser code.

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> Make sure `tiplink-server` (backend + MPC) is running and `VITE_API_URL` points to it.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static host or `npm run preview` for a local preview.

### Lint

```bash
npm run lint
```

---

## Data Flow

```
Page / Component
      │
      ▼
  Custom Hook          (hooks/use*.ts  — TanStack Query)
      │
      ▼
  API Function         (api/*.ts  — Axios)
      │
      ▼
  tiplink-server       (REST API over HTTP)
```

- **Read operations** use `useQuery` with automatic background refetching.
- **Write operations** (send, swap, create link, …) use `useMutation` with optimistic caching / cache invalidation.
- **Auth state** (user object, loading flag) lives in Zustand (`auth.store.ts`) and is rehydrated on app startup by `AuthBootstrap`.

---

## Authentication Flow

```
User clicks "Sign in with Google"
        │
        ▼
GET /api/auth/google  →  redirect to Google consent
        │
Google redirects back to /auth/callback?code=…
        │
        ▼
AuthCallbackPage calls GET /api/auth/callback/google
        │
Backend issues JWT access token (cookie) + refresh token (cookie)
        │
        ▼
AuthBootstrap reads the JWT cookie, populates Zustand store
        │
        ▼
ProtectedRoute allows access to authenticated pages
```

Token refresh is handled transparently by the Axios response interceptor in `api/client.ts` — on a `401` it calls `POST /api/auth/refresh` and retries the original request.

---

## Payment Link Flow (Frontend)

```
CreateLinkPage
  └─ fill amount, token, note, expiry
  └─ POST /api/link/create
  └─ navigate to /links/:token

LinkDetailPage
  └─ display QR code + shareable URL
  └─ copy link → share with recipient

ClaimPage  (public, /claim/:token)
  └─ connect Solana wallet (Wallet Adapter)
  └─ POST /api/link/:token/claim  { claimer_wallet }
  └─ funds arrive in connected wallet
```

---

## Solana Wallet Adapter

The `SolanaProviders` wrapper registers the standard wallet adapters (Phantom, Solflare, Backpack, etc.) and provides the `ConnectionProvider` pointed at `VITE_SOLANA_RPC_URL`. It is only needed on the public `ClaimPage` — the custodial wallet for authenticated users is managed server-side via the MPC service.
