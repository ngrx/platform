import { Signal } from '@angular/core';

export type EntityId = string | number;

export type EntityMap<Entity> = Record<EntityId, Entity>;

export type EntityState<Entity> = {
  entityMap: EntityMap<Entity>;
  ids: EntityId[];
};

export type NamedEntityState<Entity, Collection extends string> = {
  [K in keyof EntityState<Entity> as `${Collection}${Capitalize<K>}`]: EntityState<Entity>[K];
};

export type EntityProps<Entity> = {
  entities: Signal<Entity[]>;
};

export type NamedEntityProps<Entity, Collection extends string> = {
  [K in keyof EntityProps<Entity> as `${Collection}${Capitalize<K>}`]: EntityProps<Entity>[K];
};

export type SelectEntityId<Entity> = (entity: Entity) => EntityId;

export type EntityPredicate<Entity> = (entity: Entity) => boolean;

export type EntityChanges<Entity> =
  | Partial<Entity>
  | ((entity: Entity) => Partial<Entity>);

export enum DidMutate {
  None,
  Entities,
  Both,
}
