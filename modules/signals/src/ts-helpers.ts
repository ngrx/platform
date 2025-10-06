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
