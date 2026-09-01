import type { EnvironmentSnapshot } from '../../types/ports/environment_reader';

export function readSetting(
  environment: EnvironmentSnapshot,
  key: string
): string | undefined {
  const value = environment[key]?.trim();
  return value === undefined || value.length === 0 ? undefined : value;
}
