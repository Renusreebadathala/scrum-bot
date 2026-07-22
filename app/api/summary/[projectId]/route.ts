import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // 1. Fetch all chat messages for this project, oldest first
  const messages = await prisma.requirementMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "No chat messages found for this project" },
      { status: 400 }
    );
  }

  // 2. Turn the messages into a plain-text transcript for the AI to read
  const transcript = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  // 3. Ask the AI to summarize the transcript into a structured document
  const systemPrompt = `You are ScrumBot. You will be given a raw chat transcript between a user and an AI assistant gathering requirements for a software project.

Write a clear, structured Requirements Summary in markdown using exactly these sections:
## Project Goal
## Target Users
## Key Features
## Constraints

Be concise but complete. Do not include anything outside these four sections. Do not add a title or preamble — start directly with "## Project Goal".`;

  const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4.5",
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
    }),
  });

  const aiData = await aiResponse.json();
  const summaryText = aiData.choices?.[0]?.message?.content;

  if (!summaryText) {
    return NextResponse.json(
      { error: "AI did not return a summary" },
      { status: 500 }
    );
  }

  // 4. Save it to the database — create if none exists, overwrite if it does
  const savedSummary = await prisma.requirementSummary.upsert({
    where: { projectId },
    update: { summary: summaryText },
    create: { projectId, summary: summaryText },
  });

  // 5. Send it back to the frontend
  return NextResponse.json(savedSummary);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const summary = await prisma.requirementSummary.findUnique({
    where: { projectId },
  });

  if (!summary) {
    return NextResponse.json(
      { error: "No summary found for this project" },
      { status: 404 }
    );
  }

  return NextResponse.json(summary);
}