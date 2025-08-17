# Full-Stack Template - Frontend

## Overview

The frontend is written with TypeScript and the following modules:

- **React** for ??

- **Vite** for ??

- **Material UI** for UI/UX components

- **OpenAPI-TS** for client generation

- **Nginx** for serving the frontend and reverse proxy

## Development

You need to install npm on your machine. Once it is done, within the frontend directory, install the necessary NPM packages:

```bash
npm install
```

And start the live server with the following npm script:

```bash
npm run dev
```

## Generate client

We can generate TypeScript code for client automatically with OpenAPI specifications provided by FastAPI on our backend:

1. Set and install virtual environment of backend in `backend/venv`

2. From the project root, run the script:

```bash
./scripts/generate-client.sh
```

