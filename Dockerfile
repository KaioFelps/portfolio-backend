FROM node:22 AS build-step

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma/ ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22 AS prod

WORKDIR /app

COPY --from=build-step /app/dist ./dist/
COPY --from=build-step /app/prisma ./prisma/
COPY --from=build-step /app/package-lock.json /app/package.json ./
COPY --from=build-step /app/run.sh ./

EXPOSE 80

RUN useradd -m server
RUN chown -R server:server /app
RUN chmod 755 /app
RUN chmod +x /app/run.sh

USER server

ENTRYPOINT [ "./run.sh" ]
