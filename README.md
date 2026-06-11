<div align="center">

<img src="public/pennyplan.svg" alt="PennyPlan Logo" width="72" height="72" />

# PennyPlan

**Take control of your financial future — one penny at a time.**

A full-stack personal finance dashboard that combines smart budgeting, multi-source income tracking, and AI-powered financial insights into a single, beautifully designed interface.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=flat-square&logo=postgresql&logoColor=black)](https://orm.drizzle.team)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com)
[![OpenAI](https://img.shields.io/badge/AI-GPT--4o_mini-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

<br />

[Live Demo](#) · [Report Bug](https://github.com/your-username/pennyplan/issues) · [Request Feature](https://github.com/your-username/pennyplan/issues)

</div>

---

## Overview

PennyPlan is a production-ready personal finance application built for individuals who want a clear, real-time picture of their financial health. It replaces the chaos of spreadsheets and scattered banking apps with a single dashboard: create budgets, log expenses against them, track multiple income streams, and receive AI-generated advice tailored to your actual numbers — all without writing a line of configuration.

**The problem it solves:** Most people either do not budget at all or abandon budgeting tools that are too complex. PennyPlan sits in the sweet spot — it is simple enough to set up in two minutes but intelligent enough to surface insights a spreadsheet never could.

**Who it is for:**
- Freelancers and creators managing irregular, multi-source income
- Professionals who want to see exactly how their spending compares to their planned budget
- Anyone tired of budgeting apps that obscure their data behind subscription paywalls

---

## Features

### Core Budgeting
- **Create budgets** with a custom name, spending limit, and emoji icon — because financial management should not be boring
- **Real-time progress bars** per budget that change colour from green → amber → red as you approach the limit (60% / 80% thresholds)
- **Per-budget expense detail page** showing every transaction logged against that budget, total spent, and remaining balance
- **Edit and delete budgets**, cascading deletion of child expenses to keep data consistent

### Expense Tracking
- Log individual expenses under any budget with a name, amount, and automatic timestamp
- **Unified expenses view** — browse all transactions across every budget on a single searchable table
- Expenses are user-scoped: you only ever see your own data

### Income Management
- Add multiple income sources (salary, freelance, rental, etc.) with custom emoji icons
- Aggregate totals computed at the database level with a SQL `SUM` so figures are always accurate
- Delete income sources cleanly without affecting budget or expense records

### AI Financial Insights
- The dashboard header card surfaces a **GPT-4o-mini powered financial insight** automatically each time your figures change
- Advice is generated from real numbers — your total budget, total income, and total spend — not a generic template
- Requests are **debounced (800 ms)** to prevent redundant API calls when data loads in parallel
- A ref-based guard prevents duplicate fetches within the same session; advice refreshes only when your financial data actually changes

### Data Visualisation
- **Spending Overview bar chart** (Recharts) overlays budget allocation vs. actual spend across all your budgets side by side
- Animated skeleton loaders fill the chart and stat cards while data fetches, keeping the UI feeling instant

### Dashboard Overview
- Four summary stat cards: **Total Budget**, **Total Spent**, **Budget Count**, **Total Income**
- Time-aware greeting ("Good morning / afternoon / evening, Ahmad") personalised with the Clerk user profile
- Recent budgets panel alongside the latest expense table in a responsive 3-column grid

### Authentication & Security
- **Clerk** manages sign-up, sign-in, and session management — zero custom auth code
- `middleware.ts` enforces protection on every non-public route at the edge
- Every server action re-validates `userId` from Clerk independently, so there is no trust chain from the client
- Ownership checks on every mutation: you cannot edit or delete another user's budget even with a crafted request
- Environment variables that must remain server-side (`DATABASE_URL`, `OPENAI_API_KEY`) are never prefixed with `NEXT_PUBLIC_`

### Developer Experience
- Full **TypeScript** across the entire codebase with strict types for DB entities and component props
- **Zod schemas** validate all form input at the component boundary and again inside server actions — one schema, two validation passes
- **TanStack Query** wraps all server actions: automatic cache invalidation, background refetch, loading/error state, and toast notifications with zero boilerplate
- **Drizzle Studio** (`npm run db:studio`) gives a GUI view of your Neon database in seconds
- Geist font loaded locally via `next/font` — no external font network request

### UI & Accessibility
- **shadcn/ui** component primitives (Dialog, Popover, Alert Dialog, Tooltip, Sheet, Badge, Skeleton) built on Radix UI for full keyboard accessibility
- **Dark / light / system** theme toggle powered by `next-themes` with no flash on load
- Responsive layout: fixed sidebar on desktop collapses into a **mobile sheet drawer** on smaller screens
- `sonner` toast notifications for every mutation success and error state

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router, Server Actions, RSC) |
| **Language** | [TypeScript 5](https://typescriptlang.org) |
| **Database** | [Neon](https://neon.tech) (serverless PostgreSQL) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) |
| **Authentication** | [Clerk](https://clerk.com) |
| **AI** | [OpenAI](https://openai.com) — `gpt-4o-mini` |
| **State & Data Fetching** | [TanStack Query v5](https://tanstack.com/query) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| **Charts** | [Recharts](https://recharts.org) |
| **Toasts** | [Sonner](https://sonner.emilkowal.ski) |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Icons** | [Lucide React](https://lucide.dev) + [Radix Icons](https://icons.radix-ui.com) |
| **Emoji Picker** | [emoji-picker-react](https://github.com/ealush/emoji-picker-react) |
| **Debounce** | [use-debounce](https://github.com/xnimorz/use-debounce) |
| **Fonts** | [Geist](https://vercel.com/font) (local, via `next/font`) |
| **Deployment** | [Vercel](https://vercel.com) |
| **Dev Tools** | TanStack Query Devtools, Drizzle Kit, ESLint |

---

## Project Structure

```
pennyplan/
├── app/
│   ├── layout.tsx                        # Root layout — ClerkProvider, ThemeProvider, QueryClientProvider
│   ├── page.tsx                          # Landing page (Header + Hero)
│   ├── globals.css                       # CSS custom properties (design tokens, theme vars)
│   ├── _components/
│   │   ├── Header.tsx                    # Public nav — logo, sign-in/up or user button
│   │   └── Hero.tsx                      # Landing page hero + feature highlight cards
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/       # Clerk hosted sign-in
│   │   └── sign-up/[[...sign-up]]/       # Clerk hosted sign-up
│   ├── (routes)/dashboard/
│   │   ├── layout.tsx                    # Dashboard shell — SideNav + DashboardHeader
│   │   ├── page.tsx                      # Overview: greeting, stat cards, chart, expense table, recent budgets
│   │   ├── loading.tsx / error.tsx       # Next.js special files for Suspense + error boundaries
│   │   ├── _components/
│   │   │   ├── SideNav.tsx               # Fixed desktop sidebar with active route highlighting
│   │   │   ├── MobileSideNav.tsx         # Sheet drawer for mobile navigation
│   │   │   ├── DashboardHeader.tsx       # Top bar — theme toggle, mobile nav trigger, user button
│   │   │   ├── CardInfo.tsx              # AI insight card + four stat cards
│   │   │   └── BarChartDashboard.tsx     # Budget vs. spend bar chart (Recharts)
│   │   ├── budgets/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── BudgetList.tsx        # Grid of budget cards + create button
│   │   │       ├── BudgetItem.tsx        # Single card with progress bar
│   │   │       └── CreateBudget.tsx      # Dialog form — emoji picker, name, amount
│   │   ├── expenses/
│   │   │   ├── page.tsx                  # All expenses across all budgets
│   │   │   ├── [id]/page.tsx             # Single budget's expenses + EditBudget sidebar
│   │   │   └── _components/
│   │   │       ├── ExpenseListTable.tsx  # Sortable table with delete action
│   │   │       ├── AddExpense.tsx        # Inline form — name and amount
│   │   │       └── EditBudget.tsx        # Edit name/amount/icon + delete budget (with confirm dialog)
│   │   └── incomes/
│   │       ├── page.tsx
│   │       └── _components/
│   │           ├── IncomeList.tsx        # Grid of income source cards + create button
│   │           ├── IncomeItem.tsx        # Single income card with total and delete
│   │           └── CreateIncomes.tsx     # Dialog form — emoji picker, name, monthly amount
│   └── api/
│       └── ai/financial-advice/
│           └── route.ts                  # POST — auth guard, OpenAI call, returns 2-sentence advice
│
├── actions/                              # "use server" — all DB writes and reads live here
│   ├── budget.actions.ts                 # getBudgets, getBudgetById, createBudget, updateBudget, deleteBudget
│   ├── expense.actions.ts                # getAllExpenses, getExpensesByBudget, createExpense, deleteExpense
│   └── income.actions.ts                 # getIncomes, createIncome, deleteIncome
│
├── hooks/                                # TanStack Query wrappers — consumed by all client components
│   ├── use-budgets.ts                    # useBudgets, useBudget, useCreateBudget, useUpdateBudget, useDeleteBudget
│   ├── use-expenses.ts                   # useAllExpenses, useExpensesByBudget, useCreateExpense, useDeleteExpense
│   └── use-incomes.ts                    # useIncomes, useCreateIncome, useDeleteIncome
│
├── validation/                           # Zod schemas — shared between forms and server actions
│   ├── budget.schema.ts
│   ├── expense.schema.ts
│   └── income.schema.ts
│
├── components/
│   ├── ThemeProvider.tsx                 # next-themes wrapper
│   ├── ThemeToggler.tsx                  # Dark/light/system toggle button
│   ├── providers.tsx                     # QueryClientProvider + QueryDevtools
│   └── ui/                              # shadcn/ui primitives (never edited directly)
│
├── lib/
│   ├── db.ts                             # Singleton Drizzle client connected to Neon via HTTP
│   └── utils.ts                          # cn() — clsx + tailwind-merge helper
│
├── utils/
│   ├── schema.ts                         # Drizzle table definitions (Budgets, Incomes, Expenses)
│   └── index.ts                          # formatNumber() — K/M/B suffix formatter
│
├── types/
│   └── index.ts                          # Shared TypeScript interfaces (Budget, BudgetWithStats, Expense, Income, IncomeWithTotal)
│
├── middleware.ts                          # Clerk edge middleware — protects all non-public routes
├── tailwind.config.ts                     # Design token extensions (brand, success, warning, surface colours)
├── drizzle.config.ts                      # Drizzle Kit config pointing at DATABASE_URL
└── next.config.mjs                        # Image domains allowlist
```

### Key Architectural Decisions

**Server Actions → Hooks pattern:** All database operations live in `"use server"` files in `actions/`. Client components never import actions directly — they go through `hooks/` which wrap each action in TanStack Query. This separation means cache invalidation, loading state, and toast feedback are centralised in one place and never duplicated across components.

**Dual validation boundary:** Zod schemas in `validation/` are imported by both the React Hook Form resolvers (client-side, instant field errors) and the server actions (server-side, safety net). One schema definition, two validation passes — the client never trusts itself, and the server never trusts the client.

**User-scoped ownership checks:** Rather than relying solely on Clerk middleware, every mutating server action fetches the target record and compares `createdBy` to the authenticated `userId` before executing the write. This prevents insecure direct object reference (IDOR) vulnerabilities.

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A [Neon](https://neon.tech) account (free tier works)
- A [Clerk](https://clerk.com) account (free tier works)
- An [OpenAI](https://platform.openai.com) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pennyplan.git
cd pennyplan

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in all required values (see below)

# 4. Push the database schema to Neon
npm run db:push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the entire project |
| `npm run db:push` | Sync Drizzle schema changes to the Neon database |
| `npm run db:studio` | Open Drizzle Studio — a browser GUI for your database |

> **Note:** Run `npm run db:push` every time you modify `utils/schema.ts`. Drizzle Kit handles column additions and type changes; destructive changes (dropping columns) require extra care in production.

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate each variable:

```env
# ─────────────────────────────────────────────
# Database — Neon PostgreSQL
# Get this from: https://console.neon.tech → your project → Connection string
# IMPORTANT: Never use a NEXT_PUBLIC_ prefix here — this must stay server-side only
# ─────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# ─────────────────────────────────────────────
# OpenAI
# Get this from: https://platform.openai.com/api-keys
# IMPORTANT: Never use a NEXT_PUBLIC_ prefix here — this must stay server-side only
# Used only in: app/api/ai/financial-advice/route.ts
# ─────────────────────────────────────────────
OPENAI_API_KEY=sk-...

# ─────────────────────────────────────────────
# Clerk Authentication
# Get these from: https://dashboard.clerk.com → your application → API Keys
# ─────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect paths — these must match your Clerk dashboard settings
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

> **Security reminder:** `DATABASE_URL` and `OPENAI_API_KEY` must never be prefixed with `NEXT_PUBLIC_`. Doing so would embed them in the client JavaScript bundle and expose them to anyone who inspects your page source.

---

## API Reference

### `POST /api/ai/financial-advice`

Generates a two-sentence personalised financial insight using GPT-4o-mini based on the authenticated user's current financial figures.

**Authentication:** Clerk session required. Returns `401` if the user is not signed in.

**Request body:**

```json
{
  "totalBudget": 5000,
  "totalIncome": 7500,
  "totalSpend": 3200
}
```

| Field | Type | Description |
|---|---|---|
| `totalBudget` | `number` | Sum of all the user's budget amounts |
| `totalIncome` | `number` | Sum of all the user's income source amounts |
| `totalSpend` | `number` | Sum of all expenses logged against budgets |

**Response `200`:**

```json
{
  "advice": "You're spending 64% of your budget while earning well above your budgeted amount — consider moving the surplus into savings or investments. Reducing discretionary spending by 10% would give you an additional $320/month to put toward financial goals."
}
```

**Response `401`:**

```json
{
  "error": "Unauthorized"
}
```

**Notes:**
- Called automatically on the dashboard when the user's budget or income data changes
- Requests are debounced on the client to prevent API spam during parallel query resolution
- Token limit is capped at 150 to keep response times short and costs low

---

## AI Integration

PennyPlan integrates OpenAI's `gpt-4o-mini` model to surface actionable, contextualised financial advice directly on the dashboard.

### How it works

1. When the dashboard loads, `CardInfo.tsx` computes `totalBudget`, `totalSpend`, and `totalIncome` from the TanStack Query cache
2. These values are piped through `use-debounce` with an 800 ms delay to prevent API calls on intermediate render states
3. A `useRef` guard (`hasFetchedRef`) ensures the advice only refreshes when the underlying financial figures genuinely change — not on unrelated re-renders
4. The fetch hits `/api/ai/financial-advice` which re-authenticates the user via Clerk server-side, builds a structured prompt with real dollar figures, calls OpenAI with `max_tokens: 150`, and returns exactly 2 sentences of advice
5. The advice renders in a branded card below the dashboard header with a "Powered by GPT-4o" badge

### Prompt design

```
Based on the following financial data:
- Total Budget: $[amount] USD
- Expenses: $[amount] USD
- Income: $[amount] USD
Provide concise financial advice in exactly 2 sentences to help the user manage their finances more effectively.
```

The prompt is kept tightly scoped so the model stays focused on actionable output. The 2-sentence constraint ensures the advice fits cleanly in the UI card without overflow.

---

## Database Schema

Three tables, defined with Drizzle ORM in `utils/schema.ts`:

```
Budgets
  id          serial          PRIMARY KEY
  name        varchar         NOT NULL
  amount      numeric(12,2)   NOT NULL
  icon        varchar         nullable — emoji character
  createdBy   varchar         NOT NULL  (Clerk userId)

Incomes
  id          serial          PRIMARY KEY
  name        varchar         NOT NULL
  amount      numeric(12,2)   NOT NULL
  icon        varchar         nullable — emoji character
  createdBy   varchar         NOT NULL  (Clerk userId)

Expenses
  id          serial          PRIMARY KEY
  name        varchar         NOT NULL
  amount      numeric(12,2)   NOT NULL  DEFAULT 0
  budgetId    integer         → Budgets.id (foreign key)
  createdAt   timestamp       DEFAULT NOW()
```

`Expenses` is the only table with a foreign key — it belongs to a `Budget`. When a budget is deleted, its expenses are deleted first in `budget.actions.ts` before the budget record itself.

Both `getBudgets` and `getBudgetById` use a SQL `LEFT JOIN` with `COALESCE` and `COUNT` aggregates to compute `totalSpend` and `totalItem` per budget in a single database round-trip — no N+1 queries.

---

## Performance Optimisations

- **Single-query aggregation:** Budget stats (spend total, expense count) are computed with SQL aggregates in the same query that fetches budgets — zero extra round-trips
- **Debounced AI calls:** The 800 ms debounce prevents the AI endpoint from being called multiple times as TanStack Query resolves multiple parallel queries on page load
- **Fetch deduplication:** `hasFetchedRef` ensures the AI advice endpoint is called at most once per meaningful financial data change, even if the component re-renders
- **Skeleton loaders:** shadcn/ui `Skeleton` components fill chart and stat card space while data loads, preventing layout shift
- **Local fonts:** Geist Sans and Geist Mono are loaded via `next/font/local` — no external font network request, no FOUT
- **Server Actions:** All reads and writes go through Next.js Server Actions, which run on the server and return only the data the client needs
- **TanStack Query caching:** Queries are cached by key and shared between components on the same page. Mutations call `invalidateQueries` with surgical precision so only affected caches refresh
- **Edge middleware:** Clerk auth runs at the Vercel edge before the request hits any Next.js compute — unauthenticated requests to protected routes are rejected at the CDN layer

---

## Deployment

PennyPlan is designed to deploy on **Vercel** with zero additional configuration beyond environment variables.

### Deploy to Vercel

```bash
# Install Vercel CLI (optional — you can also use the Vercel dashboard)
npm i -g vercel

# Deploy
vercel

# Set environment variables via CLI or in the Vercel dashboard
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL
```

### Post-deployment checklist

- [ ] Add your Vercel deployment URL to Clerk's **Allowed redirect URLs** in the Clerk dashboard
- [ ] Run `npm run db:push` with your production `DATABASE_URL` to ensure the Neon schema is up to date
- [ ] Verify the AI insight card loads on the dashboard (confirms `OPENAI_API_KEY` is set correctly)
- [ ] Test sign-in and sign-up flows on the deployed URL

### Alternative deployment targets

Since this is a standard Next.js 14 App Router project with no Docker or custom server, it can also be deployed on **Railway**, **Render**, or **AWS Amplify** — connect the GitHub repo, set the same environment variables, and use `npm run build` / `npm run start` as build and start commands respectively.

---

## Screenshots

> Replace these placeholders with real screenshots before publishing.

| View | Screenshot |
|---|---|
| Landing Page | ![Landing](public/screenshots/landing.png) |
| Dashboard Overview | ![Dashboard](public/screenshots/dashboard.png) |
| Budget List | ![Budgets](public/screenshots/budgets.png) |
| Expense Detail | ![Expenses](public/screenshots/expenses.png) |
| Income Tracker | ![Incomes](public/screenshots/incomes.png) |
| Mobile View | ![Mobile](public/screenshots/mobile.png) |
| Dark Mode | ![Dark Mode](public/screenshots/dark-mode.png) |

---

## Developer Notes

### Conventions

- **No `any` types.** TypeScript interfaces in `types/index.ts` cover every entity returned from the database. `BudgetWithStats` extends `Budget` with computed fields that come from SQL aggregates.
- **Client components are thin.** Data fetching, cache management, and mutations live in hooks. Components receive typed props and call hook functions — they do not know how data is fetched or stored.
- **`cn()` utility everywhere.** The `lib/utils.ts` `cn` function (clsx + tailwind-merge) is used for all dynamic `className` composition to prevent Tailwind class conflicts.
- **Design tokens, not hardcoded colours.** All colours reference CSS custom properties through Tailwind's extended theme (`brand`, `success`, `warning`, `surface`) so dark and light mode work automatically.
- **`revalidatePath` after every mutation.** Every server action that writes to the database calls `revalidatePath` on the affected routes so server-rendered pages and TanStack Query stay consistent.

### Adding a new entity type

Follow the same three-file pattern used for budgets, expenses, and incomes:

1. Add a table to `utils/schema.ts` and run `npm run db:push`
2. Create `actions/your-entity.actions.ts` with `"use server"` functions for each operation
3. Create `validation/your-entity.schema.ts` with Zod schemas for create/update
4. Create `hooks/use-your-entity.ts` wrapping each action in TanStack Query
5. Build your UI components importing only from hooks — never directly from actions

---

## Future Improvements

- **Recurring expenses** — a `recurrence` field on `Expenses` with a scheduled function that auto-creates monthly entries
- **Budget categories** — a `Categories` table with a many-to-one relation to `Budgets` for nested spending breakdowns
- **CSV / PDF export** — a server action that streams a downloadable report of expenses for a date range
- **Spending alerts** — notify the user via email when a budget crosses 80% of its limit
- **Historical charts** — store month/year on `Expenses` and render a time-series line chart showing spending trends across months
- **Multi-currency support** — a `currency` field on `Budgets` with exchange rate conversion
- **AI streaming** — replace the single `fetch` call with a streaming response using the Vercel AI SDK to show advice appearing word-by-word

---

## Contributing

Contributions are welcome. Please open an issue first to discuss the change before submitting a pull request.

```bash
# 1. Fork the repository and clone your fork
git clone https://github.com/your-username/pennyplan.git
cd pennyplan

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Install dependencies and set up environment variables
npm install
cp .env.example .env.local

# 4. Push the schema to your dev Neon database
npm run db:push

# 5. Make your changes, lint, and build
npm run lint
npm run build

# 6. Commit and open a PR against main
```

### Guidelines

- Follow the **Server Actions → Hooks** pattern for any new data operations
- Add Zod validation schemas for any new form inputs — one schema used by both the form resolver and the server action
- Keep server action files `"use server"` — never import them directly in client components
- Use existing design tokens (`brand`, `success`, `warning`, `surface`) rather than hardcoding colours
- Prefer `Skeleton` components for loading states over spinners inside data-dependent UI

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with Next.js · Drizzle ORM · Clerk · OpenAI

</div>
