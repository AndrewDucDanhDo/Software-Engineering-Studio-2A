# Backend API

## Prerequisite

[Install NodeJS](https://nodejs.org/en/download/package-manager/)

## Quick Start

All of these commands should be run in the `backend` directory

### The Manual Way

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy the example `.env` file and fill in the the `.env` file with your variables

   ```bash
   cp .env-example .env
   ```

3. Once the environment variables have been populated run the application

   ```bash
   # PROD
   npm run prod

   # DEV
   npm run dev
   ```

   When running in `dev` mode when changes are detected in the `src` folder the server will automatically be reloaded to reflect the changes.

### The Docker Way

1. Build the docker container

   ```bash
   docker build -t ses-2a-backend .
   ```

2. Run the container

   ```bash
   # PROD
   docker run -p 3000:3000 ses-2a-backend
   # DEV
   docker run -p 3000:3000 -v $(pwd):/app -e STAGE="dev" ses-2a-backend
   ```

   For the dev command this will mount your current directory to the /app directory in the container and run the dev command.
