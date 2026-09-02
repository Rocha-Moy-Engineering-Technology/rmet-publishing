# Development

## Mode

- `astro-static` provides fully prerendered static output served by an explicit production server.
- Static output has no application adapter and uses `serve` in production.
- The declared Hypertext Markup Language (HTML) and health routes follow the mode default.

## Commands

```sh
npm install
npm run dev
npm run test:generated
npm run build
npm run start
```

`npm run test:generated` runs formatting, linting, Astro checks, 100 percent unit coverage, build, integration tests, Behavior-Driven Development (BDD), end-to-end tests, and smoke tests.

## Source layout

- `logic/` holds pure functions only: post filtering and ordering, routing, tag counting, date formatting, reading time, citation formatting, Really Simple Syndication (RSS) and sitemap serialization, contact-address handling, and Giscus settings resolution. Nothing here performs input or output.
- `types/` holds contracts, including the ports `types/ports/post_repository.ts` and `types/ports/environment_reader.ts`.
- `state/adapters/outbound/` holds the production adapters: the content-collection repository and the environment reader.
- `state/adapters/inbound/` is the Astro `srcDir`. It holds `content.config.ts`, the Markdown content, layouts, components, and pages.

Unit tests cover `logic/` at 100 percent branch, function, line, and statement coverage. Adapters are covered by the integration, BDD, end-to-end, and smoke suites.

## Content

- From the agent root, `rmet_publishing.py` creates, lists, publishes, unpublishes, opens, and deletes those files (`create --title "…"`, `list`, `publish` / `unpublish` / `open` / `delete` with a title or slug).
- Pieces live in `state/adapters/inbound/content/posts/` as Markdown or MDX with front matter. The collection glob is `**/*.{md,mdx}`.
- One collection holds every piece; there is no kind or category. The file name becomes the slug and the address is `/writings/<slug>`.
- `abstract`, `doi`, and `pdfUrl` are optional per piece. A piece carrying them renders an abstract panel, a citation block, and a Portable Document Format (PDF) link; a piece without them renders plain.
- `draft: true` excludes a piece from every listing, the feed, the sitemap, and the generated routes.
- `PUBLIC_CONTENT_DIR` overrides the content directory at build time. The browser suites use it to build from `tests/fixtures/content` so no fixture is ever published.

## Presentation

- Dark is the default theme; the toggle switches to light and stores the choice under `rmet-theme`. The root element carries `data-theme` and, in light mode, the `light` class.
- Type is Barlow Condensed for display, navigation and labels, Barlow for body copy, both loaded from Google Fonts with a system fallback stack.
- Design tokens and the component classes (`display`, `label`, `nav-link`, `entry`, `chip`, `prose`) live in `state/adapters/inbound/styles/global.css`.

## Environment

Copy `.env.example` to `.env` and fill in the values.

- `PUBLIC_SITE_URL` is the public address of the deployment. It sets `site` in `astro.config.mjs` and drives canonical links, the feed, and the sitemap. Without it the build falls back to the default in `logic/site/site_config.ts`.
- `PUBLIC_CONTACT_EMAIL` overrides the contact address. The address is split into parts at build time and assembled by a small browser script, so it does not appear whole in the page source.
- `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, and `PUBLIC_GISCUS_CATEGORY_ID` switch on comments and reactions. All four are required; if any is missing the comment section renders a panel explaining how to enable them.

## Comments and reactions

1. Enable Discussions on the GitHub repository.
2. Install the giscus GitHub App on that repository.
3. Generate the four values at `https://giscus.app` and set them as `PUBLIC_GISCUS_*` variables in the deployment environment.

Comment threads map to discussions by the piece address, for example `papers/paper-template`. The reaction bar on each discussion is the like mechanism. The theme toggle retunes the embedded thread through a `postMessage` call.

## Browser test suites

The BDD, end-to-end, and smoke suites drive a real browser and capture full-page screenshots.

- `ASTRO_SCREENSHOT_DIR` must be an absolute path; screenshots are written under `<directory>/astro-static/`.
- The suites use the installed Google Chrome by default. Set `PLAYWRIGHT_CHROMIUM_PATH` to an executable to run them against another Chromium build, for example in a container that has no Chrome channel.

## Base path

The site is deployed as a GitHub Pages project page, so every address is served
under `/rmet-publishing`. The base path is a build input, never a hard-coded
value.

- `PUBLIC_BASE_PATH` sets it. It is unset locally, so development and the test suites run at the root.
- `astro.config.mjs` passes it through `astroBase` from `logic/site/base_path.ts`, which also feeds Astro's own asset rewriting.
- Templates never write an internal address directly. `siteHref` in `state/adapters/inbound/site_links.ts` prefixes the base, and `sitePath` strips it before a path is compared against the navigation. Addresses that are not site-internal, such as external links, mail links, and fragments, pass through untouched.
- `RMET-E2E-005` builds the site with the base path into a subdirectory, serves it the way Pages does, and checks that navigation, stylesheets, and the feed all resolve.

## Browser suite fixtures

The repository ships no content, so the browser suites build their own. `withBuiltRuntime` in `tests/support/runtime-server.ts` runs a build with `PUBLIC_CONTENT_DIR=tests/fixtures/content` (and optionally a base path) into `test-results/built-site`, serves it as a static host would, and tears both down. `withRuntime` serves the real production build, which exercises the empty state.

## Deployment to GitHub Pages

`.github/workflows/deploy-pages.yml` runs on every push to `main` and on manual dispatch.

1. It installs dependencies and the browser the suites need.
2. It runs `npm run test:generated`, uploading the captured screenshots as a workflow artifact.
3. It reads the Pages origin and base path from `actions/configure-pages` and builds with them.
4. It uploads `dist/` and deploys.

Repository configuration:

- Settings, Pages, Source must be set to GitHub Actions.
- Repository variables supply `PUBLIC_CONTACT_EMAIL` and the four `PUBLIC_GISCUS_*` values. They are public values, so variables rather than secrets are correct. A build with none of them set still succeeds.
- `state/adapters/inbound/public/` is the static asset directory; it holds `.nojekyll` and is the place for files referenced by `pdfUrl`.

There is no lock file in the repository, so the workflow runs `npm install`. Committing `package-lock.json` would make the dependency set reproducible and let the workflow cache it.

## Health

- `/health` is the only health endpoint.
- It returns HTTP 200 with `Content-Type: application/json` and exactly `{"status":"ok"}`.

## Railway

- Railway reads the Node engine and package scripts from `package.json`.
- Production binds `0.0.0.0` and consumes Railway's `PORT` environment variable.
- No `railway.json` is needed.
