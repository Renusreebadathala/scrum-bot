"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const [readyToSummarize, setReadyToSummarize] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load past messages when the page opens
  useEffect(() => {
    async function loadHistory() {
    const res = await fetch(`/api/chat/${projectId}`);
    const data = await res.json();

    const cleanedMessages = data.messages.map((msg: Message) => {
      if (msg.role === "assistant" && msg.content.includes("READY_TO_SUMMARIZE")) {
        return { ...msg, content: msg.content.replace("READY_TO_SUMMARIZE", "").trim() };
      }
      return msg;
  });

    const lastMessage = data.messages[data.messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage.content.includes("READY_TO_SUMMARIZE")) {
      setReadyToSummarize(true);
    }

    setMessages(cleanedMessages);
    setLoading(false);
}
    async function loadProjectTitle() {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProjectTitle(data.title);
      }
    }

    loadProjectTitle();
    loadHistory();
  }, [projectId]);

  // Auto-scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, messages: updatedMessages }),
    });

    const data = await res.json();
    let reply: string = data.reply;

    const isReady = reply.includes("READY_TO_SUMMARIZE");
    if (isReady) {
      reply = reply.replace("READY_TO_SUMMARIZE", "").trim();
      setReadyToSummarize(true);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setSending(false);
  }
  async function handleGenerateSummary() {
    if (generatingSummary) return;
    setGeneratingSummary(true);

    try {
      const res = await fetch(`/api/summary/${projectId}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate summary");
      }

      router.push(`/projects/${projectId}/summary`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong generating the summary. Please try again.");
      setGeneratingSummary(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-[#14161C] text-[#EDEEF2] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-[#14161C]/95 backdrop-blur">
        <p className="text-[11px] tracking-[0.15em] text-[#8A8F9C] uppercase">
          Requirement Chat
        </p>
        <h1 className="text-lg font-medium mt-1">
          {projectTitle ?? "Loading…"}
        </h1>
        <p className="text-xs text-[#8A8F9C] mt-1">Project ID: {projectId}</p>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {loading && (
            <p className="text-[#8A8F9C] text-sm">Loading conversation…</p>
          )}

          {!loading && messages.length === 0 && (
            <p className="text-[#8A8F9C] text-sm">
              No messages yet. Send your first message to start.
            </p>
          )}

          {messages.map((msg, i) => (
            <div key={msg.id ?? i} className="flex flex-col gap-1.5">
              <span
                className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
                  msg.role === "assistant" ? "text-[#E8A33D]" : "text-[#8A8F9C]"
                }`}
              >
                {msg.role === "assistant" ? "ScrumBot" : "You"}
              </span>
              <div className="text-[15px] leading-relaxed [&_strong]:font-semibold [&_strong]:text-white">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-[#E8A33D]">
                ScrumBot
              </span>
              <p className="text-[15px] text-[#8A8F9C] italic">Thinking…</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Ready to summarize banner */}
      {readyToSummarize && (
        <div className="border-t border-[#E8A33D]/30 bg-[#E8A33D]/10 px-6 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className="text-sm text-[#E8A33D]">
              ScrumBot thinks it has enough detail to generate a summary.
            </p>
            <button
               onClick={handleGenerateSummary}
               disabled={generatingSummary}
               className="text-sm font-medium px-3 py-1.5 rounded-md bg-[#E8A33D] text-[#14161C] hover:bg-[#f0b354] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
              {generatingSummary ? "Generating…" : "Generate Summary"}
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="border-t border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your reply…"
            rows={1}
            className="flex-1 resize-none bg-[#1C1F27] border border-white/10 rounded-lg px-4 py-3 text-[15px] placeholder:text-[#8A8F9C] focus:outline-none focus:ring-1 focus:ring-[#E8A33D]/50"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="px-4 py-3 rounded-lg bg-[#EDEEF2] text-[#14161C] font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}