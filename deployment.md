# Full-Stack Template - Deployment

## Overview

You can deploy the project using Docker Compose to a remote server.

You can use CI/CD systems to deploy automatically, there are already configurations to do it with GitHub Actions.

## Preparation

Before deploy:

- Have a remote server ready and available.
- Configure the DNS records of your domain to point to the IP of the server you just created.
- Configure a wildcard subdomain for your domain, so that you can have multiple subdomains for different services, e.g. *.fastapi-project.example.com. This will be useful for accessing different components, like dashboard.fastapi-project.example.com, api.fastapi-project.example.com, traefik.fastapi-project.example.com, adminer.fastapi-project.example.com, etc. And also for staging, like dashboard.staging.fastapi-project.example.com, adminer.staging.fastapi-project.example.com, etc.
- Install and configure Docker on the remote server (Docker Engine, not Docker Desktop).


## Deploy

You need to set some environment variables first.

Set the ENVIRONMENT, by default local (for development), but when deploying to a server you would put something like staging or production:

```
export ENVIRONMENT=prod
```

You can set several variables, like:

    PROJECT_NAME: The name of the project, used in the API for the docs and emails.
    SECRET_KEY: The secret key for the FastAPI project, used to sign tokens.
    FIRST_SUPERUSER: The email of the first superuser, this superuser will be the one that can create new users.
    FIRST_SUPERUSER_PASSWORD: The password of the first superuser.
    
    PG_SERVER: The hostname of the PostgreSQL server. You can leave the default of db, provided by the same Docker Compose. You normally wouldn't need to change this unless you are using a third-party provider.
    PG_PORT: The port of the PostgreSQL server. You can leave the default. You normally wouldn't need to change this unless you are using a third-party provider.
    PG_PASSWORD: The Postgres password.
    PG_USER: The Postgres user, you can leave the default.
    PG_DB: The database name to use for this application. You can leave the default of app.
    ENVIRONMENT: 



GitHub Actions Environment Variables

There are some environment variables only used by GitHub Actions that you can configure:


Generate secret keys

Some environment variables in the .env file have a default value of changethis.

You have to change them with a secret key, to generate secret keys you can run the following command:

python -c "import secrets; print(secrets.token_urlsafe(32))"

Copy the content and use that as password / secret key. And run that again to generate another secure key.
Deploy with Docker Compose

With the environment variables in place, you can deploy with Docker Compose:

```
docker compose -f docker-compose.yml up -d
```

You can use flag `--no-build` to avoid building images from local files and force Docker to pull images from remote repository.

## Continuous Deployment (CD)

You can use GitHub Actions to deploy your project automatically. 😎

You can have multiple environment deployments.

There are already two environments configured, staging and production. 🚀
Install GitHub Actions Runner

    On your remote server, create a user for your GitHub Actions:

sudo adduser github

    Add Docker permissions to the github user:

sudo usermod -aG docker github

    Temporarily switch to the github user:

sudo su - github

    Go to the github user's home directory:

cd

    Install a GitHub Action self-hosted runner following the official guide.

    When asked about labels, add a label for the environment, e.g. production. You can also add labels later.

After installing, the guide would tell you to run a command to start the runner. Nevertheless, it would stop once you terminate that process or if your local connection to your server is lost.

To make sure it runs on startup and continues running, you can install it as a service. To do that, exit the github user and go back to the root user:

exit

After you do it, you will be on the previous user again. And you will be on the previous directory, belonging to that user.

Before being able to go the github user directory, you need to become the root user (you might already be):

sudo su

    As the root user, go to the actions-runner directory inside of the github user's home directory:

cd /home/github/actions-runner

    Install the self-hosted runner as a service with the user github:

./svc.sh install github

    Start the service:

./svc.sh start

    Check the status of the service:

./svc.sh status

You can read more about it in the official guide: Configuring the self-hosted runner application as a service.
Set Secrets

On your repository, configure secrets for the environment variables you need, the same ones described above, including SECRET_KEY, etc. Follow the official GitHub guide for setting repository secrets.

The current Github Actions workflows expect these secrets:

    DOMAIN_PRODUCTION
    DOMAIN_STAGING
    STACK_NAME_PRODUCTION
    STACK_NAME_STAGING
    EMAILS_FROM_EMAIL
    FIRST_SUPERUSER
    FIRST_SUPERUSER_PASSWORD
    POSTGRES_PASSWORD
    SECRET_KEY
    LATEST_CHANGES
    SMOKESHOW_AUTH_KEY

GitHub Action Deployment Workflows

There are GitHub Action workflows in the .github/workflows directory already configured for deploying to the environments (GitHub Actions runners with the labels):

    staging: after pushing (or merging) to the branch master.
    production: after publishing a release.

If you need to add extra environments you could use those as a starting point.
URLs

Replace fastapi-project.example.com with your domain.
Main Traefik Dashboard
