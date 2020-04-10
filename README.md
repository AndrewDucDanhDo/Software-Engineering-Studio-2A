# Software-Engineering-Studio-2A

## Prerequisites

Follow the individual setup instructions in both the backend and frontend folders

## Quick Start Stack

Have docker installed on your machine and follow the prerequisites instructions above

1. Run the following command to run the app stack

   ```bash
   # PROD
   docker-compose -f ./docker/prod/docker-compose.yml up
   # DEV
   docker-compose -f ./docker/dev/docker-compose.yml up
   ```

   The fronted and backend should now both be running you can teardown the stack by running the same command but replacing the sub command `up` with `down`.

   If you run the above dev command the local `backend` folder will be mounted to the container and any updates will cause the api server to reload.
