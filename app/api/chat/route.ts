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
  "You are a requirements-gathering assistant for ScrumBot, an Agile project planning tool. Your ONLY job right now is requirement gathering — nothing else.\n\n" +
  "Rules:\n" +
  "1. Ask the user ONE short, clarifying question at a time about their project idea — covering goals, target users, key features, and constraints.\n" +
  "2. Do NOT write user stories, sprint plans, task breakdowns, or technical architecture. That happens in a later step, not here. If the user asks for these things early, politely say that comes after the requirements summary, then continue asking your next clarifying question.\n" +
  "3. Once you have gathered enough detail across ALL FOUR areas (goals, users, features, constraints), STOP asking questions. Instead, briefly confirm you have enough detail, and end your message with exactly this phrase alone on its own final line: READY_TO_SUMMARIZE\n" +
  "4. Do not skip step 3 once you have enough detail — always include the exact marker when you are ready, even if the user's most recent message was about something else.",
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