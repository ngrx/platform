import { EntityActionGuard, EntityAction, EntityOp } from '../..';

class Hero {
  id!: number;
  name!: string;
  power?: string;
}

describe('EntityActionGuard', () => {
  let guard: EntityActionGuard<Hero>;
  let createAction: any;
  let action: EntityAction<any>;

  beforeEach(() => {
    const selectId = (hero: Hero) => hero.id;
    guard = new EntityActionGuard('Hero', selectId);

    createAction = (data?: any) =>
      (action = {
        type: 'TEST',
        payload: {
          entityName: 'Hero',
          entityOp: EntityOp.ADD_ALL, // not used
          data,
        },
      });
  });

  describe('mustBeEntity', () => {
    it('should throw if action does not contain entity', () => {
      action = createAction();
      expect(() => guard.mustBeEntity(action)).toThrowError(
        /should have a single entity/
      );
    });

    it('should throw if entity has a missing entity key', () => {
      action = createAction({ name: 'Thor' });
      expect(() => guard.mustBeEntity(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should throw if entity has an invalid entity key', () => {
      action = createAction({ id: { id: 1 }, name: 'Thor' });
      expect(() => guard.mustBeEntity(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should return the entity of the action', () => {
      const data = { id: 1, name: 'Thor', power: 'Hammer' };
      action = createAction(data);
      expect(guard.mustBeEntity(action)).toBe(data);
    });
  });

  describe('mustBeEntities', () => {
    it('should throw if action does not contain an array of entities', () => {
      action = createAction({ id: 1, name: 'Thor', power: 'Hammer' });
      expect(() => guard.mustBeEntities(action)).toThrowError(
        /should be an array of entities/
      );
    });

    it('should throw if any entity has a missing entity key', () => {
      const data = [
        { id: 1, name: 'Thor', power: 'Hammer' },
        { name: 'Iron Man', power: 'Nano' },
      ];

      action = createAction(data);
      expect(() => guard.mustBeEntities(action)).toThrowError(
        /item 2, does not have a valid entity key/
      );
    });

    it('should throw if any entity has an invalid entity key', () => {
      const data = [
        { id: 1, name: 'Thor', power: 'Hammer' },
        { id: null, name: 'Iron Man', power: 'Nano' },
      ];

      action = createAction(data);
      expect(() => guard.mustBeEntities(action)).toThrowError(
        /item 2, does not have a valid entity key/
      );
    });

    it('should return the array of entities of the action', () => {
      const data = [
        { id: 1, name: 'Thor', power: 'Hammer' },
        { id: 2, name: 'Iron Man', power: 'Nano' },
      ];
      action = createAction(data);
      expect(guard.mustBeEntities(action)).toBe(data);
    });
  });

  describe('mustBeKey', () => {
    it('should throw if action does not contain a single entity key', () => {
      action = createAction();
      expect(() => guard.mustBeKey(action)).toThrowError(
        /should be a single entity key/
      );
    });

    it('should throw if action has an invalid entity key', () => {
      action = createAction({ id: 1, name: 'Thor', power: 'Hammer' });
      expect(() => guard.mustBeKey(action)).toThrowError(/is not a valid key/);
    });

    it('should return the entity key of the action', () => {
      action = createAction(1);
      expect(guard.mustBeKey(action)).toBe(1);
    });
  });

  describe('mustBeKeys', () => {
    it('should throw if action does not contain an array of entity keys', () => {
      const data = { id: 1, name: 'Thor', power: 'Hammer' };
      action = createAction(data);
      expect(() => guard.mustBeKeys(action)).toThrowError(
        /should be an array of entity keys/
      );
    });

    it('should throw if any member of the array is an invalid entity key', () => {
      const data = [1, null];
      action = createAction(data);
      expect(() => guard.mustBeKeys(action)).toThrowError(
        /item 2, is not a valid entity key/
      );
    });

    it('should return the array of entity keys of the action', () => {
      const data = [1, 2];
      action = createAction(data);
      expect(guard.mustBeKeys(action)).toBe(data);
    });
  });

  describe('mustBeUpdate', () => {
    it('should throw if action does not contain a single entity update', () => {
      action = createAction();
      expect(() => guard.mustBeUpdate(action)).toThrowError(
        /should be a single entity update/
      );
    });

    it('should throw if entity update has a missing entity key', () => {
      action = createAction({
        changes: {
          name: 'Thor',
        },
      });
      expect(() => guard.mustBeUpdate(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should throw if entity update has an invalid entity key', () => {
      action = createAction({
        changes: {
          id: null,
          name: 'Thor',
        },
      });
      expect(() => guard.mustBeUpdate(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should return the entity update of the action', () => {
      const data = {
        id: 1,
        changes: { id: 1, name: 'Thor', power: 'Hammer' },
      };
      action = createAction(data);
      expect(guard.mustBeUpdate(action)).toBe(data);
    });
  });

  describe('mustBeUpdates', () => {
    it('should throw if action does not contain an array of entity updates', () => {
      const data = {
        id: 1,
        changes: { id: 1, name: 'Thor', power: 'Hammer' },
      };
      action = createAction(data);
      expect(() => guard.mustBeUpdates(action)).toThrowError(
        /should be an array of entity updates/
      );
    });

    it('should throw if any entity update has a missing entity key', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          changes: { name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(() => guard.mustBeUpdates(action)).toThrowError(
        /item 2, has a missing or invalid entity key/
      );
    });

    it('should throw if any entity update has an invalid entity key', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          changes: { id: null, name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(() => guard.mustBeUpdates(action)).toThrowError(
        /item 2, has a missing or invalid entity key/
      );
    });

    it('should return the array of entity updates of the action', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          id: 2,
          changes: { id: 2, name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(guard.mustBeUpdates(action)).toBe(data);
    });
  });

  describe('mustBeUpdateResponse', () => {
    it('should throw if action does not contain a single entity update', () => {
      action = createAction();
      expect(() => guard.mustBeUpdateResponse(action)).toThrowError(
        /should be a single entity update/
      );
    });

    it('should throw if entity update has a missing entity key', () => {
      action = createAction({
        changes: {
          name: 'Thor',
        },
      });
      expect(() => guard.mustBeUpdateResponse(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should throw if entity update has an invalid entity key', () => {
      action = createAction({
        changes: {
          id: null,
          name: 'Thor',
        },
      });
      expect(() => guard.mustBeUpdateResponse(action)).toThrowError(
        /has a missing or invalid entity key/
      );
    });

    it('should return the entity update of the action', () => {
      const data = {
        id: 1,
        changes: { id: 1, name: 'Thor', power: 'Hammer' },
      };
      action = createAction(data);
      expect(guard.mustBeUpdateResponse(action)).toBe(data);
    });
  });

  describe('mustBeUpdateResponses', () => {
    it('should throw if action does not contain an array of entity updates', () => {
      const data = {
        id: 1,
        changes: { id: 1, name: 'Thor', power: 'Hammer' },
      };
      action = createAction(data);
      expect(() => guard.mustBeUpdateResponses(action)).toThrowError(
        /should be an array of entity updates/
      );
    });

    it('should throw if any entity update has a missing entity key', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          changes: { name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(() => guard.mustBeUpdateResponses(action)).toThrowError(
        /item 2, has a missing or invalid entity key/
      );
    });

    it('should throw if any entity update has an invalid entity key', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          changes: { id: null, name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(() => guard.mustBeUpdateResponses(action)).toThrowError(
        /item 2, has a missing or invalid entity key/
      );
    });

    it('should return the array of entity updates of the action', () => {
      const data = [
        {
          id: 1,
          changes: { id: 1, name: 'Thor', power: 'Hammer' },
        },
        {
          id: 2,
          changes: { id: 2, name: 'Thor', power: 'Hammer' },
        },
      ];
      action = createAction(data);
      expect(guard.mustBeUpdateResponses(action)).toBe(data);
    });
  });
});
