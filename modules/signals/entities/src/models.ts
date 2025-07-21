import { Signal } from '@angular/core';

/**
 * @public
 */
export type EntityId = string | number;

/**
 * @public
 */
export type EntityMap<Entity> = Record<EntityId, Entity>;

/**
 * @public
 */
export type EntityState<Entity> = {
  entityMap: EntityMap<Entity>;
  ids: EntityId[];
};

/**
 * @public
 */
export type NamedEntityState<Entity, Collection extends string> = {
  [K in keyof EntityState<Entity> as `${Collection}${Capitalize<K>}`]: EntityState<Entity>[K];
};

/**
 * @public
 */
export type EntityProps<Entity> = {
  entities: Signal<Entity[]>;
};

/**
 * @public
 */
export type NamedEntityProps<Entity, Collection extends string> = {
  [K in keyof EntityProps<Entity> as `${Collection}${Capitalize<K>}`]: EntityProps<Entity>[K];
};

/**
 * @public
 */
export type SelectEntityId<Entity> = (entity: Entity) => EntityId;

/**
 * @public
 */
export type EntityPredicate<Entity> = (entity: Entity) => boolean;

/**
 * @public
 */
export type EntityChanges<Entity> =
  | Partial<Entity>
  | ((entity: Entity) => Partial<Entity>);

/**
 * @public
 */
export enum DidMutate {
  None,
  Entities,
  Both,
}
