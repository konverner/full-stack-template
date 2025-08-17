# Full Stack Template

## Overview

This is a minimalist full-stack project template for applications with multi-user and multi-item features.

- Items have numerical, boolean, text attributes, as well as image and URL fields.
- Users have an avatar, username, email, and password.
- Users can perform CRUD operation with their items and view items created by other users.
- Items are displayed in a table on the `/items` page.
- Item details can be viewed on the `/items/{itemSlug}` page.

## Technology Stack

⚡ **FastAPI** for the Python backend API
  - **SQLAlchemy** for database interactions (ORM)
  - **Pydantic** for data validation and settings management
  - **PostgreSQL** as the database

🚀 **React** for the frontend
  - **Material UI** for frontend components
  - **OpenAPI-TS** for client generation
  - **Nginx** for serving the frontend and reverse proxy

## Run in docker

### 1. Configure environmnet variables

Rename `.env.example` to `.env` and set the variables.

### 2. Run

```
docker-compose up -d
```

Docs are available on `http://localhost/api/v1/docs`

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

Docs are available on `http://localhost/api/v1/docs`

## Credits

This template is inspired by:

- https://github.com/fastapi/full-stack-fastapi-template
- https://github.com/Netflix/dispatch/tree/main
- https://github.com/alan2207/bulletproof-react

## Sources

The following references were used:

- [Microsoft Learn: Best practices for RESTful web API design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [RFC 6749: The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7591: OAuth 2.0 Dynamic Registration](https://datatracker.ietf.org/doc/html/rfc7591)
