export interface EmailParts {
  readonly user: string;
  readonly domain: string;
}

export function splitEmail(address: string): EmailParts | undefined {
  const parts = address.split('@');
  if (parts.length !== 2) return undefined;
  const [user, domain] = parts;
  if (user.length === 0 || domain.length === 0) return undefined;
  return { user, domain };
}

export function mailtoHref(address: string, subject?: string): string {
  const target = `mailto:${address}`;
  if (subject === undefined) return target;
  return `${target}?subject=${encodeURIComponent(subject)}`;
}
