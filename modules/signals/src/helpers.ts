export function excludeKeys<
  Obj extends Record<string, unknown>,
  Keys extends string[]
>(obj: Obj, keys: Keys): Omit<Obj, Keys[number]> {
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {}) as Omit<Obj, Keys[number]>;
}
