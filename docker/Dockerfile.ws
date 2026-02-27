FROM node:20-alpine
ARG DATABASE_URL

WORKDIR /app

RUN npm install -g pnpm

COPY ./packages ./packages
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json

COPY ./apps/ws-backend/ ./apps/ws-backend

RUN pnpm install
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter ws-backend run build
WORKDIR /app/apps/ws-backend
EXPOSE 5000

CMD [ "pnpm","run","start"]
