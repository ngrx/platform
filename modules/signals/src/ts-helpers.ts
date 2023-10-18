export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type IsUnknownRecord<T> = string extends keyof T
  ? true
  : number extends keyof T
  ? true
  : false;

export type HasOptionalProps<T> = T extends Required<T> ? false : true;

export type HasFunctionKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: K extends keyof Function ? true : HasFunctionKeys<T[K]>;
    }[keyof T]
  : false;

export type HasNestedFunctionKeys<T> = {
  [K in keyof T]: HasFunctionKeys<T[K]>;
}[keyof T];
