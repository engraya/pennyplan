# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Drizzle schema changes to Neon (run after editing utils/schema.ts)
npm run db:studio    # Open Drizzle Studio GUI for the database
```

No test runner is configured.

## Environment Variables

Copy `.env.example` to `.env.local`. Required vars:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `OPENAI_API_KEY` — Used only in `app/api/ai/financial-advice/route.ts`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — Clerk auth

Never use `NEXT_PUBLIC_` prefix on `DATABASE_URL` or `OPENAI_API_KEY`.

## Architecture

### Data layer

`utils/schema.ts` defines the three Drizzle tables: `Budgets`, `Incomes`, `Expenses`. `Expenses` has a foreign key to `Budgets.id`. `lib/db.ts` exports the singleton Drizzle client connected to Neon via HTTP.

### Server actions → hooks pattern

All database writes and reads flow through this two-layer stack:

1. **`actions/*.actions.ts`** — `"use server"` files. Every action calls `auth()` from Clerk, validates input with the matching Zod schema from `validation/`, queries via `db`, and calls `revalidatePath` after mutations.
2. **`hooks/use-*.ts`** — TanStack Query wrappers around those actions. Mutations call `queryClient.invalidateQueries` and show `sonner` toasts on success/error.

Client components import hooks, never actions directly.

### Validation

`validation/budget.schema.ts`, `expense.schema.ts`, `income.schema.ts` export Zod schemas and their inferred types. The same schemas are used by React Hook Form (`@hookform/resolvers/zod`) in form components and by server actions as the authoritative validation boundary.

### Route structure

```
app/
  page.tsx                          # Landing page (Header + Hero)
  layout.tsx                        # Root: ClerkProvider + ThemeProvider + QueryClientProvider
  (auth)/sign-in|sign-up/           # Clerk-hosted auth pages
  (routes)/dashboard/
    layout.tsx                      # Fixed SideNav + DashboardHeader shell
    page.tsx                        # Overview: CardInfo, BarChart, latest budgets/expenses
    budgets/                        # Budget list + create
    expenses/                       # All expenses table
    expenses/[id]/                  # Single budget's expenses + EditBudget
    incomes/                        # Income list + create
  api/ai/financial-advice/route.ts  # POST → OpenAI gpt-4o-mini, auth-guarded
```

Dashboard routes are protected implicitly by Clerk middleware; server actions also enforce auth individually.

### UI

shadcn/ui components live in `components/ui/`. Tailwind + `tailwindcss-animate` for styling. `next-themes` + `ThemeProvider` for dark/light mode. `sonner` for toast notifications. `recharts` for the bar chart on the dashboard. `emoji-picker-react` for budget/income icon selection.

### Shared utilities

- `types/index.ts` — TypeScript interfaces (`Budget`, `BudgetWithStats`, `Expense`, `Income`, `IncomeWithTotal`)
- `utils/index.ts` — `formatNumber` (K/M/B suffix formatter)
