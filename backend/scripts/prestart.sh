#!/bin/bash
set -euo pipefail

# Wait for Postgres and create DB if missing (module)
python -m app.database.check

# Run migrations
alembic upgrade head

# Seed data
python -m app.database.seed
