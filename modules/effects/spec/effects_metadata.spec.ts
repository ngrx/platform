import { getEffectsMetadata, getSourceMetadata } from '../src/effects_metadata';
import { of } from 'rxjs';
import { Effect, createEffect } from '..';

describe('Effects metadata', () => {
  describe('getSourceMetadata', () => {
    it('should combine effects created by the effect decorator and by createEffect', () => {
      class Fixture {
        @Effect() a: any;
        b = createEffect(() => of({ type: 'a' }));
        @Effect({ dispatch: false })
        c: any;
        d = createEffect(() => of({ type: 'a' }), { dispatch: false });
        z: any;
      }

      const mock = new Fixture();

      expect(getSourceMetadata(mock)).toEqual([
        { propertyName: 'a', dispatch: true },
        { propertyName: 'c', dispatch: false },
        { propertyName: 'b', dispatch: true },
        { propertyName: 'd', dispatch: false },
      ]);
    });
  });

  describe('getEffectsMetadata', () => {
    it('should get map of metadata for all effects created', () => {
      class Fixture {
        @Effect() a: any;
        b = createEffect(() => of({ type: 'd' }));
        @Effect({ dispatch: true })
        c: any;
        d = createEffect(() => of({ type: 'e' }), { dispatch: true });
        @Effect({ dispatch: false })
        e: any;
        f = createEffect(() => of({ type: 'f' }), { dispatch: false });
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({
        a: { dispatch: true },
        c: { dispatch: true },
        e: { dispatch: false },
        b: { dispatch: true },
        d: { dispatch: true },
        f: { dispatch: false },
      });
    });

    it('should return an empty map if the class does not have effects', () => {
      const fakeCreateEffect: any = () => {};
      class Fixture {
        a: any;
        b = fakeCreateEffect(() => of({ type: 'a' }));
      }

      const mock = new Fixture();

      expect(getEffectsMetadata(mock)).toEqual({});
    });
  });
});
