import { EntityState } from './models';

export function getInitialEntityState<V>(): EntityState<V> {
  return {
    ids: [],
    entities: {},
    selectedIds: new Set(),
  };
}

export function createInitialStateFactory<V>() {
  function getInitialState(): EntityState<V>;
  function getInitialState<S extends object>(
    additionalState: S
  ): EntityState<V> & S;
  function getInitialState(additionalState: any = {}): any {
    return { ...getInitialEntityState(), ...additionalState };
  }

  return { getInitialState };
}
