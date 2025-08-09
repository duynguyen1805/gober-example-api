FROM node:20.18.1-alpine as build

WORKDIR /app

# Copying source files
COPY . .

RUN apk update && apk add --no-cache \
  build-base \
  python3 \
  py3-pip \
  git \
  openssh-client

RUN npm install -f

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
  make \
  g++ \
  && npm run build \
  && apk del build-dependencies

# Running the app
CMD [ "npm", "start" ]