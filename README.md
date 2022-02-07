# USSF Portal CMS

## Local Development

- System requirements:
  - [direnv](https://direnv.net/docs/hook.html)
  - [Docker](https://www.docker.com/products/docker-desktop)
- Local environment variables (set in `.envrc.local`):
  - `SESSION_SECRET` (must be a string at least 32 chars)
  - `DATABASE_URL` (URL to a running Postgres instance)
- Build Docker image:
  - `docker build -t keystone .`
- Run Docker image:
  - `docker run -p 3000:3000 --env SESSION_SECRET=$SESSION_SECRET --env DATABASE_URL=$DATABASE_URL keystone`
