import { Signal } from '@angular/core';

export type EntityId = string | number;

export type EntityMap<Entity, Id extends EntityId> = Record<Id, Entity>;

export type EntityState<Entity, Id extends EntityId> = {
  entityMap: EntityMap<Entity, Id>;
  ids: Id[];
};

export type NamedEntityState<
  Entity,
  Collection extends string,
  Id extends EntityId
> = {
  [K in keyof EntityState<
    Entity,
    Id
  > as `${Collection}${Capitalize<K>}`]: EntityState<Entity, Id>[K];
};

export type EntityProps<Entity> = {
  entities: Signal<Entity[]>;
};

export type NamedEntityProps<Entity, Collection extends string> = {
  [K in keyof EntityProps<Entity> as `${Collection}${Capitalize<K>}`]: EntityProps<Entity>[K];
};

export type SelectEntityId<Entity, Id extends EntityId> = (
  entity: Entity
) => Id;

export type EntityPredicate<Entity> = (entity: Entity) => boolean;

export type EntityChanges<Entity> =
  | Partial<Entity>
  | ((entity: Entity) => Partial<Entity>);

export enum DidMutate {
  None,
  Entities,
  Both,
}
