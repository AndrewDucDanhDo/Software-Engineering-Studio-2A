# Software-Engineering-Studio-2A

[Original Quirk readme](./doc/README.original.md)

## Prerequisite for dev environment

- [Download and install NodeJs](https://nodejs.org/en/download/package-manager/)
- [Download and install docker community edition](https://docs.docker.com/install/)

## Build and run the docker container

There is a [`dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml) to make setting up and running the dev environment easier.

1. Build the container

   ```bash
   docker-compose build
   ```

2. Run the container

   ```bash
   docker-compose up
   ```

3. Your container should now be available at <http://127.0.0.1:8080>.

Since the local repo is mounted in the container any changes to the repos `src` folder will rebuild the application and should be available after a refresh on the webpage without the container needing to be rebuilt.

If changes are made to any of the docker files please follow the below commands to rebuild the container so that the changes are refelcted.

```bash
docker-compose down
docker-compose build
docker-compose up
```

## Run the repo manually

If you want to run the application manually you can follow these steps.

1. Install node modules

   ```bash
   npm run install
   ```

2. Watch and build output files and serve `out` directory

   ```bash
   npm run watch & npm run start
   ```

3. Application should now be server on <http://127.0.0.1:8080>
