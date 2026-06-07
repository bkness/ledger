# Ledger

A personal budget tracker built as a fullstack learning project. Track income and expenses, filter by type, and switch between 5 themes — all persisted per-user with a real authenticated session.

---

## Features

### Transactions
- **Full CRUD** — create via form, inline edit on any row, delete with confirm guard
- **Income / Expense / Balance summary cards** — react live to the active filter
- **Filter pills** — All / Income / Expense with keyboard arrow navigation (`←` / `→`), accessible `role="radiogroup"`
- **Toast notifications** — action feedback for create, update, and delete

### Themes
- 5 themes: `Light` · `Blue` · `Forest` · `Amber` · `Frost`
- Cycled via a single button in the navbar
- Persisted to `localStorage` — survives refresh and sign-out

### Authentication
- NextAuth.js v5 credentials provider with bcrypt hashing
- Stateless JWT sessions, edge-safe
- Per-user isolation — every transaction query and mutation is `userId`-scoped

### Responsive
- Mobile breakpoints on all dashboard components
- Cards, form, and transaction list all reflow at ≤640px

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | NextAuth.js v5 (beta) — credentials + JWT |
| Database | PostgreSQL (Supabase in prod, Docker locally) |
| ORM | Prisma 7 (driver adapter pattern, `PrismaPg`) |
| Runtime | React 19 / Server Actions |

---

## Architecture highlights

- **Prisma 7 driver adapter** — uses `PrismaPg` from `@prisma/adapter-pg` instead of the legacy datasource URL, with the generated client output redirected to `app/generated/prisma`.
- **Lifted filter state** — `filter` lives in `DashboardShell` alongside the server-fetched transactions list. `filteredTransactions` is a derived slice passed down as a prop — no extra fetches on filter change.
- **Server actions as props** — `signOutAction` is defined as an inline server action in `page.tsx` and passed into `DashboardShell`, keeping the client component auth-agnostic.

---

## Getting started

### Prerequisites

- Node.js 18+
- Docker + Docker Compose (for local Postgres)

### 1. Clone and install

```bash
git clone https://github.com/bkness/ledger.git
cd ledger
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Required variables:

```bash
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB
AUTH_SECRET=          # openssl rand -base64 32
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run migrations

```bash
npx prisma migrate deploy
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and start tracking.

---

## Project structure

```
ledger/
├── app/
│   ├── actions.ts              # Server Actions — create, update, delete (userId-scoped)
│   ├── api/auth/[...nextauth]/ # NextAuth route handler
│   ├── login/page.tsx          # Login / register page
│   ├── page.tsx                # Dashboard (auth-gated, server component)
│   ├── layout.tsx              # Root layout + SessionProvider
│   └── generated/prisma/       # Prisma 7 client output
├── components/
│   ├── DashboardShell.tsx      # Filter state, composes all dashboard sections
│   ├── SummaryCards.tsx        # Income / Expense / Balance cards
│   ├── TransactionForm.tsx     # Create form
│   ├── TransactionList.tsx     # List wrapper + filter pills slot
│   ├── TransactionRow.tsx      # Row with inline edit + confirm-delete
│   ├── FilterPills.tsx         # All / Income / Expense, keyboard-accessible
│   ├── ThemeSwitcher.tsx       # Cycle 5 themes, persist to localStorage
│   ├── Navbar.tsx              # Top nav with theme switcher + sign out
│   ├── Field.tsx               # Reusable labeled input
│   ├── FieldSelect.tsx         # Reusable labeled select
│   └── Toast.tsx               # Toast notification renderer
├── lib/
│   ├── auth-actions.ts         # register() server action (bcrypt)
│   ├── db.ts                   # Prisma 7 singleton (globalThis + PrismaPg adapter)
│   ├── transactions.ts         # getTransactions() — per-userId query
│   └── useToast.ts             # Toast state hook
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── auth.config.ts              # Edge-safe NextAuth config
├── auth.ts                     # Full NextAuth config (Node.js, Prisma, bcrypt)
└── prisma.config.ts            # Prisma 7 DB config
```

---

## Database schema

```prisma
model User {
  id           String        @id @default(uuid())
  name         String        @unique
  email        String        @unique
  passwordHash String?
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model Transaction {
  id        Int      @id @default(autoincrement())
  title     String
  amount    Float
  type      Type     // INCOME | EXPENSE
  category  String
  date      DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

Built by [bkness](https://github.com/bkness) · devforge ecosystem
