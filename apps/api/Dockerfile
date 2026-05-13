FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY prisma/ prisma/
RUN npx prisma generate
COPY src/ src/
COPY tsconfig.json ./
COPY nest-cli.json ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY prisma/schema.prisma prisma/schema.prisma
ENV PORT=10000
ENV NODE_ENV=production
EXPOSE 10000
CMD ["node", "dist/main.js"]
