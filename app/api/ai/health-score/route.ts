import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFlashModel } from "@/lib/gemini";
import { healthScoreRequestSchema } from "@/validation/ai.schema";

function computeRawScore(
  totalBudget: number,
  totalSpend: number,
  totalIncome: number,
  budgetCount: number
): number {
  if (totalBudget === 0 && totalIncome === 0) return 50;

  // Budget utilization score (0-40): higher is better when <80% utilized
  const utilizationRatio = totalBudget > 0 ? totalSpend / totalBudget : 1;
  const budgetScore = Math.max(0, (1 - utilizationRatio) * 40);

  // Income coverage score (0-40): income vs total spend
  const coverageRatio = totalIncome > 0 ? totalSpend / totalIncome : 1;
  const coverageScore = Math.max(0, (1 - Math.min(coverageRatio, 1)) * 40);

  // Budget diversity score (0-20): more budget categories tracked = better habits
  const diversityScore = Math.min(budgetCount * 5, 20);

  return Math.round(Math.min(100, budgetScore + coverageScore + diversityScore));
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = healthScoreRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { totalBudget, totalSpend, totalIncome, budgetCount } = parsed.data;
    const score = computeRawScore(totalBudget, totalSpend, totalIncome, budgetCount);

    const model = getFlashModel();
    const prompt = `A user has a financial health score of ${score}/100.
Their data:
- Total budget: $${totalBudget.toFixed(0)}
- Total spent: $${totalSpend.toFixed(0)} (${totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(0) : 0}% utilized)
- Monthly income: $${totalIncome.toFixed(0)}
- Active budget categories: ${budgetCount}

Write exactly 2 sentences: first explain what the score means for their financial health, then give one specific, actionable step they can take this week to improve it. Be direct and encouraging.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    return NextResponse.json({ score, explanation });
  } catch {
    return NextResponse.json(
      { error: "Failed to compute health score" },
      { status: 500 }
    );
  }
}
