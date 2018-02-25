import { EntityState, EntityStateAdapter } from './models';

export enum DidMutate {
  EntitiesOnly,
  EntitiesAndIds,
  SelectedIdsOnly,
  All,
  None,
}

export function createStateOperator<V, R>(
  mutator: (arg: R, state: EntityState<V>) => DidMutate
): EntityState<V>;
export function createStateOperator<V, R>(
  mutator: (arg: any, state: any) => DidMutate
): any {
  return function operation<S extends EntityState<V>>(arg: R, state: any): S {
    const clonedEntityState: EntityState<V> = {
      selectedIds: new Set(state.selectedIds),
      ids: [...state.ids],
      entities: { ...state.entities },
    };
    const didMutate = mutator(arg, clonedEntityState);
    switch (didMutate) {
      case DidMutate.EntitiesOnly:
        return <S>{
          ...state,
          entities: clonedEntityState.entities,
        };
      case DidMutate.SelectedIdsOnly:
        return <S>{
          ...state,
          selectedIds: clonedEntityState.selectedIds,
        };

      case DidMutate.EntitiesAndIds:
        return <S>{
          ...state,
          entities: clonedEntityState.entities,
          ids: clonedEntityState.ids,
        };
      case DidMutate.All:
        return <S>Object.assign({}, state, clonedEntityState);
    }

    return state;
  };
}
