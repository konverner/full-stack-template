#!/bin/bash

set -e

# Run migrations
alembic upgrade head

# Seed data
python -m app.database.seed
