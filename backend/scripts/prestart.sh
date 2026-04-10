#!/bin/bash
set -euo pipefail

echo "Running prestart.sh scripts..."

# Wait for Postgres and create DB if missing (module)
echo "Checking database connection and creating database if missing..."
python -m app.database.check

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Seed data
echo "Seeding database..."
python -m app.database.seed

echo "Prestart scripts completed successfully."
