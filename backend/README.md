# Full-Stack Template - Backend

## Overview

This backend provides a modular FastAPI application skeleton featuring user management, authentication (JWT / OAuth2 password flow), and CRUD operations for items.

## Structure

High-level layout:

```
├── alembic/              # Database migration scripts
│   ├── versions/       # Individual migration files
│   ├── env.py          # Alembic environment configuration
│   └── script.py.mako  # Migration script template
├── scripts/
│   └── restart.sh  # Script to restart backend container (init database, apply migrations)
├── app
│   ├── auth/               # Authentication & authorization layer
│   │   ├── router.py       # /auth endpoints (token issuance, current user)
│   │   ├── schemas.py      # Pydantic models for auth requests/responses
│   │   ├── security.py     # Token creation/verification, password hashing utilities
│   │   └── service.py      # Auth business logic (validate user, create tokens)
│   ├── config.py           # Settings object (Pydantic BaseSettings -> env vars)
│   ├── database/
│   │   ├── seed.py         # Database seeding logic (create initial data)
│   │   └── core.py         # Engine/session creation & session dependency
│   ├── dependencies.py     # Cross-cutting FastAPI dependencies (get_db, get_current_user, etc.)
│   ├── items/
│   │   ├── models.py       # SQLAlchemy Item model(s)
│   │   ├── router.py       # /items endpoints
│   │   ├── schemas.py      # Pydantic item schemas
│   │   └── service.py      # Item business logic
│   ├── main.py             # FastAPI app factory / include routers / middleware
│   ├── models.py           # Shared or base models (if any)
│   ├── schemas.py          # Shared or base schemas (if any)
│   └── users/
│       ├── models.py       # SQLAlchemy User model
│       ├── router.py       # /users endpoints (register, list, profile)
│       ├── schemas.py      # User schemas
│       └── service.py      # User domain logic
├── alembic.ini             # Alembic configuration file
├── Dockerfile              # Backend image build
├── pyproject.toml          # Project metadata (editable install) + tooling (if configured)
├── requirements.txt        # Pinned runtime deps
└── tests
    ├── conftest.py         # Shared pytest fixtures (test client, db session override)
    ├── test_database.py    # DB layer tests
    ├── test_items.py       # Item feature tests
    └── test_users.py       # User feature tests
```

### Request Lifecycle (Typical Authenticated Endpoint)

1. Client sends HTTP request with Authorization: Bearer <JWT>
2. FastAPI router function is matched (/items/...)
3. Dependencies resolve (e.g., DB session, current user from token)
4. Router delegates to service layer for business logic
5. Service interacts with SQLAlchemy models via session
6. Domain objects converted to Pydantic response schema
7. Response serialized to JSON (OpenAPI-compliant)

### Layering & Responsibilities

- Router: HTTP shape only (validation via schemas, status codes)
- Service: Business rules, orchestration, error raising
- Model: Persistence mapping (SQLAlchemy ORM)
- Schema: External contract (input/output validation/serialization)
- Security: Token & password utilities (hashing, JWT encode/decode)
- Dependencies: Composable building blocks for routers

## Configuration

Configuration is centralized in `config.py` using Pydantic BaseSettings. Environment variables (see root `.env.example`) are loaded automatically.

Add new settings by extending the Settings class and referencing them via dependency injection or direct import of the singleton instance.

Alembic is configured to use the same database URI as the FastAPI application, defined in `app/config.py`. It automatically detects models that inherit from `app.models.Base`.


## Development Workflow

1. Backend environment: set virtual environment + install deps (from /backend).
    ```
    python -m venv venv
    source venv/bin/activate
    pip install --no-cache-dir -r requirements.txt
    ```
2. Frontend environment: install all npm deps (from /frontend):
   ```
   npm install
   ```
3. Branch: create feature branch (e.g. feature/items-filtering).
4. On backend, implement:
   - models.py (data models)
   - schemas.py (http schemas)
   - service.py (business logic)
   - router.py (endpoints)
   - tests/test_<feature>.py (unit tests)
5. Generate a migration file:
   ```
   alembic revision -m "Add items filtering feature"
   ```
6. Implement upgrade and downgrade functions in the migration file (`alembic/versions/`) . For example
   ```python
   def upgrade() -> None:
        op.add_column('users', sa.Column('full_name', sa.String(length=255), nullable=True))
    
    def downgrade() -> None:
        op.drop_column('users', 'full_name')
    ```
7. Run unit tests:
   ```
   python -m pytest -q
   ```
8. Regenerate frontend client if schemas changed:
   ```
   sudo bash ./scripts/generate-client.sh
   ```
9. Now you can rebuild docker images and re-run the application:
   ```
   docker-compose up --build
   ```
   restart service will set, seed (if neede) database and run migrations from `/alembic/versions`


## Database Migrations and Seeding

The project uses Alembic for database migrations and a custom seeding script for initial data.

### Automatic Initialization

When running with Docker Compose, the `prestart` service automatically:
1. Runs `alembic upgrade head` to apply all pending migrations.
2. Runs `python -m app.database.seed` to seed the database with initial data (e.g., the first superuser).

This ensures the database is always up-to-date and has the necessary initial data whenever you run `docker-compose up`.

### Manual Migrations

If the containers are already running:

- **Generate a new migration**:
  ```bash
  docker-compose exec backend alembic revision --autogenerate -m "Add new field"
  ```

- **Apply migrations manually**:
  ```bash
  docker-compose exec backend alembic upgrade head
  ```

- **Seed data manually**:
  ```bash
  docker-compose exec backend python -m app.database.seed
  ```

### Local Development (without Docker)

1. Run migrations:
   ```bash
   alembic upgrade head
   ```
2. Seed data:
   ```bash
   python -m app.database.seed
   ```


## Error Handling

Raise `HTTPException` in router for explicit HTTP semantics. Prefer custom exception classes in service layer then translate to HTTP errors in router if domain-specific.

## Code Style & Conventions

- Keep router functions thin (< ~15 LOC ideally) with naming convention `{verb}_{subject}_{condition}`
- Service functions: single responsibility with naming convention `{verb}_{subject}_{condition}`
- Name Pydantic models with suffixes: <Entity>Create / <Entity>Update / <Entity>Read
- Prefer UTC timestamps
