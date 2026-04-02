# Full-Stack Template - Development

## Structure

The project is divided into frontend and backend parts. Each part has its own README with details:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Docker Compose

We use two Docker Compose files for different purposes:

- `docker-compose.yml` is used to run the service itself, together with the `.env` file for configuration.
- `docker-compose.test.yml` is used to run integration tests, together with the `.env.test` file for test-specific configuration.

## Pre-commits and code linting

we are using a tool called pre-commit for code linting and formatting:

```bash
pre-commit run --all-files
```
