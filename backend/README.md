# Backend API

## Prerequisite

[Install NodeJS](https://nodejs.org/en/download/package-manager/)

## Quick Start

All of these commands should be run in the `backend` directory

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
   npm run start

   # DEV
   npm run dev
   ```

   When running in `dev` mode when changes are detected in the `src` folder the server will automatically be reloaded to reflect the changes.
