import { expectTypeOf, describe, it } from 'vitest';
import { createEntityAdapter, EntityAdapter } from '../..';

interface EntityWithStringId {
  id: string;
}

interface EntityWithNumberId {
  id: number;
}

interface EntityWithoutId {
  key: number;
}

describe('EntityAdapter Types', () => {
  it('sets the id type to string when the entity has a string id', () => {
    const adapter = createEntityAdapter<EntityWithStringId>();

    expectTypeOf(adapter).toEqualTypeOf<
      EntityAdapter<EntityWithStringId, string>
    >();
  });

  it('sets the id type to number when the entity has a number id', () => {
    const adapter = createEntityAdapter<EntityWithNumberId>();

    expectTypeOf(adapter).toEqualTypeOf<
      EntityAdapter<EntityWithNumberId, number>
    >();
  });

  it('sets the id type to string when selectId returns a string', () => {
    const adapter = createEntityAdapter<EntityWithNumberId>({
      selectId: (entity) => entity.id.toString(),
    });

    expectTypeOf(adapter).toEqualTypeOf<
      EntityAdapter<EntityWithNumberId, string>
    >();
  });

  it('sets the id type to string | number when the entity has no id and no selectId is provided', () => {
    const adapter = createEntityAdapter<EntityWithoutId>();

    expectTypeOf(adapter).toEqualTypeOf<
      EntityAdapter<EntityWithoutId, string | number>
    >();
  });

  it('sets the id type to correct type if selectId is provided', () => {
    const adapter = createEntityAdapter<EntityWithoutId>({
      selectId: (entity) => entity.key.toString(),
    });

    expectTypeOf(adapter).toEqualTypeOf<
      EntityAdapter<EntityWithoutId, string>
    >();
  });

  it('throws when selectId returns an invalid id type', () => {
    createEntityAdapter<EntityWithoutId>({
      // @ts-expect-error Type 'boolean' is not assignable to type 'string | number'
      selectId: (entity) => entity.key > 0,
    });
  });
});
