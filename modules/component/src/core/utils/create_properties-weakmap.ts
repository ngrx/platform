export interface GetPropsFn<O, P> {
  (ctx: O): P;
}

export interface SetPropsFn<O, P> {
  (ctx: O, props: Partial<P>): P;
}

export interface PropertiesWeakMap<O, P> {
  getProps: GetPropsFn<O, P>;
  setProps: SetPropsFn<O, P>;
}

/*
 * @description
 * A function creates a [WeakMaps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) that maintains a set of generic properties.
 * It provides a `getProps` and a `setProps` to maintain the properties per instance without mutating/touching the objects.
 * Furthermore the weakMpa (by design) holds no hard reference to the instances so the garbage collector will properly clean them up
 *
 * @param {(o: O) => P} getDefaults - A project function that returns the default values for the managed properties.
 * The argument `o` can be used to determine the default values based on the passed instance.
 * @returns A `PropertiesWeakMap` object.
 *
 * @usageNotes
 *
 * Main usage of the `PropertiesWeakMap` is to maintain a set of values for a (dynamic) instance
 * without mutation instance or overriding existing properties or that instance.
 * Also ensures we are not holding hard references to the managed properties.
 *
 * ```ts
 * export interface Properties {
 *   isCoalescing: boolean;
 * }
 *
 * const obj: object = {
 *   foo: 'bar',
 *   isCoalescing: 'original value'
 * };
 *
 * const getDefaults = (ctx: object): Properties => ({isCoalescing: false});
 * const propsMap = createPropertiesWeakMap<object, Properties>(getDefaults);
 *
 * console.log('obj before:', obj);
 * // {foo: "bar", isCoalescing: "original value"}
 * console.log('props before:', propsMap.getProps(obj));
 * // {isCoalescing: "weakMap version"}
 *
 * propsMap.setProps(obj, {isCoalescing: true});
 * console.log('obj after:', obj);
 * // {foo: "bar", isCoalescing: "original value"}
 * console.log('props after:', propsMap.getProps(obj));
 * // {isCoalescing: "true"}
 * ```
 */
export function createPropertiesWeakMap<O extends object, P extends object>(
  getDefaults: (o: O) => P
): PropertiesWeakMap<O, P> {
  type PropName = keyof O & string & symbol & number;

  const propertyMap = new WeakMap<O, P>();

  return {
    getProps,
    setProps,
  };

  function getProps(ctx: O): P {
    const defaults = getDefaults(ctx);
    const propertiesPresent: P | undefined = propertyMap.get(ctx);
    let properties: P;

    if (propertiesPresent !== undefined) {
      properties = propertiesPresent;
    } else {
      properties = {} as P;

      (Object.entries(defaults) as [PropName, P[PropName]][]).forEach(
        ([prop, defaultValue]): void => {
          properties[prop] = hasKey(ctx, prop) ? ctx[prop] : defaultValue;
        }
      );
      propertyMap.set(ctx, properties);
    }
    return properties;
  }

  function setProps(ctx: O, props: Partial<P>): P {
    const properties: P = getProps(ctx);
    (Object.entries(props) as [PropName, P[PropName]][]).forEach(
      ([prop, value]) => {
        properties[prop] = value;
      }
    );
    propertyMap.set(ctx, properties);
    return properties;
  }

  function hasKey(ctx: O, property: PropName): ctx is PropName {
    return ctx[property] != null;
  }
}
