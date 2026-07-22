## 📋 Module 3.5 Notes — Dashboard

### Concepts Table

| Term | Plain English Meaning |
|---|---|
| **Server Component** | Page code that runs on the server, before being sent to the browser. Default in Next.js. Can query the database directly, since credentials never leave the server. |
| **Client Component** | Marked with `"use client"` at the top of the file. Runs in the browser. Needed for interactivity — clicks, form input, `useState`. Cannot query the database directly. |
| **`useState`** | A React tool for storing values that change while using the page (e.g., what's typed into a form, whether something is loading). |
| **`useRouter`** | Lets code navigate to a new page programmatically (e.g., jump to the new project's chat page right after creating it). |
| **API route (`app/api/...`)** | A backend-only file that returns JSON, with no visual UI. Client Components must call these to reach the database. |
| **Dynamic route params (`[projectId]`)** | A folder name in square brackets becomes a URL variable. In this Next.js version, API routes receive it as a `Promise`, so it must be `await`ed before use. |

### Steps Completed

1. Replaced the default `app/page.tsx` starter page with a Dashboard (Server Component) that fetches and lists all projects via Prisma.
2. Built `NewProjectForm.tsx` as a separate Client Component, using `useState` for form fields and `useRouter` to redirect to the new project's chat page after creation.
3. Called the existing `POST /api/projects` route from the form.
4. Made each project card a `<Link>` to its own chat page.
5. Added a new `GET /api/projects/[projectId]` route to fetch a single project by ID.
6. Updated the chat page to fetch and display the project's title (via the new route) alongside the Project ID.

### Q&A

**Q: What's the difference between a Server Component and a Client Component in Next.js?**
A: Server Components run on the server and can query databases directly; they're the default. Client Components (marked `"use client"`) run in the browser and are needed for interactivity like forms and clicks, but must fetch data via API routes rather than querying the database directly, for security.

**Q: Why can't a Client Component talk to the database directly?**
A: The browser has no safe way to hold database credentials — anyone could inspect and steal them. API routes run server-side, keep secrets safe, and only return the specific data requested.

**Q: What does a folder like `app/api/projects/[projectId]` represent in Next.js App Router?**
A: A dynamic API route — `[projectId]` becomes a URL variable. A request to `/api/projects/abc123` matches this route with `projectId = "abc123"`.

**Q: In this app, what's the difference between a route under `app/api/...` and a route under `app/.../page.tsx`?**
A: Anything under `api/` returns raw JSON with no visual output — it's the data layer. Anything with a `page.tsx` file (outside `api/`) is a page the user actually sees rendered in the browser.

**Q: Why does the dashboard use a Server Component while the "New Project" form uses a Client Component?**
A: The dashboard just needs to read and display data, which a Server Component can do directly and efficiently. The form needs to respond to typing and clicking, which only runs in the browser — so it needs to be a Client Component.