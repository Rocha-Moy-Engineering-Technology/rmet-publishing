# rmet-publishing

An Astro 7.2 static site for publishing blogs, articles, and papers, with reader
comments and reactions through GitHub Discussions.

## Routes

- `/` home, `/writing` every published piece
- `/blog`, `/articles`, `/papers` one index per kind
- `/blog/<slug>`, `/articles/<slug>`, `/papers/<slug>` a single piece
- `/tags`, `/tags/<tag>` subject indexes
- `/contact` email and profile links
- `/rss.xml`, `/sitemap.xml` syndication
- `/health` returns HTTP 200, `application/json`, and exactly `{"status":"ok"}`

## Publishing a piece

Add a Markdown file under `state/adapters/inbound/content/posts/`. The file name
becomes the address slug. Front matter:

```yaml
title: 'A title'
description: 'One sentence that appears in listings and the feed.'
kind: 'blog' # blog | article | paper
publishedAt: 2026-09-01
updatedAt: 2026-09-08 # optional
tags: ['Agents'] # optional
draft: false # optional; drafts are excluded from the build
authors: ['Pedro Henrique Rocha Moy'] # optional
abstract: 'Papers only.' # optional
doi: '10.1000/example' # optional
pdfUrl: '/papers/example.pdf' # optional
canonicalUrl: 'https://elsewhere.example/x' # optional
```

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
them.

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
