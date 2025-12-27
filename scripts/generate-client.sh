#! /usr/bin/env bash

set -e
set -x

# Load environment variables from .env (if present) and export them
set -a
[ -f .env ] && source .env
set +a

cd backend
source venv/bin/activate
python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > ../openapi.json
cd ..
mv openapi.json frontend/
cd frontend
npm run generate-client
npx biome format --write ./src/client
