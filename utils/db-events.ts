let version = 0;
const listeners = new Set<(v: number) => void>();

export const getDatabaseVersion = () => version;

export const subscribeDatabaseVersion = (
  listener: (v: number) => void
): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const bumpDatabaseVersion = () => {
  version += 1;
  for (const listener of listeners) listener(version);
};
