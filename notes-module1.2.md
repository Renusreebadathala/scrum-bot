
# 📝 Module 1.2 — Prisma Client setup with adapter + Project API routes

## Concepts Table

| Term | Plain English |
|---|---|
| Prisma Client | Auto-generated code that lets your app talk to the database without writing raw SQL |
| API route | A URL in your own app (e.g. `/api/projects`) that runs backend code when called |
| POST / GET | HTTP "verbs" — POST = send data to save, GET = request data back |
| Singleton pattern | Reusing one Prisma Client instance instead of creating a new one on every code reload |
| `directUrl` vs `url` | Two DB connection paths — direct (for migrations/single connections) vs pooled (for many app requests); you're using direct for both as a temporary workaround |
| Adapter (Prisma 7) | A required "translator" library telling Prisma how to talk to your specific database (Postgres here) — Prisma 7 removed the built-in engine |
| `tsc --noEmit` | Checks your whole project for TypeScript errors without building anything |

## Steps You Completed
1. Created `lib/prisma.ts` — reusable Prisma Client file
2. Ran `npx prisma generate` to fix missing Prisma Client module
3. Fixed `prisma.config.ts` — removed invalid `directUrl` property
4. Created `app/api/projects/route.ts` with POST (create) and GET (fetch all) handlers
5. Installed `@prisma/adapter-pg`, `pg`, `@types/pg` (Prisma 7 requires an explicit adapter)
6. Updated `lib/prisma.ts` to pass `PrismaPg` adapter into `PrismaClient`
7. Restarted dev server, tested POST → created a real Project in Supabase
8. Tested GET → confirmed the Project was retrievable
9. Committed and pushed to GitHub

## Errors + Fixes
| Error | Fix |
|---|---|
| `Cannot find module '../app/generated/prisma'` | Ran `npx prisma generate` |
| `'directUrl' does not exist` in config type | Removed/commented it out (Prisma 7 config only supports `url`) |
| `PrismaClientConstructorValidationError: requires "adapter"` | Installed `@prisma/adapter-pg` + `pg`, passed adapter into `PrismaClient` |

## Q&A
**Q: Why use a singleton pattern for Prisma Client in Next.js?**
A: Next.js hot-reloads code in development; without reusing one instance, you'd open a new DB connection every reload and could exhaust available connections.

**Q: What's the difference between a pooled and a direct database connection?**
A: Pooled connections share a limited set of reusable "lines" to the DB, ideal for many quick serverless requests. Direct connections open a dedicated line each time — needed for migrations, fine for light dev use.

**Q: Why did Prisma 7 require an "adapter" when earlier versions didn't?**
A: Prisma 7 removed its built-in database engine by default; you now explicitly provide an adapter (like `@prisma/adapter-pg`) telling it how to connect to your specific database type.

**Q: What does a POST vs GET request represent in a REST API?**
A: POST sends data to be created/saved; GET requests existing data without modifying anything.

**Q: Why validate `title` and `ideaText` before calling `prisma.project.create`?**
A: To fail fast with a clear `400` error instead of letting a bad/incomplete request hit the database and produce a confusing error.
