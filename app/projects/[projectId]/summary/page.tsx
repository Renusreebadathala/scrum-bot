"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Summary = {
  id: string;
  summary: string;
};

export default function SummaryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      const res = await fetch(`/api/summary/${projectId}`);

      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSummary(data);
      setLoading(false);
    }
    loadSummary();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[#14161C] text-[#EDEEF2] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <p className="text-[11px] tracking-[0.15em] text-[#8A8F9C] uppercase">
          Requirements Summary
        </p>
        <h1 className="text-lg font-medium mt-1">
          Project ID: <span className="text-[#8A8F9C] font-normal">{projectId}</span>
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {loading && (
            <p className="text-[#8A8F9C] text-sm">Loading summary…</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-400">
              No summary found for this project. Go back to the chat and click
              &quot;Generate Summary&quot; first.
            </p>
          )}

          {!loading && summary && (
            <div className="text-[15px] leading-relaxed [&_h2]:text-[#E8A33D] [&_h2]:text-base [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mt-6 [&_h2]:mb-2 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
              <ReactMarkdown>{summary.summary}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>

      {/* Footer actions */}
      {!loading && summary && (
        <footer className="border-t border-white/10 px-6 py-4">
          <div className="max-w-2xl mx-auto flex justify-between">
            <button
              onClick={() => router.push(`/projects/${projectId}/chat`)}
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-white/10 text-[#8A8F9C] hover:text-white hover:border-white/30 transition-colors"
            >
              Back to Chat
            </button>
            <button
              disabled
              className="text-sm font-medium px-3 py-1.5 rounded-md bg-[#E8A33D] text-[#14161C] opacity-50 cursor-not-allowed"
              title="Coming in Module 4"
            >
              Generate Scrum Plan
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}