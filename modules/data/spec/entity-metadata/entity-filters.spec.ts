import { PropsFilterFnFactory } from '../..';

class Hero {
  id!: number;
  name!: string;
  saying?: string;
}

describe('EntityFilterFn - PropsFilter', () => {
  it('can match entity on full text of a target prop', () => {
    const entity1: Hero = { id: 42, name: 'Foo' };
    const entity2: Hero = { id: 21, name: 'Bar' };
    const entities: Hero[] = [entity1, entity2];
    const filter = PropsFilterFnFactory<Hero>(['name']);
    expect(filter(entities, 'Foo')).toEqual([entity1]);
  });

  it('can match entity on regex of a target prop', () => {
    const entity1: Hero = { id: 42, name: 'Foo' };
    const entity2: Hero = { id: 21, name: 'Bar' };
    const entities: Hero[] = [entity1, entity2];
    const filter = PropsFilterFnFactory<Hero>(['name']);
    expect(filter(entities, /fo/i)).toEqual([entity1]);
  });

  it('can match entity on regex of two target props', () => {
    const entity1: Hero = { id: 42, name: 'Foo' };
    const entity2: Hero = { id: 21, name: 'Bar', saying: 'Foo is not Bar' };
    const entities: Hero[] = [entity1, entity2];
    const filter = PropsFilterFnFactory<Hero>(['name', 'saying']);
    expect(filter(entities, /fo/i)).toEqual([entity1, entity2]);
  });

  it('returns empty array when no matches', () => {
    const entity1: Hero = { id: 42, name: 'Foo' };
    const entity2: Hero = { id: 21, name: 'Bar' };
    const entities: Hero[] = [entity1, entity2];
    const filter = PropsFilterFnFactory<Hero>(['name']);
    expect(filter(entities, 'Baz')).toEqual([]);
  });

  it('returns empty array for empty input entities array', () => {
    const entities: Hero[] = [];
    const filter = PropsFilterFnFactory<Hero>(['name']);
    expect(filter(entities, 'Foo')).toEqual([]);
  });

  it('returns empty array for null input entities array', () => {
    const filter = PropsFilterFnFactory<Hero>(['name']);
    expect(filter(null as any, 'Foo')).toEqual([]);
  });
});
