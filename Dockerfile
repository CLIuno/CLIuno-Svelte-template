FROM node:20-alpine

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["pnpm", "preview"]