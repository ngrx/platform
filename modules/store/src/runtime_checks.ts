import { isDevMode, Provider } from '@angular/core';
import {
  stateSerializationCheckMetaReducer,
  actionSerializationCheckMetaReducer,
  immutabilityCheckMetaReducer,
} from './meta-reducers';
import { RuntimeChecks, MetaReducer } from './models';
import {
  _USER_RUNTIME_CHECKS,
  _ACTIVE_RUNTIME_CHECKS,
  META_REDUCERS,
} from './tokens';

export function createActiveRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): RuntimeChecks {
  if (isDevMode()) {
    if (runtimeChecks === undefined) {
      console.warn(
        '@ngrx/store: runtime checks are currently opt-in but will be the default in the next major version with the possibility to opt-out, see https://ngrx.io/guide/migration/v8 for more information.'
      );
    }
    return {
      strictStateSerializability: false,
      strictActionSerializability: false,
      strictImmutability: false,
      ...runtimeChecks,
    };
  }

  return {
    strictStateSerializability: false,
    strictActionSerializability: false,
    strictImmutability: false,
  };
}

export function createStateSerializationCheckMetaReducer({
  strictStateSerializability,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictStateSerializability
      ? stateSerializationCheckMetaReducer(reducer)
      : reducer;
}

export function createActionSerializationCheckMetaReducer({
  strictActionSerializability,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictActionSerializability
      ? actionSerializationCheckMetaReducer(reducer)
      : reducer;
}

export function createImmutabilityCheckMetaReducer({
  strictImmutability,
}: RuntimeChecks): MetaReducer {
  return reducer =>
    strictImmutability ? immutabilityCheckMetaReducer(reducer) : reducer;
}

export function provideRuntimeChecks(
  runtimeChecks?: Partial<RuntimeChecks>
): Provider[] {
  return [
    {
      provide: _USER_RUNTIME_CHECKS,
      useValue: runtimeChecks,
    },
    {
      provide: _ACTIVE_RUNTIME_CHECKS,
      deps: [_USER_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createStateSerializationCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createActionSerializationCheckMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [_ACTIVE_RUNTIME_CHECKS],
      useFactory: createImmutabilityCheckMetaReducer,
    },
  ];
}
