# Module 0.1 — Repository & Environment Setup
**Status:** ✅ Complete | **Live URL:** https://ai-scrum-bot.vercel.app/ | **Repo:** [scrum-bot](https://github.com/Renusreebadathala/scrum-bot)

---

## 1. Goal

Set up the foundation for ScrumBot: an app that runs locally, is backed up on GitHub, and is deployed live on Vercel.

**Pipeline:** `Localhost (dev) → GitHub (backup) → Vercel (live)`

---

## 2. Key Concepts

| Tool | What it does | Why it's needed |
|---|---|---|
| **Next.js** | Framework combining frontend + backend in one project | Deploys natively to Vercel; built-in routing & API routes; no separate backend server needed |
| **Node.js / NPM** | Runs JS outside the browser / downloads code packages | Required to build and run any Next.js app |
| **Git** | Tracks changes to code over time | Every `commit` is a labeled snapshot I can go back to |
| **GitHub** | Cloud storage for my Git repo | Backup + version history + portfolio employers can view |
| **Localhost** | My computer acting as a server (`localhost:3000`) | Fast, private way to test before anything goes live |
| **Vercel** | Hosting platform, built by the Next.js team | Auto-deploys every time I push to GitHub |
| **.env.local** | File storing secret keys, kept out of GitHub | Prevents API keys/passwords from being exposed publicly |
| **Supabase** | Cloud database | Keeps data (users, projects) safe even if my laptop dies |

**Analogy:** Next.js is a full car (engine + frame); plain React is just the frame.

---

## 3. What I Did (Steps)

1. **Verified tools:** Node v20.20.2 ✅, GitHub account ✅, VS Code ✅
2. **Created the project:**
   ```bash
   npx create-next-app@latest scrum-bot --typescript --tailwind --app --eslint
   ```
3. **Opened in VS Code:** `code .`
4. **Ran it locally:** `npm run dev` → confirmed at `localhost:3000`
5. **Created GitHub repo** `scrum-bot` (public, with README + .gitignore)
6. **Renamed local folder** to match repo name (`agile-ai-platform` → `scrum-bot`)
7. **Connected & pushed to GitHub:**
   ```bash
   git remote add origin https://github.com/Renusreebadathala/scrum-bot.git
   git add .
   git commit -m "Initial Next.js setup"
   git branch -M main
   git push -u origin main
   ```
8. **Deployed to Vercel:** imported repo from GitHub → Deploy → got live URL

---


## 4. Daily Git Workflow (going forward)

```bash
git status              # see what changed
git add .                # stage changes
git commit -m "message"  # save snapshot
git push                 # upload to GitHub
```

## 5. Interview-Ready Answers

**Why Next.js?**
> Combines frontend and backend in one project, deploys natively to Vercel, and has built-in routing/API support — faster to ship than wiring React + a separate backend.

**Why environment variables?**
> Secrets (API keys) live in `.env.local`, which is excluded from Git via `.gitignore`. This keeps credentials out of the public GitHub repo. The same values are added separately in the Vercel dashboard for production.

**Local vs. Vercel?**
> Localhost is for fast, private testing during development. Vercel is the always-on public deployment — every GitHub push auto-triggers a new deployment.

**Why does folder/repo naming matter?**
> Mismatched names cause confusion later (for me and any collaborator). I hit this firsthand — fixed it by renaming the local folder to match the repo.

---


## 6. Next Module

**Module 1.1 — Database Schema (Prisma):** design tables (Project, Epic, Story, etc.) and connect Supabase via Prisma.