# Full-Stack Template - Development

## Structure

The project is divided into frontend and backend parts. Each part has its own README with details:

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)

## Docker Compose

TODO

## Local Development

## The .env file

The .env file is the one that contains all your configurations, generated keys and passwords, etc.

Depending on your workflow, you could want to exclude it from Git, for example if your project is public. In that case, you would have to make sure to set up a way for your CI tools to obtain it while building or deploying your project.

One way to do it could be to add each environment variable to your CI/CD system, and updating the docker-compose.yml file to read that specific env var instead of reading the .env file.

## Pre-commits and code linting

we are using a tool called pre-commit for code linting and formatting.

When you install it, it runs right before making a commit in git. This way it ensures that the code is consistent and formatted even before it is committed.
