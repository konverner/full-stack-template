# Full Stack Template

## Overview

This is a minimalist full-stack project template for applications with multi-user and multi-item features.

- Items have numerical, boolean, text attributes, as well as image and URL fields.
- Users have an avatar, name, email, and password.
- Users can create items and rate items created by other users.
- Items are displayed in a table on the `/items` page.
- Item details can be viewed on the `/items/{itemSlug}` page.

## Technology Stack

⚡ **FastAPI** for the Python backend API
  - **SQLAlchemy** for database interactions (ORM)
  - **Pydantic** for data validation and settings management
  - **PostgreSQL** as the database

🚀 **React** for the frontend
  - **Material UI** for frontend components
  - **Nginx** for serving the frontend and reverse proxy

## Run in docker

### 1. Configure environmnet variables

Rename `.env.example` to `.env` and set the variables.

### 2. Run

```
docker-compose up -d
```

## Run directly

### 1. Configure environmnet variables

Rename `.env.example` to `.env` and set the variables.

### 2. Frontend:

Install node modules: `npm install`

Run development server: `npm start`

Build: `npm build`

### 3. Backend

Install dependencies: `pip install -r requirements.txt`

Run a server: `python -m app.main`


## References

This template is inspired by:

- https://github.com/fastapi/full-stack-fastapi-template
- https://github.com/Netflix/dispatch/tree/main
- https://github.com/alan2207/bulletproof-react
