export function excludeKeys<
  Obj extends Record<string, unknown>,
  Keys extends string[]
>(obj: Obj, keys: Keys): Omit<Obj, Keys[number]> {
  return Object.keys(obj).reduce(
    (acc, key) => (keys.includes(key) ? acc : { ...acc, [key]: obj[key] }),
    {}
  ) as Omit<Obj, Keys[number]>;
}
