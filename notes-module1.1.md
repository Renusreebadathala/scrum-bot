
# 📘 Module 1.1 Notes — Database Schema (Prisma)

## Concepts Table

| Term | Meaning |
|---|---|
| Database | Permanent storage that survives restarts/refreshes |
| Table | Spreadsheet-like structure: rows + columns, one data type per table |
| Prisma (ORM) | Translator between your code and the database; lets you query with TypeScript instead of raw SQL |
| Schema (`schema.prisma`) | Blueprint file defining your tables as "models" |
| Model | Prisma's code representation of one table |
| Migration | A saved, dated record of one structural database change; running it applies that change for real |
| Connection string | URL containing username, password, host, and database name needed to connect |
| Pooled vs Direct connection | Pooled (port 6543) shares limited connections efficiently for normal app use; Direct (port 5432) is a dedicated line, needed for migrations |
| `prisma.config.ts` | Newer (Prisma 7+) config file holding connection URLs, replacing the old in-schema `url`/`directUrl` |
| `.env` | File storing secrets (like DB password); git-ignored so it never reaches GitHub |
| URL-encoding | Replacing special characters (e.g. `@` → `%40`) so they aren't misread as URL structure |
| Relation | A link between two tables (e.g., a Story belongs to an Epic via `epicId`) |
| `@id` / `@default(cuid())` | Marks a field as the unique row identifier / auto-generates that ID |
| `@unique` | Ensures only one matching row can exist (e.g., one summary per project) |
| `Model[]` | Reverse relation — "this can have many of that" |
| `Model?` | Optional relation — "this might not exist yet" |

## Steps Completed

1. Created Supabase project (Postgres database)
2. Got pooled + direct connection strings from Supabase "Connect" panel
3. Installed `prisma` and `@prisma/client`, ran `npx prisma init`
4. Saved connection strings in `.env`, confirmed `.gitignore` protects it
5. Configured `prisma.config.ts` with `url` and `directUrl`
6. Fixed password containing `@` by URL-encoding it (`%40`)
7. Adapted to Prisma 7 (removed `url`/`directUrl` from `schema.prisma`, moved to `prisma.config.ts`)
8. Switched from pooled to direct connection for `url` after pooled connection kept hanging on this network
9. Created `Project` model → ran first migration (`init`)
10. Created `RequirementMessage` model (linked to Project) → migrated
11. Created `RequirementSummary` and `Epic` models (linked to Project) → prepped
12. Created `Story` model (linked to Epic) → ran final migration, all 5 tables live

## Errors + Fixes

| Error | Fix |
|---|---|
| `url`/`directUrl` not supported in schema files (P1012) | Moved both into `prisma.config.ts` instead (Prisma 7 change) |
| Real password pasted directly into `schema.prisma` | Moved to `.env`, referenced via `env()` in config — never committed to Git |
| Password contained `@`, breaking the connection string | URL-encoded it to `%40` |
| `npx prisma migrate dev` hung indefinitely on pooled connection (port 6543) | Pointed `url` to the direct connection (port 5432) instead |

## Q&A

**Q: What is Prisma and why use it instead of raw SQL?**
A: Prisma is an ORM — it lets you define database tables as code models and query them with type-safe, autocompleted TypeScript instead of writing raw SQL by hand, reducing typos and errors.

**Q: What's the difference between a pooled and a direct database connection?**
A: A pooled connection shares a limited number of connections efficiently across many simultaneous requests (good for a live app with lots of traffic). A direct connection is a dedicated line, required for migrations since they need reliable, exclusive access.

**Q: What does a Prisma migration actually do?**
A: It compares your schema file to the current database state, generates a `.sql` file describing the needed change, and applies that SQL to create/update real tables — while keeping a permanent history of every change made.

**Q: How do you model a one-to-many relationship in Prisma?**
A: The "many" side stores a foreign key field (e.g., `projectId` on `RequirementMessage`) plus a `@relation` pointing to the parent's `id`; the "one" side gets a reverse list field like `messages RequirementMessage[]`.

**Q: Why should database credentials never go into `schema.prisma` or `prisma.config.ts` directly?**
A: Those files get committed to Git and could be pushed to a public GitHub repo. Credentials belong in `.env`, which is git-ignored, and are referenced via `env("VAR_NAME")`.