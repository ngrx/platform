export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type IsRecord<T> = T extends object
  ? T extends unknown[]
    ? false
    : T extends Set<unknown>
    ? false
    : T extends Map<unknown, unknown>
    ? false
    : T extends Function
    ? false
    : true
  : false;

export type IsUnknownRecord<T> = string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;

export type IsKnownRecord<T> = IsRecord<T> extends true
  ? IsUnknownRecord<T> extends true
    ? false
    : true
  : false;

export type OmitPrivate<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T extends []
  ? ReadonlyArray<DeepReadonly<T>>
  : T;
