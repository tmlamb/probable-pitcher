########################
#        PRUNER        #
########################

FROM node:23-alpine AS pruner
RUN apk update

WORKDIR /probable-pitcher

RUN npm -g install turbo@^2

COPY . .

RUN turbo prune @probable/integration --docker

########################
#        TESTER        #
########################

FROM node:23-alpine AS tester
RUN apk update

RUN npm -g install pnpm@^9

WORKDIR /probable-pitcher

COPY --from=pruner /probable-pitcher/out/full/ .

RUN pnpm install

ENV CI=1

CMD pnpm run test || exit 1
