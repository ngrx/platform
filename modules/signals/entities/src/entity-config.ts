import { EntityId, SelectEntityId } from './models';

export function entityConfig<
  Entity,
  Collection extends string,
  Id extends EntityId
>(config: {
  entity: Entity;
  collection: Collection;
  selectId: SelectEntityId<NoInfer<Entity>, Id>;
}): typeof config;
export function entityConfig<Entity, Id extends EntityId>(config: {
  entity: Entity;
  selectId: SelectEntityId<NoInfer<Entity>, Id>;
}): typeof config;
export function entityConfig<Entity, Collection extends string>(config: {
  entity: Entity;
  collection: Collection;
}): typeof config;
export function entityConfig<Entity>(config: { entity: Entity }): typeof config;
export function entityConfig<Entity, Id extends EntityId>(config: {
  entity: Entity;
  collection?: string;
  selectId?: SelectEntityId<Entity, Id>;
}): typeof config {
  return config;
}
