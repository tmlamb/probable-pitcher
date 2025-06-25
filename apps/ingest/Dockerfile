########################
#        PRUNER        #
########################

FROM node:22-alpine AS pruner
RUN apk update

WORKDIR /probable-pitcher

RUN npm -g install turbo@^2

COPY . .

RUN turbo prune @probable/ingest --docker

########################
#        BUILDER       #
########################

FROM node:22-alpine AS builder
RUN apk update

RUN npm -g install pnpm@^10

WORKDIR /probable-pitcher

COPY --from=pruner /probable-pitcher/out/full/ .

RUN pnpm install

ARG INGEST_JOBS
ARG INGEST_DATE
ARG DATABASE_URL
ARG BASE_API_URL
ARG EXPO_API_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm build --filter @probable/ingest

########################
#        RUNNER        #
########################

FROM node:22-alpine AS runner

RUN apk update
RUN apk add curl

WORKDIR /probable-pitcher

RUN npm -g install tsx@^4

ENV NODE_ENV production

RUN addgroup --system --gid 1001 ingest
RUN adduser --system --uid 1001 ingest

COPY --from=builder /probable-pitcher/ .

USER ingest

ENTRYPOINT ["tsx", "apps/ingest/src/index.ts"]
