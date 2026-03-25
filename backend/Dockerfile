FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*


# Copy pyproject.toml and install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy app code
COPY ./app ./app
COPY ./scripts ./scripts
COPY ./alembic ./alembic
COPY ./alembic.ini ./alembic.ini

# Expose port
EXPOSE 8080

# Run the app
CMD ["python", "-m", "app.main"]
