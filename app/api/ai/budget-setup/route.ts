import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFlashModelJson } from "@/lib/gemini";
import {
  budgetSetupRequestSchema,
  budgetSetupResponseSchema,
} from "@/validation/ai.schema";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = budgetSetupRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { monthlyIncome, location } = parsed.data;
    const locationNote = location ? ` living in ${location}` : "";

    const model = getFlashModelJson();
    const prompt = `Create a realistic monthly budget plan for someone earning $${monthlyIncome}/month${locationNote}.

Return a JSON object with a "budgets" array of 5-7 budget categories. Each item must have:
- "name": descriptive category name (e.g. "Housing & Rent", "Food & Groceries", "Transport")
- "amount": monthly dollar amount as a number (realistic based on income and location)
- "icon": a single relevant emoji
- "reasoning": one short sentence explaining why this amount

Allocate all amounts to sum close to ${Math.round(monthlyIncome * 0.85)} (leaving ~15% for savings/emergency).
Return only the JSON, no extra text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let responseData: unknown;
    try {
      responseData = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const validated = budgetSetupResponseSchema.safeParse(responseData);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid AI response structure" },
        { status: 500 }
      );
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate budget setup" },
      { status: 500 }
    );
  }
}
