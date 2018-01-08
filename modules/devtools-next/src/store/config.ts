import { InjectionToken } from '@angular/core';

export interface StoreDevtoolsConfig {
  toggleCommand: string;
  positionCommand: string;
  maxAge: number;
}

export const STORE_DEVTOOLS_CONFIG = new InjectionToken<
  Partial<StoreDevtoolsConfig>
>('@ngrx/devtools/store Config');

export function getConfig(
  partialConfig: Partial<StoreDevtoolsConfig>
): StoreDevtoolsConfig {
  return {
    ...partialConfig,
    toggleCommand: 'ctrl-h',
    positionCommand: 'ctrl-m',
    maxAge: 100,
  };
}
