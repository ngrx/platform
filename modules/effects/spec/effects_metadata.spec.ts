import {
  Effect,
  getEffectsMetadata,
  getSourceMetadata,
  getSourceForInstance,
  effect,
} from '../src/effects_metadata';
import { of } from 'rxjs';

describe('Effect Metadata', () => {
  describe('getSourceProto', () => {
    it('should get the prototype for an instance of a source', () => {
      class Fixture {}
      const instance = new Fixture();

      const proto = getSourceForInstance(instance);

      expect(proto).toBe(Fixture.prototype);
    });
  });

  describe('getSourceMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect() b: any;
        @Effect({ dispatch: false })
        c: any;
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
    });

    it('should return an empty array if the class has not been decorated', () => {
      class Fixture {
        a: any;
        b: any;
        c: any;
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([]);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all decorated effects in a class instance', () => {
      class Fixture {
        @Effect() a: any;
        @Effect({ dispatch: true })
        b: any;
        @Effect({ dispatch: false })
        c: any;
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true },
        b: { dispatch: true },
        c: { dispatch: false },
      });
    });

    it('should return an empty map if the class has not been decorated', () => {
      class Fixture {
        a: any;
        b: any;
        c: any;
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});

describe('Effect Function Metadata', () => {
  describe('getSourceMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        a = effect(() => of({ type: 'a' }));
        b = effect(() => of({ type: 'b' }));
        c = effect(() => of({ type: 'c' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
    });

    it('should return an empty array if the class has not been created with effect()', () => {
      const mockEffect: any = () => {};
      class Fixture {
        a = mockEffect(() => of({ type: 'A' }));
        b = mockEffect(() => of({ type: 'B' }));
        c = mockEffect(() => {}, { dispatch: false });
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([]);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all decorated effects in a class instance', () => {
      class Fixture {
        a = effect(() => of({ type: 'a' }));
        b = effect(() => of({ type: 'b' }), { dispatch: true });
        c = effect(() => of({ type: 'c' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true },
        b: { dispatch: true },
        c: { dispatch: false },
      });
    });

    it('should return an empty map if the class has not been created with effect()', () => {
      const mockEffect: any = () => {};
      class Fixture {
        a = mockEffect(() => of({ type: 'A' }));
        b = mockEffect(() => of({ type: 'B' }));
        c = mockEffect(() => {}, { dispatch: false });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});
