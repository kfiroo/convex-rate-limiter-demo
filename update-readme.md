# Cursor Task — Make the Repo LLM-Ready & Update README

**Role**: You are a senior software engineer and technical writer.
**Goal**: Analyze this repository and produce a **concise, accurate, and actionable** `README.md` that equips an LLM (and new contributors) to understand the project and make sensible changes without breaking things.

## What to do (high level)

1. **Inventory & map the repo**
   - Detect language(s), frameworks, package managers, monorepo layout, build tooling, test frameworks, linters/formatters, CI/CD, infrastructure-as-code, and any code generation.
   - Build a **Repo Map**: key packages/apps, entry points, important modules, and how they interact.

2. **Extract run/build instructions**
   - How to install, build, run locally, test, lint, format, type-check, and run in production.
   - Include exact commands (pnpm/npm/yarn/bun, make, taskfiles, docker compose, justfile, scripts).
   - Document **required environment variables** and where they’re read (paths & code refs). Provide safe examples; do **not** leak secrets.

3. **Describe architecture & data flow**
   - Components/services and their responsibilities.
   - Request/response or event flows (API routes, handlers, queues, webhooks, cron).
   - Persistence layers (DBs, ORMs, migrations, schemas), caches, third-party integrations.

4. **Document conventions that guide changes**
   - Coding standards, directory structure, naming conventions, commit style, branching, codegen steps.
   - Lint/type rules that often fail (and how to fix).
   - Where to add new features (canonical extension points).
   - How to add a new endpoint/command/component/module correctly.

5. **List invariants & safety rails**
   - Critical assumptions, validation layers, authz/authn boundaries, rate limits, tenancy/isolation rules, error handling, idempotency.
   - Things that commonly break (and how to avoid/regress-test).

6. **Summarize tests & quality gates**
   - How to run tests locally and in CI.
   - Notable test utilities, fixtures, coverage thresholds, and where to put new tests.

7. **Production & CI/CD**
   - Deploy paths (e.g., Vercel, ECS, Fly.io, Cloud Run, Kubernetes), build artifacts, envs, secrets management.
   - Rollback strategy and observability (logs, metrics, tracing) with where to find configs.

8. **Fill obvious gaps**
   - If the repo lacks scripts or docs for a common task (e.g., seeding DB), add a minimal script or doc snippet and reference it from the README.

## How to do it (tactics)

- Parse top-level manifests and config files to infer truth:
  - Example: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `poetry.lock`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Makefile`, `Taskfile.yml`, `Dockerfile*`, `docker-compose.*`, `Procfile`, `fly.toml`, `vercel.*`, `.github/workflows/*`, `cloudbuild.*`, `compose.yaml`, `app.json`, `render.yaml`, `supabase/config.toml`, `prisma/schema.prisma`, `drizzle.config.*`, `schema.sql`, `openapi.*`, `graphql/*.graphql`, `env.example`, `.env.*.example`, `tsconfig.*`, `eslint*`, `prettier*`, `vitest.config*`, `jest.config*`, `playwright.config*`.

- Cross-check scripts with actual code entry points (`src/index.*`, `server.*`, `pages/*`, `app/*`, `cmd/*`).
- If monorepo, document **each package/app** with a one-liner and primary commands.
- Keep README crisp: link to deeper docs if present; otherwise create short sections rather than long prose.
- **Never include real secret values.** If any `.env` with real values is found, **redact** and instruct the user to rotate.
- Prefer tables, bullet lists, and short code blocks over paragraphs.

## Output requirements

- Produce a **single PR-ready change** to `README.md` (create if missing).
- Use the following structure (omit sections that don’t apply; keep heading order):

```
# <Project Name>

## Overview
One-paragraph description + primary goals and users.

## Tech Stack
Languages, frameworks, package managers, build tools, CI/CD, infra.

## Repo Map
- apps/<name>: purpose
- packages/<name>: purpose
- key modules (with paths) and roles

## Getting Started
### Prerequisites
Versions of runtimes/CLIs.
### Installation
Exact commands.
### Environment Variables
Table: NAME | Required | Default | Description | Referenced in (path:line)
### Run
Local dev commands; how hot reload works; ports.
### Build
Build commands and artifacts.
### Test
Unit/e2e commands; common flags; coverage.
### Lint & Format
Commands and autofix tips.
### Type Checking
Commands and common pitfalls.

## Architecture
High-level diagram (ASCII or bullet flow) + responsibilities.

## Data & Integrations
DB/ORM/migrations; queues; external APIs; webhooks; auth flows.

## Adding Features Safely
Step-by-step cookbook for typical changes (e.g., “Add a new API route”, “Add a DB field & migration”, “Add a React component/page”).

## Conventions
Code style, naming, folder layout, commit/branching strategy, codegen.

## Invariants & Safety
Auth boundaries, multitenancy constraints, idempotency, rate limits, error handling contracts.

## Observability & Ops
Logs/metrics/traces, dashboards, feature flags, config toggles, tracing IDs.

## Deployment
How CI builds/releases; environments; manual vs. automated steps; rollback.

## Troubleshooting
Common errors and fixes (lint/types/build/runtime) with pointers to files.

## License
(If present) — include SPDX and link.

```

- Keep **Overview + Repo Map + Getting Started** at the top.
- Link to any existing `/docs` pages.
- Use relative file paths when referencing code.
- Where helpful, include short **“Why it’s this way”** notes to aid future refactors.

## Acceptance criteria

- ✅ `README.md` exists, formatted, and passes linters (markdown if applicable).
- ✅ Commands are verified against project scripts/configs.
- ✅ No secrets; any leaked examples are redacted with a rotation note.
- ✅ Monorepo packages/apps are briefly documented with their run/test commands.
- ✅ A new contributor (or LLM) can: install, run, test, and add a small feature following the README alone.

## Editing instructions

- Generate a **minimal diff** to `README.md`.
- If large changes: propose a short **Changelog** section at the bottom describing what you added.
- Emit an appropriate conventional commit message, e.g.:
  `docs(readme): make repo LLM-ready with architecture map, run/test/deploy guides`

## If information is missing

- Clearly mark with `⚠️ TODO` and a one-line question the maintainer can fill (keep these sparse and specific).
- Prefer reasoned inferences from config over leaving blanks.

---

**Now begin: scan the repository, infer details from manifests/configs, and update `README.md` accordingly following the structure above.**
