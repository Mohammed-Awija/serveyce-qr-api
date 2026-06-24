# ServeyceQr — API (NestJS)

Backend API for **ServeyceQr**, the first product of the **Serveyce** platform.

ServeyceQr is a QR-code-based service portal for hospitality operators: guests scan a QR
code in their room, browse services in their language, and submit requests; staff manage
those requests in real time.

The companion frontend repository is `serveyce-qr-web` (Next.js, deployed on Vercel).

> See [CLAUDE.md](./CLAUDE.md) for full project context, conventions, and architecture.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

Deployed to Railway. Pushes to `main` auto-deploy. See [CLAUDE.md](./CLAUDE.md) for the
build, pre-deploy, and start configuration.
