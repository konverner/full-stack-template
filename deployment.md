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

Set the `ENVIRONMENT`, by default local (for development), but when deploying to a server you would put something like staging or production:

```
export ENVIRONMENT=prod
```

You can set several variables, like:

| Name                     | Description                                                                                                    | Example                        |
|--------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------|
| PROJECT_NAME             | The name of the project, used in the API for the docs and emails.                                              | full-stack-project                |
| SECRET_KEY               | The secret key for the FastAPI project, used to sign tokens.                                                   | s3cr3tK3yG3n3rat3d             |
| FIRST_SUPERUSER_USERNAME          | The username of the first superuser, this superuser will be the one that can create new users.                    | admin             |
| FIRST_SUPERUSER_PASSWORD | The password of the first superuser.                                                                           | strongpassword123              |
| PG_SERVER                | The hostname of the PostgreSQL server. Default is `db` for Docker Compose. Change only for third-party usage.  | db                             |
| PG_PORT                  | The port of the PostgreSQL server. Default is usually fine.                                                    | 5432                           |
| PG_PASSWORD              | The Postgres password.                                                                                         | postgrespassword               |
| PG_USER                  | The Postgres user, you can leave the default.                                                                  | postgres                       |
| PG_DB                    | The database name to use for this application. Default is `app`.                                               | app                            |


Deploy with Docker Compose

With the environment variables in place, you can deploy with Docker Compose:

```
docker compose -f docker-compose.yml up -d
```

You can use flag `--no-build` to avoid building images from local files and force Docker to pull images from remote repository.

## Continuous Deployment (CD)

You can use GitHub Actions to deploy your project automatically.

TODO
