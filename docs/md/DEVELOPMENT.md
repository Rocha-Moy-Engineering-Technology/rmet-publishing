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

- `logic/` holds pure functions only: post filtering and ordering, routing, tag counting, date formatting, reading time, citation formatting, Really Simple Syndication (RSS) and sitemap serialization, contact-address handling, Giscus settings resolution, and subscription settings resolution. Nothing here performs input or output.
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
- The deploy gate starts with `prettier --check .`, which covers content posts. Files `rmet_publishing.py` writes pass as written; a hand-written body must pass too, so run `npm run format` before pushing.
- `PUBLIC_CONTENT_DIR` overrides the content directory at build time. The browser suites use it to build from `tests/fixtures/content` so no fixture is ever published.

## Presentation

- Dark is the default theme; the toggle switches to light and stores the choice under `rmet-theme`. The root element carries `data-theme` and, in light mode, the `light` class.
- Type is Barlow Condensed for display, navigation and labels, Barlow for body copy, both loaded from Google Fonts with a system fallback stack.
- Design tokens and the component classes (`display`, `label`, `nav-link`, `entry`, `chip`, `prose`) live in `state/adapters/inbound/styles/global.css`.

## Background media

The landing page, and only the landing page, carries a fixed video backdrop. `BackgroundVideo.astro` renders it, `logic/media/background_video.ts` holds every decision about it, and `state/adapters/outbound/media/background_media_files.ts` is the only part that reads the disk.

- The files live in `state/adapters/inbound/public/video/`: `background.webm` (VP9 video, Opus audio) and `background.mp4` (H.264 video, Advanced Audio Coding audio) are the two encodings, `background-poster.jpg` is the frame shown before playback, and `background-still-1.webp` through `background-still-9.webp` are the still frames. Whatever is present is used and nothing is required; with no files at all the backdrop is not rendered.
- The source clips are joined ahead of time with one-second crossfades. The file is _not_ folded end-over-start: the loop is the last join and the two players perform it, crossfading the end of the final clip into the start of the first over `BACKGROUND_JOIN_CROSSFADE_SECONDS`. Baking a fold into the file as well makes the file and the players dissolve at the same instant, over mismatched positions, and the picture visibly dips. The current backdrop is four clips, 43 seconds, encoded 1152 pixels wide at about 300 kilobits per second, which holds a desktop visit near two megabytes.
- Nothing is fetched declaratively. The markup carries `preload="none"`, no `autoplay`, and `data-src` rather than `src` on both the stills and the video sources. The script attaches the addresses and starts playback.
- Above `BACKGROUND_WIDE_VIEWPORT` (`(min-width: 768px)`) the script attaches the video. Below it the video is never touched and the two players are not displayed at all, so a narrow screen fetches no video bytes and the poster never blends into a still; it shows the stills instead and the sound control stays hidden. Each still is decoded before it shows, fades in over `BACKGROUND_STILL_FADE_SECONDS`, stands alone for `BACKGROUND_STILL_HOLD_SECONDS`, and then the next one dissolves in on top of it while it stays whole underneath. The stills sit in `.page-media-stills`, which wears the same `--media-opacity` and `--media-filter` as the video, so a dissolve mixes two whole images and never dips towards the page background.
- A portrait screen shows only a slice of each wide still. `BACKGROUND_STILL_FOCUS` names, per still file, the `object-position` that slice is centred on, so a subject standing off centre stays in view; a still not listed is centred (`BACKGROUND_STILL_DEFAULT_FOCUS`). The space station still (the clip's last frame before the crossfade, at 5.25 seconds) is `80% 50%` for the station body; the lunar lander still is `94% 50%` because the lander stands at the right of its frame; the lunar base still (the clip's close-up at 38.5 seconds) is `29% 50%` so Earth shows behind the dish.
- Two `video` elements alternate. `shouldHandOver` decides when the standby player takes over, `BACKGROUND_HANDOVER_SECONDS` before the end, so the loop never seeks back to zero and never stalls on the seek. That window is also the loop's crossfade, so it matches `BACKGROUND_JOIN_CROSSFADE_SECONDS` and the `opacity` transition on `.page-media-frame`; change one and change all three. `BACKGROUND_PLAYBACK_RATE` sets the speed.
- Sound ships off. The control in the corner unmutes, and it is revealed only once the video has started.
- `prefers-reduced-motion` holds the muted backdrop on a single frame and stops the stills from cycling.
- `PUBLIC_ASSETS_DIR` overrides the static asset directory at build time. The browser suites use it to build from `tests/fixtures/public`, so no suite ever loads the real media.
- The fixture clip `tests/fixtures/public/video/background.webm` is thirty seconds of silent VP9 and Opus made with `ffmpeg` from its `color` and `anullsrc` sources. It must stay far longer than `BACKGROUND_HANDOVER_SECONDS`: `RMET-E2E-007` drives the loop point itself and asserts on the standby player before the clip's own handover, and it fails on a clip shorter than ten handover windows.
- `RMET-E2E-007` covers a wide screen: two players, muted, not looping, fixed, playing, at the configured rate, with a sound control that unmutes. `RMET-E2E-008` covers a 390 by 844 screen: an active still, no `.webm` or `.mp4` request, an empty `currentSrc`, and a hidden sound control. `RMET-E2E-009` covers the still cycle on that screen: the treatment on the group, one still alone through the hold, the dissolve with the outgoing still whole underneath, then the next still alone. The hold is timed by the page itself: an init script records every still class change and finished opacity transition with `performance.now()`, and the test reads that timeline, so a poll interval never shortens the measured hold.

## Environment

Copy `.env.example` to `.env` and fill in the values.

- `PUBLIC_SITE_URL` is the public address of the deployment. It sets `site` in `astro.config.mjs` and drives canonical links, the feed, and the sitemap. Without it the build falls back to the default in `logic/site/site_config.ts`.
- `PUBLIC_CONTACT_EMAIL` overrides the contact address. The address is split into parts at build time and assembled by a small browser script, so it does not appear whole in the page source.
- `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, and `PUBLIC_GISCUS_CATEGORY_ID` switch on comments and reactions. All four are required; if any is missing the comment section renders a panel explaining how to enable them.
- `PUBLIC_SUBSCRIBE_ACTION` switches on the email subscription form. It must be an `https://` address; any other value fails the build with an error naming the variable, because a form that posts to a relative or plain-text address would ship silently broken. `PUBLIC_SUBSCRIBE_EMAIL_FIELD` names the field the provider reads the address under and defaults to `email`. Without the action the section renders a panel pointing at the feed.

## Comments and reactions

1. Enable Discussions on the GitHub repository.
2. Install the giscus GitHub App on that repository.
3. Generate the four values at `https://giscus.app` and set them as `PUBLIC_GISCUS_*` variables in the deployment environment.

Comment threads map to discussions by the piece address, for example `papers/paper-template`. The reaction bar on each discussion is the like mechanism. The theme toggle retunes the embedded thread through a `postMessage` call.

## Subscriptions

The site has no server, so notification rides on the feed: an RSS-to-email provider polls `/rss.xml` and emails every subscriber when a new item appears. The site only collects the address, and it never stores one, so unsubscribing is the provider's job: every email it sends carries an unsubscribe link, and the form promises exactly that.

1. Create a newsletter at a provider with an RSS-to-email feature and point that feature at `<PUBLIC_SITE_URL><PUBLIC_BASE_PATH>/rss.xml`. Buttondown is the recommended one: its automation checks the feed every thirty minutes, and every email carries a one-click unsubscribe link plus the `List-Unsubscribe` header mail clients surface as an Unsubscribe button.
2. Set `PUBLIC_SUBSCRIBE_ACTION` to the provider's form-post address (Buttondown: `https://buttondown.com/api/emails/embed-subscribe/<newsletter>`), and `PUBLIC_SUBSCRIBE_EMAIL_FIELD` when the provider reads a field other than `email` (Kit `email_address`, Mailchimp `EMAIL`).
3. Publish a piece. The feed carries it on the next build and the provider's next poll sends the email.

The feed carries each piece in full so the provider's template can send the whole piece (`item.content`) or only a teaser (`item.title`, `item.description`, `item.url`). `listRenderedPosts` in `state/adapters/outbound/content/post_content_repository.ts` renders every published body to HTML outside a page through Astro's container API: the glob loader pre-renders Markdown only, and an MDX body is a component tagged for the `astro:jsx` renderer, so the container is created once with `@astrojs/mdx/server.js` registered through `addServerRenderer`. `logic/feed/feed_links.ts` then rewrites every root-relative `href` and `src` to an absolute address carrying the site address and base path, because a relative link is dead once the body leaves the site, and `logic/feed/rss_feed.ts` writes the result escaped under `content:encoded` with the `content` namespace declared on the `rss` element. `RMET-UNIT-124` pins the serialization, `RMET-UNIT-220` to `RMET-UNIT-225` pin the link rewriting, `RMET-E2E-011` reads the built feed (escaped Markdown heading, evaluated MDX, absolute link), and `RMET-E2E-005` checks the link carries the base path.

`Subscribe.astro` renders the section on the landing page and on every piece page, before the comments. The form is plain HTML: `method="post"` to the action with one `type="email"` input named by the field variable, submitted in a new tab so the provider's confirmation page does not replace the piece. `logic/subscribe/subscribe_settings.ts` resolves the two variables. `RMET-BDD-006` builds with fixture variables, intercepts the post in the browser, and checks the address lands under the configured field; `RMET-E2E-010` covers the unconfigured panel on the production build; `RMET-SMOKE-002` checks the section is served beside the feed.

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

The repository ships no content, so the browser suites build their own. `withBuiltRuntime` in `tests/support/runtime-server.ts` runs a build with `PUBLIC_CONTENT_DIR=tests/fixtures/content` (and optionally `PUBLIC_ASSETS_DIR=tests/fixtures/public`, a base path, or the two `PUBLIC_SUBSCRIBE_*` values pointed at an address the suite intercepts) into `test-results/built-site`, serves it as a static host would, and tears both down. `withRuntime` serves the real production build, which exercises the empty state.

## Deployment to GitHub Pages

`.github/workflows/deploy-pages.yml` runs on every push to `main` and on manual dispatch.

1. It installs dependencies and the browser the suites need.
2. It runs `npm run test:generated`, uploading the captured screenshots as a workflow artifact.
3. It reads the Pages origin and base path from `actions/configure-pages` and builds with them.
4. It uploads `dist/` and deploys.

Repository configuration:

- Settings, Pages, Source must be set to GitHub Actions.
- Repository variables supply `PUBLIC_CONTACT_EMAIL`, the four `PUBLIC_GISCUS_*` values, and the two `PUBLIC_SUBSCRIBE_*` values. They are public values, so variables rather than secrets are correct. A build with none of them set still succeeds.
- `state/adapters/inbound/public/` is the static asset directory; it holds `.nojekyll` and is the place for files referenced by `pdfUrl`.

There is no lock file in the repository, so the workflow runs `npm install`. Committing `package-lock.json` would make the dependency set reproducible and let the workflow cache it.

## Health

- `/health` is the only health endpoint.
- It returns HTTP 200 with `Content-Type: application/json` and exactly `{"status":"ok"}`.

## Railway

- Railway reads the Node engine and package scripts from `package.json`.
- Production binds `0.0.0.0` and consumes Railway's `PORT` environment variable.
- No `railway.json` is needed.
