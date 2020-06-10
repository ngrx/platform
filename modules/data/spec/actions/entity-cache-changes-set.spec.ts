import { ChangeSetOperation, changeSetItemFactory as cif } from '../../';

describe('changeSetItemFactory', () => {
  const hero = { id: 1, name: 'Hero 1' };
  const villains = [
    { id: 2, name: 'Villain 2' },
    { id: 3, name: 'Villain 3' },
  ];

  it('should create an Add item with array of entities from single entity', () => {
    const heroItem = cif.add('Hero', hero);
    expect(heroItem.op).toBe(ChangeSetOperation.Add);
    expect(heroItem.entityName).toBe('Hero');
    expect(heroItem.entities).toEqual([hero]);
  });

  it('should create a Delete item from an array entity keys', () => {
    const ids = villains.map((v) => v.id);
    const heroItem = cif.delete('Villain', ids);
    expect(heroItem.op).toBe(ChangeSetOperation.Delete);
    expect(heroItem.entityName).toBe('Villain');
    expect(heroItem.entities).toEqual(ids);
  });

  it('should create an Add item with empty array when given no entities', () => {
    const heroItem = cif.add('Hero', null);
    expect(heroItem.op).toBe(ChangeSetOperation.Add);
    expect(heroItem.entityName).toBe('Hero');
    expect(heroItem.entities).toEqual([]);
  });
});
