import { EntityState } from './models';

export function getInitialEntityState<V>(): EntityState<V> {
  return {
    ids: [],
    entities: {},
  };
}

export function createInitialStateFactory<V>() {
  function getInitialState(): EntityState<V>;
  function getInitialState<S extends EntityState<V>>(
    additionalState: Omit<S, keyof EntityState<V>>
  ): S;
  function getInitialState(additionalState: any = {}): any {
    return Object.assign(getInitialEntityState(), additionalState);
  }

  return { getInitialState };
}
