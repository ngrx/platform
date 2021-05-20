export function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substr(1)) as Capitalize<T>;
}

export function isDictionary(arg: unknown): arg is Record<string, unknown> {
  return (
    typeof arg === 'object' &&
    arg !== null &&
    !Array.isArray(arg) &&
    !(arg instanceof Date)
  );
}
