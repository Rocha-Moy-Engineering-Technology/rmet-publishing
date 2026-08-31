# Development

## Mode

- `astro-static` provides fully prerendered static output served by an explicit production server.
- Static output has no application adapter and uses `serve` in production.
- The declared HTML and health routes follow the mode default.

## Commands

```sh
npm install
npm run dev
npm run test:generated
npm run build
npm run start
```

`npm run test:generated` runs formatting, linting, Astro checks, 100 percent unit coverage, build, integration tests, Behavior-Driven Development (BDD), end-to-end tests, and smoke tests.

## Health

- `/health` is the only health endpoint.
- It returns HTTP 200 with `Content-Type: application/json` and exactly `{"status":"ok"}`.

## Railway

- Railway reads the Node engine and package scripts from `package.json`.
- Production binds `0.0.0.0` and consumes Railway's `PORT` environment variable.
- No `railway.json` is needed.
