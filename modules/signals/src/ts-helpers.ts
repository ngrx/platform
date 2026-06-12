type NonRecord =
  | Iterable<any>
  | WeakSet<any>
  | WeakMap<any, any>
  | Promise<any>
  | Date
  | Error
  | RegExp
  | ArrayBuffer
  | DataView
  | Function;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type IsRecord<T> = T extends object
  ? T extends NonRecord
    ? false
    : true
  : false;

export type IsUnknownRecord<T> = keyof T extends never
  ? true
  : string extends keyof T
    ? true
    : symbol extends keyof T
      ? true
      : number extends keyof T
        ? true
        : false;

export type IsKnownRecord<T> =
  IsRecord<T> extends true
    ? IsUnknownRecord<T> extends true
      ? false
      : true
    : false;

export type OmitPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

/**
 * Converts a tuple of types into an intersection of those types. For example, `TupleToIntersection<[A, B, C]>` will result in `A & B & C`.
 * This is useful for combining multiple types into a single type that has all the properties of the original types.
 * 
 * @template T - A tuple of types to be converted into an intersection.
 * @returns An intersection of the types in the tuple.
 */
export type TupleToIntersection<T extends any[]> = {
  [I in keyof T]: (x: T[I]) => void 
}[number] extends (x: infer I) => void 
    ? I 
    : never;
