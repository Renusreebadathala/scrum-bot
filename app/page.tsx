import { prisma } from "../lib/prisma";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-black text-zinc-50 px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">ScrumBot Dashboard</h1>

        <NewProjectForm />

        {projects.length === 0 ? (
          <p className="text-zinc-400">
            No projects yet. Create one to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition-colors"
              >
                <Link href={`/projects/${project.id}/chat`}>
                  <div className="font-medium text-lg">{project.title}</div>
                  <div className="text-sm text-zinc-500">{project.status}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}