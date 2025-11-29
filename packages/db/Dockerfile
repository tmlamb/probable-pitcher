########################
#         DEPS         #
########################

# Install dependencies only when needed
FROM node:22-alpine AS deps
RUN apk update
WORKDIR /probable-pitcher

COPY packages/db ./packages/db
COPY tooling/prettier ./tooling/prettier
COPY tooling/eslint ./tooling/eslint
COPY tooling/typescript ./tooling/typescript

# Install dependencies based on the preferred package manager
COPY package.json  pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./turbo.json

RUN apk add --no-cache curl

RUN npm -g install pnpm@^10

RUN pnpm install

########################
#        DB PUSH       #
########################

FROM deps AS db_push
USER root

ARG DATABASE_URL

RUN apk add --no-cache postgresql-client

WORKDIR /probable-pitcher/packages/db

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
