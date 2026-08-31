const HEALTH_PAYLOAD = { status: 'ok' } as const;

export function serializeHealth(): string {
  return JSON.stringify(HEALTH_PAYLOAD);
}
