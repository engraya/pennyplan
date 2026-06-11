import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { totalBudget, totalIncome, totalSpend } = await req.json();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Based on the following financial data:
- Total Budget: $${totalBudget} USD
- Expenses: $${totalSpend} USD
- Income: $${totalIncome} USD
Provide concise financial advice in exactly 2 sentences to help the user manage their finances more effectively.`,
      },
    ],
    max_tokens: 150,
  });

  const advice = chat.choices[0].message.content;
  return NextResponse.json({ advice });
}
