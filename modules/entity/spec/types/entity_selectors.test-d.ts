import { Selector } from '@ngrx/store';
import { expectTypeOf, describe, it } from 'vitest';
import { EntitySelectors } from '../..';

describe('EntitySelectors', () => {
  it('is compatible with a dictionary of selectors', () => {
    type SelectorsDictionary = Record<
      string,
      | Selector<Record<string, any>, unknown>
      | ((...args: any[]) => Selector<Record<string, any>, unknown>)
    >;
    type ExtendsSelectorsDictionary<T> = T extends SelectorsDictionary
      ? true
      : false;

    expectTypeOf<
      ExtendsSelectorsDictionary<EntitySelectors<unknown, Record<string, any>>>
    >().toEqualTypeOf<true>();
  });
});
