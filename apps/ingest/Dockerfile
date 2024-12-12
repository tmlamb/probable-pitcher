########################
#        PRUNER        #
########################

FROM node:23-alpine AS pruner
# RUN apk add --no-cache libc6-compat openssl
RUN apk update

WORKDIR /probable-pitcher

RUN npm -g install turbo@^2

COPY . .

#RUN turbo prune --scope=@probable/ingest --docker
RUN turbo prune @probable/ingest --docker

########################
#        BUILDER       #
########################

FROM node:23-alpine AS builder
# RUN apk add --no-cache libc6-compat openssl
RUN apk update

RUN npm -g install pnpm@^9

WORKDIR /probable-pitcher

#COPY .gitignore .gitignore
#COPY turbo.json turbo.json
# COPY tsconfig.json tsconfig.json
# COPY patches/ patches/
# COPY types/ types/
#COPY --from=pruner /probable-pitcher/out/pnpm-lock.yaml ./pnpm-lock.yaml
#COPY --from=pruner /probable-pitcher/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /probable-pitcher/out/full/ .

RUN pnpm install

ARG INGEST_JOBS
ARG DATABASE_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm build --filter @probable/ingest

########################
#        RUNNER        #
########################

FROM node:23-alpine AS runner
WORKDIR /probable-pitcher

ENV NODE_ENV production

RUN addgroup --system --gid 1001 ingest
RUN adduser --system --uid 1001 ingest
RUN apk add --no-cache curl

COPY --from=builder /probable-pitcher/ .
# COPY --from=builder /probable-pitcher/apps/ingest/package.json ./apps/ingest/package.json
# COPY --from=builder /probable-pitcher/apps/ingest/node_modules ./apps/ingest/node_modules
# COPY --from=builder /probable-pitcher/packages ./packages
# COPY --from=builder /probable-pitcher/package.json ./package.json
# COPY --from=builder /probable-pitcher/node_modules ./node_modules

# COPY --from=builder --chown=ingest:ingest /probable-pitcher/apps/ingest/dist/ ./apps/ingest/

USER ingest

# TODO: Remove disable warning in future node versions
ENTRYPOINT ["node", "--disable-warning=ExperimentalWarning", "apps/ingest/dist/index.js"]
