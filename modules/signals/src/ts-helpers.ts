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

/**
 * Makes all properties in T visible by intersecting with an empty object.
 *
 * @public
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Determines if T is a record type (object but not a special object type).
 *
 * @public
 */
export type IsRecord<T> = T extends object
  ? T extends NonRecord
    ? false
    : true
  : false;

/**
 * Determines if T is an unknown record type with unknown keys.
 *
 * @public
 */
export type IsUnknownRecord<T> = keyof T extends never
  ? true
  : string extends keyof T
  ? true
  : symbol extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;

/**
 * Determines if T is a known record type with known keys.
 *
 * @public
 */
export type IsKnownRecord<T> = IsRecord<T> extends true
  ? IsUnknownRecord<T> extends true
    ? false
    : true
  : false;

/**
 * Omits private properties (those starting with underscore) from T.
 *
 * @public
 */
export type OmitPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};
