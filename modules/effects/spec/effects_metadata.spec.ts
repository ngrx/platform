import {
  Effect,
  getEffectsMetadata,
  getSourceMetadata,
  getSourceForInstance,
  createEffect,
} from '../src/effects_metadata';
import { of } from 'rxjs';

describe('@Effect() Metadata', () => {
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

describe('createEffect() Metadata', () => {
  describe('getSourceMetadata', () => {
    it('should get the effects metadata for a class instance', () => {
      class Fixture {
        a = createEffect(() => of({ type: 'a' }));
        b = createEffect(() => of({ type: 'b' }));
        c = createEffect(() => of({ type: 'c' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'c', dispatch: false },
      ]);
    });

    it('should return an empty array if the class has not been created with createEffect()', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a = fakeCreateEffect(() => of({ type: 'A' }));
        b = fakeCreateEffect(() => of({ type: 'B' }));
        c = fakeCreateEffect(() => {}, { dispatch: false });
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([]);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all decorated effects in a class instance', () => {
      class Fixture {
        a = createEffect(() => of({ type: 'a' }));
        b = createEffect(() => of({ type: 'b' }), { dispatch: true });
        c = createEffect(() => of({ type: 'c' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true },
        b: { dispatch: true },
        c: { dispatch: false },
      });
    });

    it('should return an empty map if the class has not been created with createEffect()', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a = fakeCreateEffect(() => of({ type: 'A' }));
        b = fakeCreateEffect(() => of({ type: 'B' }));
        c = fakeCreateEffect(() => {}, { dispatch: false });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});
