# Convex Rate Limiter Demo

## Overview

A demonstration application showcasing the `@convex-dev/rate-limiter` package with two different rate limiting strategies: **Token Bucket** and **Fixed Window**. The app provides an interactive visualization of rate limiting behavior with real-time status updates and animated orbs representing consumed tokens.

## Tech Stack

- **Frontend**: Next.js 15.2.3, React 19, TypeScript 5
- **Backend**: Convex 1.27.0 (database, real-time subscriptions, server functions)
- **Rate Limiting**: @convex-dev/rate-limiter 0.2.13
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm 10.17.1
- **Linting**: ESLint 9 with Next.js config
- **Fonts**: Geist Sans & Geist Mono

## Repo Map

- `app/`: Next.js App Router pages and layouts
  - `page.tsx`: Main demo page with rate limiter visualizations
  - `layout.tsx`: Root layout with Convex provider
  - `globals.css`: Tailwind CSS imports and theme variables
- `components/`: React components
  - `ConvexClientProvider.tsx`: Convex React client setup
- `convex/`: Convex backend functions and configuration
  - `convex.config.ts`: App configuration with rate limiter middleware
  - `schema.ts`: Database schema (currently empty)
  - `bucket.ts`: Token bucket rate limiter implementation
  - `fixed.ts`: Fixed window rate limiter implementation
  - `_generated/`: Auto-generated Convex API types and server utilities

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.17.1+ (specified in package.json)
- Convex CLI (install with `npm install -g convex`)

### Installation

```bash
# Install dependencies
pnpm install
```

### Environment Variables

| Name                     | Required | Default | Description           | Referenced in                           |
| ------------------------ | -------- | ------- | --------------------- | --------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Yes      | -       | Convex deployment URL | `components/ConvexClientProvider.tsx:6` |

⚠️ **TODO**: Add `.env.example` file with safe example values

### Run

```bash
# Start both frontend and backend in parallel
pnpm dev

# Or run separately:
pnpm dev:frontend  # Next.js dev server (port 3000)
pnpm dev:backend   # Convex dev server
```

The app will be available at `http://localhost:3000` with hot reload enabled.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Lint & Format

```bash
# Run ESLint
pnpm lint

# Auto-fix ESLint issues
pnpm lint --fix
```

## License

This project is a demonstration of the `@convex-dev/rate-limiter` package. Check the package's license for usage terms.
