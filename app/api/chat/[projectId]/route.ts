import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const messages = await prisma.requirementMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ messages });
}