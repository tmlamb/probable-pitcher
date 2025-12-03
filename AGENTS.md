# AGENTS.md

## Commands

- Build: `pnpm build` | Lint: `pnpm lint:fix` | Typecheck: `pnpm typecheck` | Format: `pnpm format:fix`
- Test: `pnpm test` (all) or `pnpm -F @probable/integration test -- notifications.test.ts` (single file)
- Dev: `pnpm dev:next` / `pnpm dev:expo` | DB: `pnpm db:push` / `pnpm db:studio`

## Code Style

- Imports: Use `import type` for types (separate statements). Order: React/Next/Expo → third-party → @probable → relative
- Environment: `import { env } from '~/env'` NOT `process.env`
- TypeScript: Strict mode, avoid non-null assertions
- Components: Use `cn()` for className merging, `cva` for variants
- Naming: PascalCase (components), camelCase (functions/variables)

## Conventions

- Workspaces: `@probable/package-name` | Database: Drizzle with snake_case
- Auth: Better Auth session-based | tRPC: Routers use `satisfies TRPCRouterRecord`
- Testing: Vitest in `/tests/integration/` | Validation: Zod schemas in tRPC procedures
