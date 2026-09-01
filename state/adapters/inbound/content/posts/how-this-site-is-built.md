---
title: 'How this site is built'
description: 'A static Astro site with a hexagonal source layout, one typed content collection, and no backend to run.'
kind: 'article'
publishedAt: 2026-08-25
tags: ['Astro', 'Engineering', 'Architecture']
authors: ['Pedro Henrique Rocha Moy']
---

This site publishes long-form writing and nothing else, so the architecture
question was mostly about what to leave out. The answer: no database, no
application server, no comment backend.

## Static output, explicit server

The site builds to static Hypertext Markup Language (HTML) with Astro. Every
route is prerendered at build time, and production serves the build directory
with a small static file server. A single `/health` endpoint returns
`{"status":"ok"}` so the platform can tell whether the process is alive.

Nothing renders per request, which means the only way to break a page in
production is to ship a broken build.

## One collection, three kinds

Blog posts, articles, and papers live in a single content collection with a
`kind` field rather than three separate collections. A paper carries extra front
matter — an abstract, authors, an optional Digital Object Identifier (DOI), an
optional Portable Document Format (PDF) link — and the paper template renders
those when they are present.

The advantage of one collection is that every listing, feed entry, sitemap
entry, and tag page is built from the same shape. Adding a fourth kind later is a
change in one map, not a fourth copy of the same page.

## Where the code lives

The source is split three ways, and the split is enforced by where a file sits:

- `logic/` holds pure functions: filtering, ordering, routing, tag counting,
  date formatting, feed and sitemap serialization, citation formatting. No
  input, no output, no clock, no network.
- `state/adapters/` holds everything that touches the outside world: the content
  collection reader, the environment reader, and the pages and components
  themselves.
- `types/` holds the contracts, including the ports that the adapters implement.

The practical benefit is testing. The pure layer is unit tested to full branch
coverage in under a second, because there is nothing to mock. The adapters are
covered by integration, behavior, end-to-end, and smoke tests that run against a
real build served by the real production command.

## Comments without a backend

Comments and reactions come from GitHub Discussions through giscus. The page
embeds a script; the discussion thread lives in the repository. There is no
comment database to back up, no moderation queue to host, and no spam filter to
maintain — the trade-off being that commenters need a GitHub account.

If the four `PUBLIC_GISCUS_*` variables are unset, the comment section renders a
short explanation instead of an empty frame, so a fresh clone of the repository
still builds and still looks finished.
