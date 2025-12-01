# AGENTS.md

## Commands

- Build: `pnpm build` (Turbo across all workspaces)
- Lint: `pnpm lint` / `pnpm lint:fix`
- Typecheck: `pnpm typecheck`
- Test: `pnpm test` (all) or `pnpm -F @probable/integration test -- notifications.test.ts` (single)
- Format: `pnpm format:fix`
- Dev: `pnpm dev:next` / `pnpm dev:expo`

## Code Style

- Use `import type` for type-only imports, separate from value imports
- Import order: React/Next/Expo → third-party → @probable packages → relative imports
- Environment: Use `import { env } from '~/env'` instead of `process.env`
- TypeScript: Strict mode, no non-null assertions unless necessary
- Error handling: tRPC procedures with Zod validation, proper error formatting
- Components: cva for variants, cn() for className merging
- Naming: PascalCase components, camelCase functions/variables

## Conventions

- Workspaces: `@probable/package-name` pattern
- Database: Drizzle schema from `@probable/db`
- Auth: Better Auth with session-based tRPC procedures
- Testing: Vitest integration tests in `/tests/integration/`
