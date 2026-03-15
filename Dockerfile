FROM node:22.15.1-alpine AS builder

WORKDIR /usr/src/app

# COPY ["package.json", "./"]
# RUN if [ ! -f package.json ]; then echo "ERROR: package.json missing"; exit 1; fi
COPY package*.json ./

RUN npm ci --only=production
RUN ls -la
COPY . /usr/src/app
RUN ls -la
RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

FROM node:lts-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/project-config ./project-config
COPY --from=builder /usr/src/app/.env ./

EXPOSE ${HTTP_PORT}

CMD [ "npm", "run", "start:prod" ]