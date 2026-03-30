# 0.4.0

## Features

- replace Table component with DataGrid for better performance and built-in features like pagination, sorting, and filtering
- add posibility to filter items and users by categories and fuzzy text search
- add created_at fields to items and users tables in the UI
- use item id in api endpoints but slug in frontend routes for better SEO and user-friendly URLs
- use pyproject.toml intead of requirements.txt for dependency management and project metadata
- add integration tests run inside docker containers

## Fixes

- code style improvements and refactoring

# 0.3.0

## Features

- add locale support for frontend
- add a script for database seeding with mock data
- use GET for health check endpoint instead of HEAD
- set explicit pool limits and fail fast instead of letting requests pile up
- add datetime fields for filtering items and users by creation date

## Fixes

- convert DB routes to sync handlers to match a sync version of SQLAlchemy

# 0.2.0

## Features

- add alembic migration support
- add restart service for database init and seeding
- add project version information in health check endpoint
- rename environment names
- add a script for build and deploy
- add healthcheck for backend service
- add frontend and backend networks in docker compose

## Fixes

- hide backend ports
- minor code style improvements

# 0.1.0

Initial release :

- frontend, backend, postgres services
- simple crud operations on users and items
- authentication with JWT via username and password
