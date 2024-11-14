# this is for local development use only
# for production deployments see production.Dockerfile

FROM node:20-bullseye-slim

WORKDIR /usr/src/app
ARG version
ENV SENTRY_RELEASE ${version}
ENV SENTRY_IGNORE_API_RESOLUTION_ERROR 1

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --omit=dev 

ENV NODE_OPTIONS='-r next-logger'
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
