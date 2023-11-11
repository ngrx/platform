export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type IsUnknownRecord<T> = string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;
