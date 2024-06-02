export const NGRX_MODULE_PATHS = {
  ['component-store']: '@ngrx/component-store',
  effects: '@ngrx/effects',
  store: '@ngrx/store',
  operators: '@ngrx/operators',
} as const;

export type NGRX_MODULE = keyof typeof NGRX_MODULE_PATHS;
