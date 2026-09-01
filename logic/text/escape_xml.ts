const REPLACEMENTS: readonly (readonly [RegExp, string])[] = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&apos;'],
];

export function escapeXml(value: string): string {
  return REPLACEMENTS.reduce(
    (escaped, [pattern, replacement]) => escaped.replace(pattern, replacement),
    value
  );
}
