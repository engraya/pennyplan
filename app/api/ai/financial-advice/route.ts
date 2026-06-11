import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFlashModel } from "@/lib/gemini";
import { buildUserFinancialContext } from "@/lib/ai-context";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { totalBudget, totalIncome, totalSpend } = await req.json();
    const context = await buildUserFinancialContext(userId);
    const model = getFlashModel();

    const prompt = `${context}

You are a friendly and knowledgeable personal finance advisor. Based on the financial summary above, provide 4-6 sentences of personalized, actionable financial advice. Be specific — reference the user's actual budget categories, income amounts, and spending patterns by name. Focus on one clear action they can take this week to improve their financial health. Keep the tone encouraging and practical.`;

    const result = await model.generateContent(prompt);
    const advice = result.response.text();

    return NextResponse.json({ advice });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    );
  }
}
