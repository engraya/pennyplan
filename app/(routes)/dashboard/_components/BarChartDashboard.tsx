"use client";

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BudgetWithStats } from "@/types";

interface BarChartDashboardProps {
  budgetList: BudgetWithStats[];
}

export default function BarChartDashboard({ budgetList }: BarChartDashboardProps) {
  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={budgetList} margin={{ top: 7 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" name="Spent" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" name="Budget" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
