import { EntityState, EntityStateAdapter } from './models';

export function createStateOperator<V, R>(
  mutator: (arg: R, state: EntityState<V>) => boolean
) {
  return function operation<S extends EntityState<V>>(arg: R, state: S): S {
    const clonedEntityState: EntityState<V> = {
      ids: [...state.ids],
      entities: { ...state.entities },
    };

    const didMutate = mutator(arg, clonedEntityState);

    if (didMutate) {
      return Object.assign({}, state, clonedEntityState);
    }

    return state;
  };
}
