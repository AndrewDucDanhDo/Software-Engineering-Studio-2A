# Use the node js alipne image for a smaller container
FROM node:12.16-alpine

# This variable will control if the dev or prod script is run
ENV STAGE prod

# APPLICATION env vars
ENV API_PORT 4000

# Copy the local repo into the container and switch CWD
COPY ./ /app
WORKDIR /app

# Install application deps
RUN npm install

ENTRYPOINT npm run $STAGE

EXPOSE $API_PORT
