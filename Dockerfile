# Use the node js alipne image for a smaller container
FROM node:12.16-alpine

# Copy the local repo into the container and switch CWD
COPY ./ /app
WORKDIR /app

# Install application deps
RUN npm install

# Start the 
ENTRYPOINT npm run watch & npm run start

EXPOSE 8080
