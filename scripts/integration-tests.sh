#!/bin/bash
# integration-test.sh: Run backend integration tests in Docker
# Usage: ./integration-test.sh

set -euo pipefail

# Start test environment
echo "[1/3] Starting test environment..."
docker-compose --env-file .env.test -f docker-compose.test.yml up --build -d

# Run integration tests
echo "[2/3] Running integration tests..."
docker-compose --env-file .env.test -f docker-compose.test.yml exec backend pytest tests/integration

# Clean up
echo "[3/3] Cleaning up test environment..."
docker-compose --env-file .env.test -f docker-compose.test.yml down -v

echo "Integration tests completed."
