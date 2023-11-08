import { Signal } from '@angular/core';

export type EntityId = string | number;

export type EntityMap<Entity> = Record<EntityId, Entity>;

export type EntityState<Entity> = {
  entityMap: EntityMap<Entity>;
  ids: EntityId[];
};

export type NamedEntityState<Entity, Collection extends string> = {
  [K in Collection as `${K}EntityMap`]: EntityMap<Entity>;
} & { [K in Collection as `${K}Ids`]: EntityId[] };

export type EntitySignals<Entity> = {
  entities: Signal<Entity[]>;
};

export type NamedEntitySignals<Entity, Collection extends string> = {
  [K in Collection as `${K}Entities`]: Signal<Entity[]>;
};

export type EntityIdProps<Entity> = {
  [K in keyof Entity as Entity[K] extends EntityId ? K : never]: Entity[K];
};

export type EntityIdKey<Entity> = keyof EntityIdProps<Entity> & string;

export type EntityPredicate<Entity> = (entity: Entity) => boolean;

export type EntityChanges<Entity> =
  | Partial<Entity>
  | ((entity: Entity) => Partial<Entity>);

export enum DidMutate {
  None,
  Entities,
  Both,
}
