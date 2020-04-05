# Backend API

## Prerequisite

* [Install NodeJS](https://nodejs.org/en/download/package-manager/)

* Copy the `.env.example` file and fill in the the `.env` file with your variables

   ```bash
   cp .env-example .env
   ```

* Create a file in the `backend` directory and name it `service-account-key.json`. Populate this created file with the firebase service account credentials (You can find these from the backend slack channel or in the secrets folder on teams)

## Quick Start

All of these commands should be run in the `backend` directory

### The Manual Way

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the application for prod or dev

   ```bash
   # PROD
   npm run prod

   # DEV
   npm run dev
   ```

   When running in `dev` mode when changes are detected in the `src` folder the server will automatically be reloaded to reflect the changes.

### The Docker Way

Make sure to follow the prerequisite steps above for setting the firebase service account key.

1. Build the docker container

   ```bash
   docker build -t ses-2a-backend .
   ```

2. Run the container

   ```bash
   # PROD
   docker run -p 4000:4000 ses-2a-backend
   # DEV
   docker run -p 4000:4000 -v $(pwd):/app -e STAGE="dev" ses-2a-backend
   ```

   For the dev command this will mount your current directory to the /app directory in the container and run the dev command.
