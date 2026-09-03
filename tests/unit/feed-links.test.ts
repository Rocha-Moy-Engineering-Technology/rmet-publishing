import { describe, expect, test } from 'vitest';

import { absolutizeRootLinks } from '../../logic/feed/feed_links';

const resolve = (path: string): string => `https://example.org/base${path}`;

describe('absolutizing root-relative links in feed content', () => {
  test('RMET-UNIT-220 rewrites root-relative href and src attributes', () => {
    expect(
      absolutizeRootLinks(
        '<p><a href="/papers/x.pdf">paper</a> <img src="/images/y.png" alt=""></p>',
        resolve
      )
    ).toBe(
      '<p><a href="https://example.org/base/papers/x.pdf">paper</a> <img src="https://example.org/base/images/y.png" alt=""></p>'
    );
  });

  test('RMET-UNIT-221 leaves absolute, protocol-relative, fragment, mail, and relative addresses alone', () => {
    const html = [
      '<a href="https://elsewhere.example/x">a</a>',
      '<a href="//cdn.example/x.js">b</a>',
      '<a href="#section">c</a>',
      '<a href="mailto:x@example.org">d</a>',
      '<a href="nested/page">e</a>',
      '<img src="data:image/png;base64,AAAA" alt="">',
    ].join('');
    expect(absolutizeRootLinks(html, resolve)).toBe(html);
  });

  test('RMET-UNIT-222 ignores attributes that only end in href or src', () => {
    const html = '<div data-href="/x" data-src="/y">z</div>';
    expect(absolutizeRootLinks(html, resolve)).toBe(html);
  });

  test('RMET-UNIT-223 leaves an empty string and text without markup untouched', () => {
    expect(absolutizeRootLinks('', resolve)).toBe('');
    expect(absolutizeRootLinks('href="/x" is prose', resolve)).toBe(
      'href="/x" is prose'
    );
    expect(absolutizeRootLinks('a href="/x"', resolve)).toBe(
      `a href="${resolve('/x')}"`
    );
  });

  test('RMET-UNIT-224 rewrites every link in a long body in linear time', () => {
    const html =
      '<a href="/p">x</a><img src="https://a.example/i.png">\n'.repeat(50000);
    const startedAt = performance.now();
    const rewritten = absolutizeRootLinks(html, resolve);
    expect(performance.now() - startedAt).toBeLessThan(500);
    expect(rewritten.split('href="https://example.org/base/p"').length).toBe(
      50001
    );
    expect(rewritten).toContain('src="https://a.example/i.png"');
  });

  test('RMET-UNIT-225 keeps the root path itself and query strings intact', () => {
    expect(absolutizeRootLinks('<a href="/">home</a>', resolve)).toBe(
      '<a href="https://example.org/base/">home</a>'
    );
    expect(
      absolutizeRootLinks('<a href="/search?q=a&amp;b=c">q</a>', resolve)
    ).toBe('<a href="https://example.org/base/search?q=a&amp;b=c">q</a>');
  });
});
