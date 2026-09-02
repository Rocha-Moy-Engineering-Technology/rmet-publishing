# rmet-publishing

An Astro 7.2 static site for publishing writing, with reader comments and
reactions through GitHub Discussions.

## Routes

- `/` the landing page: identity, the resume link, and every published piece newest first
- `/writings/<slug>` a single piece (`/writings` redirects to `/`)
- `/tags`, `/tags/<tag>` subject indexes
- `/contact` email and profile links
- `/rss.xml`, `/sitemap.xml` syndication
- `/health` returns HTTP 200, `application/json`, and exactly `{"status":"ok"}`

The resume sits in two places: a `RESUME` entry in the header, beside the GitHub
and LinkedIn icons, and a call to action under the name on the landing page.

## Publishing a piece

From the agent root, `rmet_publishing.py` creates, lists, publishes,
unpublishes, opens, and deletes pieces:

```sh
rmet_publishing.py create --title "Latency notes"
rmet_publishing.py list
rmet_publishing.py publish latency-notes
rmet_publishing.py unpublish "Latency notes"
rmet_publishing.py open latency-notes
rmet_publishing.py delete latency-notes
```

`create` writes `state/adapters/inbound/content/posts/<slug>.md` with
`draft: true`. Pass `--format mdx` for an MDX file. The file name is the
`/writings/<slug>` address. The script prints the full path and opens the file
with `code`. `publish` / `unpublish` / `open` / `delete` take a title or a
slug. `list` shows every piece, draft and published. Set `draft: false` (or
pass `--publish` on create, or run `publish`) when the piece should appear on
the next build.

You can also add a Markdown or MDX file under
`state/adapters/inbound/content/posts/` by hand. Front matter:

```yaml
title: 'A title'
description: 'One sentence that appears in listings and the feed.'
publishedAt: 2026-09-01
updatedAt: 2026-09-08 # optional
tags: ['Agents'] # optional
draft: false # optional; drafts are excluded from the build
authors: ['Pedro Henrique Rocha Moy'] # optional
abstract: 'Optional; renders in a panel above the body.'
doi: '10.1000/example' # optional; adds a citation block
pdfUrl: '/papers/example.pdf' # optional; file lives in the public directory
canonicalUrl: 'https://elsewhere.example/x' # optional
```

Every piece uses the same shape. A piece carrying an abstract, a Digital Object
Identifier (DOI), or a Portable Document Format (PDF) link renders those extras;
one without them renders as a plain piece.

## Background video

The landing page plays a video behind the content, fixed while you scroll and
silent until you turn the sound on with the control in the corner. Screens
narrower than 768 pixels never fetch the video; they cycle through still frames
instead, with no sound control at all.

The files go in `state/adapters/inbound/public/video/`:

- `background.webm` and `background.mp4` — the same clip in both encodings
- `background-poster.jpg` — the frame shown before playback starts
- `background-still-1.webp` … `background-still-9.webp` — the frames a narrow
  screen cycles through

Any of them may be missing, and with none of them present the backdrop simply
does not render. Join and encode the clips before they land here: the file is
expected to loop seamlessly on its own, and its weight is paid on every visit.
`docs/md/DEVELOPMENT.md` covers the rest.

## Development

```sh
npm install
npm run dev
npm run test:generated
```

## Configuration

Copy `.env.example` and fill it in. `PUBLIC_SITE_URL` sets the address used for
canonical links, the feed, and the sitemap. `PUBLIC_CONTACT_EMAIL` overrides the
contact address. The four `PUBLIC_GISCUS_*` values switch on comments and
reactions; without them each piece shows a short panel explaining how to enable
them. `PUBLIC_BASE_PATH` sets the subpath the site is served from.

## GitHub Pages

`.github/workflows/deploy-pages.yml` validates, builds, and publishes on every
push to `main`, and can be run by hand from the Actions tab. The site is served
as a project page at `https://<owner>.github.io/rmet-publishing/`, so the build
carries a base path.

Enable it once:

1. Settings, Pages, Source: GitHub Actions. The workflow also asks GitHub to
   enable Pages on its first run, so this is usually already done for you.
2. Settings, Secrets and variables, Actions, Variables: add `PUBLIC_GISCUS_REPO`,
   `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`,
   and optionally `PUBLIC_CONTACT_EMAIL`. The build succeeds without them.
3. Push to `main`.

The workflow reads the address and base path from the Pages configuration, so
nothing about the URL is hard-coded. Building locally with a base path is the
same thing by hand:

```sh
PUBLIC_SITE_URL=https://example.github.io PUBLIC_BASE_PATH=/rmet-publishing npm run build
```

## Railway

Railway uses the Node engine and package scripts in `package.json`. The
production start command binds `0.0.0.0` and reads Railway's `PORT` variable. No
`railway.json` is required.

See `docs/md/DEVELOPMENT.md` for the source layout, validation commands, and
Giscus setup.
