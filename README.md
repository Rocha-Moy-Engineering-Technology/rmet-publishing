# rmet-publishing

Astro 7.2 `astro-static` project for Railway with fully prerendered static output served by an explicit production server.

## Routes

- `/` and `/health`
- `/health` returns HTTP 200, `application/json`, and exactly `{"status":"ok"}`.

## Development

```sh
npm install
npm run dev
npm run test:generated
```

## Railway

Railway uses the Node engine and package scripts in `package.json`. The production start command binds `0.0.0.0` and reads Railway's `PORT` variable. No `railway.json` is required.

See `docs/md/DEVELOPMENT.md` for mode behavior and validation commands.
