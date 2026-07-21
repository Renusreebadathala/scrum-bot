## Module 2 is complete ✅

Here are your notes to save.

---

### 📘 Module 2 Notes — AI Requirement Chat

**Concepts Table**

| Term | Plain-English Meaning |
|---|---|
| API route | A file at `app/api/.../route.ts` that becomes a URL your app can call |
| `POST` vs `GET` | POST = "here's data, do something"; GET = "give me data" |
| System prompt | Invisible instructions that steer how the AI behaves the whole conversation |
| Token | Roughly a "chunk of a word"; AI replies are billed/limited by token count |
| `max_tokens` | Caps how long an AI reply can be |
| Dynamic route (`[projectId]`) | Square-bracket folder name = a variable piece of the URL |
| `useState` | React's way of remembering values that change (messages, input text) |
| `useEffect` | Runs code automatically when the page loads or a value changes |
| Markdown | Text formatting using symbols like `**bold**`; needs a renderer to display properly |
| `.env` / `.gitignore` | Keeps secret keys (like API keys) out of your public GitHub repo |

**Steps You Completed**

1. Added `OPENROUTER_API_KEY` to `.env`, confirmed `.gitignore` protects it
2. Installed the `openai` npm package (used to call OpenRouter)
3. Created `app/api/chat/route.ts`, set up the OpenRouter client
4. Built the `POST` handler that sends the conversation to Claude and returns a reply
5. Fixed a `402` credit error by adding `max_tokens: 500`
6. Tested the route directly with PowerShell, confirmed real AI replies
7. Added database saving (`prisma.requirementMessage.create`) for both user and AI messages
8. Updated the system prompt to add a `READY_TO_SUMMARIZE` signal
9. Created `app/api/chat/[projectId]/route.ts` — a `GET` route to load past messages
10. Built the chat page UI (`app/projects/[projectId]/chat/page.tsx`) — loads history, sends new messages, shows a "ready" banner
11. Fixed Markdown rendering with `react-markdown` so `**bold**` displays correctly

**Errors + Fixes**

| Error | Cause | Fix |
|---|---|---|
| `500` on `/api/chat` | Hidden real error only visible in dev server terminal | Checked `npm run dev` terminal for the real message |
| `402 requires more credits` | Requested up to 64,000 tokens by default | Added `max_tokens: 500` |
| `Get-Item` empty output on `[projectId]` folder | PowerShell treats `[` `]` as special characters | Used `-LiteralPath` |
| Turbopack `FATAL` panic, "Next.js package not found" | Broken/incomplete `node_modules` | Deleted `node_modules` + lockfile, ran `npm install` fresh |
| `**bold**` showing as literal asterisks | Raw Markdown text wasn't being parsed | Installed `react-markdown`, rendered AI messages through it |

**Q&A**

1. **Why keep the OpenRouter API key server-side only?**
   Exposing it in browser code would let anyone steal it and rack up charges on your account.

2. **What's the difference between a GET and POST route here?**
   GET (`/api/chat/[projectId]`) retrieves saved messages; POST (`/api/chat`) sends new messages and gets an AI reply.

3. **Why use a system prompt instead of hardcoding the AI's questions?**
   It lets the AI have a real, adaptive conversation instead of following a fixed script, while still following consistent behavior rules.

4. **Why did you add a `READY_TO_SUMMARIZE` marker instead of just letting the AI say it's ready in plain words?**
   A fixed, consistent marker is easy and reliable for code to detect; free-form phrasing would vary too much to catch reliably.

5. **Why does `useEffect` run when the page loads?**
   It's how React lets you run "side effect" code (like fetching data) automatically at a certain time — here, right when the page first renders.

---

