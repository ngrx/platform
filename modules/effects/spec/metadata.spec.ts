import { Effect, getEffectsMetadata } from '../src/effects';

describe('Effect Metadata', () => {
  it('should get the effects metadata for a class instance', () => {
    class Fixture {
      @Effect() a: any;
      @Effect() b: any;
      @Effect({ dispatch: false }) c: any;
    }

    const mock = new Fixture();

    expect(getEffectsMetadata(mock)).toEqual([
      { propertyName: 'a', dispatch: true },
      { propertyName: 'b', dispatch: true },
      { propertyName: 'c', dispatch: false }
    ]);
  });

  it('should return an empty array if the class has not been decorated', () => {
    class Fixture {
      a: any;
      b: any;
      c: any;
    }

    const mock = new Fixture();

    expect(getEffectsMetadata(mock)).toEqual([]);
  });
});
