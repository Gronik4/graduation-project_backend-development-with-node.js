FROM node:22.15.1-alpine

WORKDIR /app

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

FROM node:lts-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/project-config ./project-config
COPY --from=builder /app/.env ./

EXPOSE ${HTTP_PORT}

CMD [ "npm", "run", "start:prod" ]