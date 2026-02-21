import {
  EntityDefinition,
  Comparer,
  IdSelector,
  EntityAdapter,
  IdSelectorStr,
  IdSelectorNum,
} from './models';
import { createInitialStateFactory } from './entity_state';
import { createSelectorsFactory } from './state_selectors';
import { createSortedStateAdapter } from './sorted_state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';

/**
 * Creates an entity adapter with methods for managing collections of entities in state.
 *
 * @description
 * The entity adapter provides a set of predefined reducers and selectors for managing
 * normalized entity collections. It includes methods for adding, updating, removing,
 * and selecting entities from state.
 *
 * @template T - The entity type to be managed by the adapter
 *
 * @param options - Configuration options for the adapter
 * @param options.selectId - A function that selects the unique identifier from an entity.
 * Defaults to `(entity) => entity.id` if not provided.
 * @param options.sortComparer - A comparer function for sorting entities in state.
 * Set to `false` (default) to maintain insertion order, or provide a comparer function
 * to keep entities sorted.
 *
 * @returns An entity adapter containing methods for managing and selecting entity collections in state.
 *
 * @example
 * ```typescript
 * // Entity with default 'id' property
 * interface User {
 *   id: number;
 *   name: string;
 * }
 * const userAdapter = createEntityAdapter<User>();
 *
 * // Entity with custom id field
 * interface Book {
 *   isbn: string;
 *   title: string;
 * }
 * const bookAdapter = createEntityAdapter<Book>({
 *   selectId: (book) => book.isbn,
 * });
 *
 * // Entity with sorting
 * const sortedBookAdapter = createEntityAdapter<Book>({
 *   sortComparer: (a, b) => a.title.localeCompare(b.title),
 * });
 * ```
 */
export function createEntityAdapter<
  T extends { id: string | number },
>(options?: {
  sortComparer?: false | Comparer<T>;
}): EntityAdapter<T, T extends { id: infer U } ? U : never>;
export function createEntityAdapter<T>(options: {
  selectId: IdSelectorStr<T>;
  sortComparer?: false | Comparer<T>;
}): EntityAdapter<T, string>;
export function createEntityAdapter<T>(options: {
  selectId: IdSelectorNum<T>;
  sortComparer?: false | Comparer<T>;
}): EntityAdapter<T, number>;
export function createEntityAdapter<T>(): EntityAdapter<T>;
export function createEntityAdapter<T>(
  options: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
  } = {}
): EntityAdapter<T> {
  const { selectId, sortComparer }: EntityDefinition<T> = {
    selectId: options.selectId ?? ((entity: any) => entity.id),
    sortComparer: options.sortComparer ?? false,
  };

  const stateFactory = createInitialStateFactory<T>();
  const selectorsFactory = createSelectorsFactory<T>();
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, sortComparer)
    : createUnsortedStateAdapter(selectId);

  return {
    selectId,
    sortComparer,
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter,
  };
}
