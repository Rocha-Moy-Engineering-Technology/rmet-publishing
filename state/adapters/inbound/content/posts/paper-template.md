---
title: 'Paper template'
description: 'The front matter and structure a paper published here is expected to carry.'
kind: 'paper'
publishedAt: 2026-08-10
updatedAt: 2026-08-18
tags: ['Templates', 'Papers']
authors: ['Pedro Henrique Rocha Moy']
abstract: 'A worked example of the front matter and section structure used for papers on this site, including how the abstract, author list, citation block, and optional identifiers are rendered.'
---

This paper exists as a template. Copy it, replace the front matter, and write.

## 1. Front matter

A paper carries the same fields as any other piece — `title`, `description`,
`kind`, `publishedAt`, `tags`, `authors` — plus four that only papers use:

- `abstract` renders in a bordered panel above the body.
- `updatedAt` adds a revision date beside the publication date.
- `doi` replaces the page address in the citation block with a
  `https://doi.org/` link.
- `pdfUrl` adds a Portable Document Format (PDF) link beside the kind badge.

Set `draft: true` on anything that should stay out of the build entirely: drafts
are excluded from listings, the feed, the sitemap, and the generated routes.

## 2. Structure

Numbered sections are a convention rather than a requirement, but they make a
paper easier to cite in a comment thread. The body supports the usual Markdown:
headings, lists, block quotes, code blocks, and tables.

## 3. Citation

Every paper page renders a citation line built from the author list, the
publication year, the title, the site name, and either the Digital Object
Identifier (DOI) or the canonical address. Nothing needs to be written by hand.

## 4. Discussion

The comment section at the bottom of a paper is the same one every other piece
gets. For papers, it tends to be the more useful half of the page.
