FROM node:20-alpine3.19 AS base

ARG APP_PATH=/app
WORKDIR $APP_PATH

RUN npm install -g pnpm@9
RUN apk add --no-cache python3 make g++

COPY package.json $APP_PATH/package.json
COPY pnpm-lock.yaml $APP_PATH/pnpm-lock.yaml
COPY pnpm-workspace.yaml $APP_PATH/pnpm-workspace.yaml
COPY packages $APP_PATH/packages

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm build:server
RUN pnpm build:webapp
RUN mkdir -p $APP_PATH/packages/server/static
RUN cp -R $APP_PATH/packages/webapp/dist/static/. $APP_PATH/packages/server/static/
RUN cp $APP_PATH/packages/webapp/dist/index.html $APP_PATH/packages/server/view/index.html
RUN pnpm --filter=server --prod deploy /app/prod-server

FROM node:20-alpine3.19 AS runner

ARG APP_PATH=/app
ENV NODE_ENV=production
WORKDIR $APP_PATH/packages/server

COPY --from=base /app/prod-server $APP_PATH/packages/server
COPY --from=base $APP_PATH/packages/server/dist $APP_PATH/packages/server/dist
COPY --from=base $APP_PATH/packages/server/resources $APP_PATH/packages/server/resources
COPY --from=base $APP_PATH/packages/server/static $APP_PATH/packages/server/static
COPY --from=base $APP_PATH/packages/server/view $APP_PATH/packages/server/view
COPY --from=base $APP_PATH/packages/server/src $APP_PATH/packages/server/src
COPY --from=base $APP_PATH/packages/server/tsconfig.json $APP_PATH/packages/server/tsconfig.json

RUN test -f ./dist/main.js || test -f ./dist/src/main.js || test -f ./dist/packages/server/main.js

EXPOSE 8000 9157
CMD ["sh", "-c", "if [ -f ./dist/main.js ]; then node --enable-source-maps ./dist/main.js; elif [ -f ./dist/src/main.js ]; then node --enable-source-maps ./dist/src/main.js; else node --enable-source-maps ./dist/packages/server/main.js; fi"]
