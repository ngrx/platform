export function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>;
}

export function uncapitalize<T extends string>(text: T): Uncapitalize<T> {
  return (text.charAt(0).toLowerCase() + text.substring(1)) as Uncapitalize<T>;
}

export function assertDefined<T>(
  value: T | null | undefined,
  name: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined.`);
  }
}
