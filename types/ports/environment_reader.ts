export type EnvironmentSnapshot = Readonly<Record<string, string | undefined>>;

export interface EnvironmentReader {
  snapshot(): EnvironmentSnapshot;
}
