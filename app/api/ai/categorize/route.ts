import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFlashModelJson } from "@/lib/gemini";
import {
  categorizeRequestSchema,
  categorizeResponseSchema,
} from "@/validation/ai.schema";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = categorizeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { expenseName, amount, budgets } = parsed.data;
    const budgetList = budgets
      .map((b) => `{ "id": ${b.id}, "name": "${b.name}" }`)
      .join(", ");

    const model = getFlashModelJson();
    const prompt = `Classify this expense into one of the given budget categories.

Expense: "${expenseName}" ($${amount})
Available budgets: [${budgetList}]

Return a JSON object with:
- "budgetId": the id number of the best matching budget
- "confidence": "high", "medium", or "low" based on how certain you are
- "reasoning": one short sentence explaining your choice

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

    const validated = categorizeResponseSchema.safeParse(responseData);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid AI response structure" },
        { status: 500 }
      );
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json(
      { error: "Failed to categorize expense" },
      { status: 500 }
    );
  }
}
