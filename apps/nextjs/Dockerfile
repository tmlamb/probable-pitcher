########################
#        PRUNER        #
########################

FROM node:22-alpine AS pruner
RUN apk update

WORKDIR /probable-pitcher

RUN npm -g install turbo@^2

COPY . .

RUN turbo prune @probable/nextjs --docker

########################
#        BUILDER       #
########################

FROM node:22-alpine AS builder
RUN apk update

RUN npm -g install pnpm@^10

WORKDIR /probable-pitcher

COPY --from=pruner /probable-pitcher/out/full/ .

RUN pnpm install

ARG DATABASE_URL
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_APPLE_ID
ARG AUTH_APPLE_SECRET
ARG AUTH_APPLE_WEB_ID
ARG AUTH_APPLE_WEB_SECRET
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ENV CI=1

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build --filter @probable/nextjs

########################
#        RUNNER        #
########################

# Production image, copy all the files and run next
FROM node:22-alpine AS runner

RUN apk update
RUN apk add curl

WORKDIR /probable-pitcher

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /probable-pitcher/apps/nextjs/next.config.js ./apps/nextjs/next.config.js
COPY --from=builder /probable-pitcher/apps/nextjs/package.json ./apps/nextjs/package.json
COPY --from=builder /probable-pitcher/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /probable-pitcher/apps/nextjs/.next/standalone ./apps/nextjs/
COPY --from=builder --chown=nextjs:nodejs /probable-pitcher/apps/nextjs/.next/static ./apps/nextjs/apps/nextjs/.next/static
COPY --from=builder --chown=nextjs:nodejs /probable-pitcher/apps/nextjs/public ./apps/nextjs/apps/nextjs/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/nextjs/apps/nextjs/server.js"]
