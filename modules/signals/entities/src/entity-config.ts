import { SelectEntityId } from './models';

/**
 * @public
 */
export function entityConfig<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
  selectId: SelectEntityId<NoInfer<Entity>>;
}): typeof config;
/**
 * @public
 */
export function entityConfig<Entity>(config: {
  entity: Entity;
  selectId: SelectEntityId<NoInfer<Entity>>;
}): typeof config;
/**
 * @public
 */
export function entityConfig<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): typeof config;
/**
 * @public
 */
export function entityConfig<Entity>(config: { entity: Entity }): typeof config;
/**
 * @public
 */
export function entityConfig<Entity>(config: {
  entity: Entity;
  collection?: string;
  selectId?: SelectEntityId<Entity>;
}): typeof config {
  return config;
}
