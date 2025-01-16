########################
#         DEPS         #
########################

# Install dependencies only when needed
FROM node:23-alpine AS deps
RUN apk update
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /probable-pitcher

COPY packages/db ./packages/db
COPY tooling/prettier ./tooling/prettier
COPY tooling/eslint ./tooling/eslint
COPY tooling/typescript ./tooling/typescript

# Install dependencies based on the preferred package manager
COPY package.json  pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./turbo.json

RUN apk add --no-cache curl

RUN npm -g install pnpm@^9

RUN pnpm install --frozen-lockfile

########################
#        DB PUSH       #
########################

FROM deps AS db_push
USER root

ARG DATABASE_URL

WORKDIR /probable-pitcher/packages/db
CMD ["pnpm", "run", "push"]
