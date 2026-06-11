"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BudgetWithStats } from "@/types";

interface BarChartDashboardProps {
  budgetList: BudgetWithStats[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 min-w-[168px]">
      <p className="text-xs font-extrabold text-foreground mb-3 truncate">{label}</p>
      <div className="space-y-2">
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background:
                    entry.name === "Spent"
                      ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                      : "linear-gradient(135deg, #c4b5fd, #e0e7ff)",
                }}
              />
              <span className="text-muted-foreground font-semibold">{entry.name}</span>
            </div>
            <span className="font-extrabold text-foreground">
              ${Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BarChartDashboard({ budgetList }: BarChartDashboardProps) {
  return (
    <div className="relative overflow-hidden bg-card rounded-2xl border border-border p-6">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-violet-500/4 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-base font-extrabold">Spending Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Budget vs. actual spending by category
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-indigo-500 to-violet-600" />
              <span className="font-semibold">Spent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-violet-200 dark:bg-violet-900/60" />
              <span className="font-semibold">Budget</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={budgetList}
            barCategoryGap="35%"
            margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#e0e7ff" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="hsl(220 13% 91%)"
              vertical={false}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(v) =>
                `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)", radius: 6 }} />
            <Bar
              dataKey="totalSpend"
              name="Spent"
              fill="url(#spentGradient)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="amount"
              name="Budget"
              fill="url(#budgetGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
