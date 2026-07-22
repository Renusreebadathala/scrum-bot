## 📋 Module 3 Notes — Requirements Summary

### Concepts Table

| Term | Plain English Meaning |
|---|---|
| **Marker (`READY_TO_SUMMARIZE`)** | A secret keyword the AI includes in its reply when it feels it has gathered enough detail. Our code checks for this exact text to decide when to show the "Generate Summary" button. |
| **`upsert`** | A database operation meaning "**up**date if it exists, in**sert** if it doesn't." Used so clicking "Generate Summary" twice overwrites the old summary instead of erroring. |
| **Dynamic route `[projectId]`** | A folder/file name with square brackets tells Next.js "this part of the URL is a variable." So `/api/summary/[projectId]/route.ts` handles `/api/summary/abc123`, `/api/summary/xyz789`, etc. |
| **System prompt drift** | A long conversation can cause an AI to gradually stop following its original instructions, especially if the user's later requests pull it in a different direction (e.g., asking for sprint plans mid-requirement-chat). Fixed by explicitly telling the AI what NOT to do. |
| **State not persisting on reload** | React state (like `useState`) lives only in the browser's memory — it resets every time a page reloads. Any "memory" that needs to survive a reload must be recomputed from real data (the database), not assumed to still be true. |

### Steps We Actually Did

1. Built `app/api/summary/[projectId]/route.ts` with a `POST` handler: fetches all chat messages for a project, sends them to the AI with instructions to produce a 4-section markdown summary, saves it via `upsert`, returns it.
2. Wired the previously-dead "Generate Summary" button in the chat page: added `useRouter`, a `generatingSummary` state, and a `handleGenerateSummary` function that calls the new POST route and navigates to `/summary` on success.
3. Added a `GET` handler to the same summary route, to fetch an already-saved summary.
4. Built `app/projects/[projectId]/summary/page.tsx`: fetches the summary via GET, renders it as styled markdown, with "Back to Chat" and a disabled "Generate Scrum Plan" placeholder.
5. Tested the backend directly via PowerShell (`Invoke-RestMethod`) before the button worked, to isolate whether the bug was in the backend or the frontend trigger.
6. Discovered the AI wasn't reliably outputting the marker — traced it to the system prompt not explicitly forbidding sprint-planning tangents.
7. Rewrote the system prompt in `app/api/chat/route.ts` with explicit rules: stay in requirement-gathering mode only, refuse to write user stories/sprint plans early, always output the marker once ready.
8. Found a second bug: reloading the chat page (e.g., via "Back to Chat") showed the raw marker text and lost the banner, because `loadHistory` didn't do the same marker-stripping/detection that `sendMessage` did.
9. Fixed `loadHistory` to strip the marker from all loaded messages and re-detect readiness from the last message.
10. Verified the full flow end-to-end in the browser with a fresh test project.

### Errors + Fixes

| Error | Cause | Fix |
|---|---|---|
| `Get-Content`/`type` couldn't read files with `[projectId]` in the path | PowerShell interprets `[` `]` as wildcard characters | Used `cmd /c type "path"` to bypass PowerShell's wildcard parsing |
| `New-Item -LiteralPath` not recognized | That parameter doesn't exist in this PowerShell version | Used plain `-Path` instead |
| AI never showed the "Generate Summary" button despite a long, detailed conversation | System prompt didn't forbid the AI from answering off-topic requests (like "help with sprint planning"), so it drifted away from its job and never output the marker | Rewrote system prompt with explicit rules against sprint-planning mid-chat, and reinforced the marker instruction |
| Marker text (`READY_TO_SUMMARIZE`) appeared as literal visible text after clicking "Back to Chat" | `loadHistory` (used on page load) didn't strip the marker the way `sendMessage` (used for live replies) did | Updated `loadHistory` to clean the marker from loaded messages and reset `readyToSummarize` based on the last message |

### Q&A

**Q: Why generate a separate "Requirements Summary" step instead of going straight from chat to Scrum plan?**
A: It gives the user a checkpoint to catch and correct AI misunderstandings before they cascade into a full backlog. It also gives the next AI step (Scrum plan generation) a clean, structured input instead of a messy raw conversation.

**Q: What is `upsert` and why use it here?**
A: A database operation that updates an existing record or creates one if it doesn't exist. Used so regenerating a summary overwrites the old one instead of throwing a duplicate-key error.

**Q: Why did the AI stop reliably outputting the `READY_TO_SUMMARIZE` marker partway through testing?**
A: Long conversations can dilute a system prompt's instructions, especially when the user's messages pull the AI toward a different task (like sprint planning) that the prompt didn't explicitly forbid.

**Q: Why did the marker text show up as raw text on the page after navigating back to chat?**
A: React state resets on page reload, and the message-cleaning logic only existed in the "send new message" function, not the "load history" function — so messages loaded from the database were never cleaned.

**Q: How does Next.js know that `[projectId]` in a folder name is a variable and not a literal folder name?**
A: Square brackets are a special Next.js convention for dynamic route segments — any URL segment in that position gets captured and made available as a parameter (e.g., `params.projectId`) inside the route handler or page component.