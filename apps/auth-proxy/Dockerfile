FROM node:23-alpine AS base
RUN apk update

########################
#        PRUNER        #
########################

FROM base AS pruner

WORKDIR /probable-pitcher

RUN npm -g install turbo@^2

COPY . .

RUN turbo prune @probable/auth-proxy --docker

########################
#        BUILDER       #
########################

FROM base AS builder

RUN npm -g install pnpm@^9

WORKDIR /probable-pitcher

COPY --from=pruner /probable-pitcher/out/full/ .

RUN pnpm install

ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_APPLE_ID
ARG AUTH_APPLE_SECRET
ARG AUTH_SECRET
ARG AUTH_REDIRECT_PROXY_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm build --filter @probable/auth-proxy

########################
#        RUNNER        #
########################

FROM base AS runner

WORKDIR /probable-pitcher

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nitro

COPY --from=builder /probable-pitcher/ .
# COPY --from=builder /app/.output ./.output

USER nitro

EXPOSE 3012
ENV PORT 3012

# TODO: Remove disable warning in future node versions
CMD ["node", "--disable-warning=ExperimentalWarning", "apps/auth-proxy/.output/server/index.mjs"]
