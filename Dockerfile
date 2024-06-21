FROM node:18 as base

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./.swcrc ./
COPY prisma/ ./prisma/
COPY src ./src

RUN mkdir -p public/images
RUN chmod -R 755 public

RUN npm install -g pnpm

RUN pnpm install

RUN npx prisma generate

ENV NODE_ENV production

ENV PORT 8080
ENV HOST 0.0.0.0

EXPOSE 8080

CMD ["pnpm", "run", "start"]
