import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProModel } from "@/lib/gemini";
import { buildUserFinancialContext } from "@/lib/ai-context";
import { chatRequestSchema } from "@/validation/ai.schema";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { messages } = parsed.data;
    const context = await buildUserFinancialContext(userId);

    const systemInstruction = `You are PennyPlan AI, a friendly and knowledgeable personal finance assistant. You have access to the user's real financial data:

${context}

Guidelines:
- Always reference the user's actual numbers, budget names, and income sources when relevant
- Be concise, warm, and actionable — avoid walls of text
- When asked about affordability, do the math explicitly
- Give one clear recommendation per response
- Never make up data; only use what's provided above
- If the user asks about something outside their financial data, answer briefly then redirect to their finances`;

    const model = getProModel();
    const history = messages.slice(0, -1);
    const lastMessage = messages[messages.length - 1].parts[0].text;

    const chat = model.startChat({
      history,
      systemInstruction,
    });

    const streamResult = await chat.sendMessageStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
