import { createSelector } from '@ngrx/store';
import {
  EntityDefinition,
  Comparer,
  IdSelector,
  EntityAdapter,
  IdSetter,
} from './models';
import { createInitialStateFactory } from './entity_state';
import { createSelectorsFactory } from './state_selectors';
import { createSortedStateAdapter } from './sorted_state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';
import { Update } from '@ngrx/entity';

export function createEntityAdapter<T>(
  options: {
    selectId?: IdSelector<T | Update<T>>;
    setId?: IdSetter<T>;
    sortComparer?: false | Comparer<T>;
  } = {}
): EntityAdapter<T> {
  const { selectId, setId, sortComparer }: EntityDefinition<T> = {
    sortComparer: false,
    selectId: (instance: any) => instance.id,
    setId: (id: string | number, instance: any) => ({ ...instance, id }),
    ...options,
  };

  const stateFactory = createInitialStateFactory<T>();
  const selectorsFactory = createSelectorsFactory<T>();
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, setId, sortComparer)
    : createUnsortedStateAdapter(selectId, setId);

  return {
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter,
  };
}
