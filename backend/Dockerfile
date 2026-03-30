FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev curl && rm -rf /var/lib/apt/lists/*


# Copy pyproject.toml and install dependencies
COPY pyproject.toml .
# Install with dev dependencies for testing
RUN pip install --no-cache-dir ".[dev]"

# Copy app code
COPY ./app ./app
COPY ./scripts ./scripts
COPY ./alembic ./alembic
COPY ./alembic.ini ./alembic.ini

# Copy tests
COPY ./tests ./tests

# Expose port
EXPOSE 8080

# Run the app
CMD ["python", "-m", "app.main"]
