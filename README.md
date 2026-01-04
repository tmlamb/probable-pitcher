# Probable Pitcher ⚾

Never miss a game. Subscribe to pitchers and get push notifications when they're scheduled to start.

---

## Features

- Morning notifications when your pitchers are starting
- Real-time lineup updates
- Cross-platform (iOS, Android, Web)

## Tech Stack

**Frontend:** Next.js, Expo, React Native, TailwindCSS
**Backend:** tRPC, PostgreSQL, Drizzle ORM
**Auth:** Better Auth (Google & Apple)
**Infrastructure:** GCP (GKE, Cloud SQL), Pulumi
**Tooling:** Turborepo monorepo, pnpm

## Project Structure

```
apps/
  ├── nextjs/     # Web application
  ├── expo/       # Mobile app (iOS/Android)
  └── ingest/     # Data ingestion & notifications
packages/
  ├── api/        # tRPC API
  ├── db/         # Database schema
  ├── auth/       # Authentication
  └── ui/         # Shared components
```

## License

MIT
