export function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>;
}

export function uncapitalize<T extends string>(text: T): Uncapitalize<T> {
  return (text.charAt(0).toLowerCase() + text.substring(1)) as Uncapitalize<T>;
}
