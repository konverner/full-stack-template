# Full-Stack Template - Development

## Structure

The project is divided into frontend and backend parts. Each part has its own README with details:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

```
.
├── backend/                    # Backend source code
├── frontend/                   # Frontend source code
├── docker-compose.yml          # Docker Compose for local development and integration tests
├── .env                        # Environment variables for local development
├── .env.test                   # Environment variables for test environment
└── scripts/
    ├── build-push-deploy.sh    # Script to build, push and deploy the project
    ├── generate-client.sh      # Script to generate API client from OpenAPI spec
    └── integration-tests.sh    # Script to run integration tests
```

## Docker Compose

A single `docker-compose.yml` is used for both local development and integration tests. The environment is controlled via the env file:

- Local development: uses `.env`
- Integration tests: uses `.env.test` (passed via `--env-file .env.test`)

## Pre-commits and code linting

we are using a tool called pre-commit for code linting and formatting:

```bash
pre-commit run --all-files
```
