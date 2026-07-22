"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ideaText, setIdeaText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !ideaText.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, ideaText }),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const project = await res.json();
      router.push(`/projects/${project.id}/chat`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-800 rounded-lg p-4 mb-8 flex flex-col gap-3"
    >
      <h2 className="text-lg font-medium">+ New Project</h2>

      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-50"
      />

      <textarea
        placeholder="Describe your project idea..."
        value={ideaText}
        onChange={(e) => setIdeaText(e.target.value)}
        rows={3}
        className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-zinc-50"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-500 text-black font-medium rounded px-4 py-2 hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}