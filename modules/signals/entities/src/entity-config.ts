import { SelectEntityId } from './models';

export function entityConfig<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
  selectId: SelectEntityId<NoInfer<Entity>>;
}): typeof config;
export function entityConfig<Entity>(config: {
  entity: Entity;
  selectId: SelectEntityId<NoInfer<Entity>>;
}): typeof config;
export function entityConfig<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): typeof config;
export function entityConfig<Entity>(config: { entity: Entity }): typeof config;
/**
 * @description
 *
 * Creates a custom entity configuration and ensures strong typing.
 * Allows defining named entity collections and a custom id selector.
 *
 * @usageNotes
 *
 * ```ts
 * import { signalStore, type } from '@ngrx/signals';
 * import { addEntity, entityConfig, withEntities } from '@ngrx/signals/entities';
 *
 * type Todo = { key: number; text: string };
 *
 * const todoConfig = entityConfig({
 *   entity: type<Todo>(),
 *   collection: 'todo',
 *   selectId: (todo) => todo.key,
 * });
 *
 * export const TodosStore = signalStore(
 *   // 👇 Adds `todoEntityMap`, `todoIds`, and `todoEntities` signals to the store.
 *   withEntities(todoConfig),
 *   withMethods((store) => ({
 *     addTodo(todo: Todo): void {
 *       patchState(store, addEntity(todo, todoConfig));
 *     },
 *   }))
 * );
 * ```
 */
export function entityConfig<Entity>(config: {
  entity: Entity;
  collection?: string;
  selectId?: SelectEntityId<Entity>;
}): typeof config {
  return config;
}
