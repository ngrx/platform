import { it, describe } from 'vitest';
import { createEntityAdapter } from '../..';

interface EntityWithoutId {
  key: number;
}

describe('EntityAdapter Types', () => {
  it('throws when selectId returns an invalid id type', () => {
    createEntityAdapter<EntityWithoutId>({
      // @ts-expect-error Type 'boolean' is not assignable to type 'string | number'
      selectId: (entity) => entity.key > 0,
    });
  });
});
