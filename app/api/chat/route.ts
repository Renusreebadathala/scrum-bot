import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const body = await req.json();
  const { projectId, messages } = body;

  // Save the user's latest message first
  const lastUserMessage = messages[messages.length - 1];
  await prisma.requirementMessage.create({
    data: {
      projectId,
      role: lastUserMessage.role,
      content: lastUserMessage.content,
    },
  });

  const completion = await openrouter.chat.completions.create({
    model: "anthropic/claude-sonnet-4.5",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful Agile product analyst. Ask the user ONE clarifying question at a time about their project idea, to understand goals, target users, key features, and constraints. Keep questions short and conversational. Once you feel you have gathered enough detail across goals, users, key features, and constraints, clearly tell the user you think you have enough information, and end your message with exactly this phrase on its own line: READY_TO_SUMMARIZE",
      },
      ...messages,
    ],
  });

  const reply = completion.choices[0].message.content;

  // Save the AI's reply
  await prisma.requirementMessage.create({
    data: {
      projectId,
      role: "assistant",
      content: reply,
    },
  });

  return Response.json({ reply });
}