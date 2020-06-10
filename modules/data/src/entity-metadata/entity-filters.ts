/**
 * Filters the `entities` array argument and returns the original `entities`,
 * or a new filtered array of entities.
 * NEVER mutate the original `entities` array itself.
 **/
export type EntityFilterFn<T> = (entities: T[], pattern?: any) => T[];

/**
 * Creates an {EntityFilterFn} that matches RegExp or RegExp string pattern
 * anywhere in any of the given props of an entity.
 * If pattern is a string, spaces are significant and ignores case.
 */
export function PropsFilterFnFactory<T = any>(
  props: (keyof T)[] = []
): EntityFilterFn<T> {
  if (props.length === 0) {
    // No properties -> nothing could match -> return unfiltered
    return (entities: T[], pattern: string) => entities;
  }

  return (entities: T[], pattern: string | RegExp) => {
    if (!entities) {
      return [];
    }

    const regExp =
      typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
    if (regExp) {
      const predicate = (e: any) => props.some((prop) => regExp.test(e[prop]));
      return entities.filter(predicate);
    }
    return entities;
  };
}
