export function getSourceForInstance<T>(instance: T): T {
  return Object.getPrototypeOf(instance);
}
