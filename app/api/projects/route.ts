import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// POST /api/projects → create a new Project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, ideaText } = body;

    if (!title || !ideaText) {
      return NextResponse.json(
        { error: "title and ideaText are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: { title, ideaText },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// GET /api/projects → fetch all Projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}