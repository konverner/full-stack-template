# Full-Stack Template - Deployment

## Overview

You can deploy the project using Docker Compose to a remote server.

You can use CI/CD systems to deploy automatically, there are already configurations to do it with GitHub Actions.

## Preparation

Before deploy:

- Have a remote server ready and available.
- Configure the DNS records of your domain to point to the IP of the server you just created.
- Install and configure Docker on the remote server (Docker Engine, not Docker Desktop).

## Deploy

You need to set some environment variables first.

Set the `ENVIRONMENT`, by default `dev` (for local development), but when deploying to a server you would put `test` or `prod` (for production)`:

```
export ENVIRONMENT=prod
```

You can set several variables, like:

| Name                     | Description                                                                                                    | Example                        |
|--------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------|
| PROJECT_NAME             | The name of the project, used in the API for the docs and emails.                                              | full-stack-project                |
| PROJECT_VERSION          | The version of the project, used in the API for the docs and emails.                                           | 0.1.0                          |
| PROJECT_SLUG             | A slug version of the project name, used for paths and URLs.                                                   | full-stack-project                |
| FIRST_SUPERUSER_USERNAME          | The username of the first superuser, this superuser will be the one that can create new users.                    | admin             |
| FIRST_SUPERUSER_PASSWORD | The password of the first superuser.                                                                           | strongpassword123              |
| PG_HOST                | The hostname of the PostgreSQL server. Default is `db` for Docker Compose. Change only for third-party usage.  | db                             |
| PG_PORT                  | The port of the PostgreSQL server. Default is usually fine.                                                    | 5432                           |
| PG_PASSWORD              | The Postgres password.                                                                                         | postgrespassword               |
| PG_USER                  | The Postgres user, you can leave the default.                                                                  | postgres                       |
| PG_DB                    | The database name to use for this application. Default is `full_stack_template_db`.                                               | full_stack_template_db                            |
| SEED_MOCK_DATA           | Whether to seed the database with mock data.                                                                    | true                           |

The best practice is to have `.env` file for each environment, for example `.env.dev`, `.env.test` and `.env.prod`.

Deploy with Docker Compose

With the environment variables in place, you can deploy with Docker Compose:

```
docker-compose up -d
```

You can use flag `--no-build` to avoid building images from local files and force Docker to pull images from remote repository.

## Deployment script

You can also use the provided script to build, push and deploy the project: `scripts/build-push-deploy.sh`. For that, copy `.env` and `docker-compose.yml` on remote server.

The script performs the following steps:

1. **Environment Loading**: Loads variables from your `.env` file.
2. **Build**: Builds Docker images for both the frontend and backend using the `PROJECT_VERSION` or a custom `TAG`.
3. **Push**: Tags the images as both the specific version and `latest`, then pushes them to your configured Docker registry.
4. **Deploy**: Connects to the remote server via SSH (using `sshpass` for automated password entry).
5. **Update**: Navigate to the `DEPLOY_PATH` on the server, stops existing containers, pulls the new images using `DOCKER_IMAGE_BACKEND`, `DOCKER_IMAGE_FRONTEND`, and starts the services in detached mode.
6. **Verify**: Waits for 30 seconds and attempts to open the deployment URL in your local browser.

To run it, ensure your `.env` file has the deployment credentials and Docker image names configured.  You can pass path to .env file, for example if you have separate environments: `.env.test` and `.env.prod`:

```bash
source scripts/build-push-deploy.sh .env.prod
```

or

```bash
source scripts/build-push-deploy.sh
```

by default, the script is looking for `.env`

## Continuous Deployment (CD)

You can use GitHub Actions to deploy your project automatically.

TODO
