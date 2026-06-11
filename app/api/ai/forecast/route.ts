import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFlashModel } from "@/lib/gemini";
import { forecastRequestSchema } from "@/validation/ai.schema";

export interface ForecastItem {
  budgetId: number;
  budgetName: string;
  budgetAmount: number;
  currentSpend: number;
  projectedSpend: number;
  projectedOverage: number;
  narrative: string;
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = forecastRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { budgets, daysElapsed, totalDays } = parsed.data;

    // Compute projections in TypeScript — Gemini only writes the narrative
    const atRiskBudgets = budgets
      .map((b) => {
        const budgetAmount = Number(b.amount);
        const projected =
          daysElapsed > 0
            ? (b.totalSpend / daysElapsed) * totalDays
            : b.totalSpend;
        const overage = projected - budgetAmount;
        return {
          budgetId: b.id,
          budgetName: b.name,
          budgetAmount,
          currentSpend: b.totalSpend,
          projectedSpend: Math.round(projected),
          projectedOverage: Math.round(overage),
        };
      })
      .filter((b) => b.projectedSpend > b.budgetAmount * 1.05);

    if (atRiskBudgets.length === 0) {
      return NextResponse.json({ forecasts: [] });
    }

    const model = getFlashModel();

    const forecasts: ForecastItem[] = await Promise.all(
      atRiskBudgets.map(async (b) => {
        const prompt = `A user's "${b.budgetName}" budget:
- Monthly budget: $${b.budgetAmount}
- Spent so far (day ${daysElapsed} of ${totalDays}): $${b.currentSpend}
- Projected month-end spend: $${b.projectedSpend} (over by $${b.projectedOverage})

Write one concise sentence warning them about this overage and suggesting a specific action to stay on track. Be direct and helpful, not alarming.`;

        const result = await model.generateContent(prompt);
        return { ...b, narrative: result.response.text().trim() };
      })
    );

    return NextResponse.json({ forecasts });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    );
  }
}
