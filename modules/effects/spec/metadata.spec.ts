import { Effect, getEffectsMetadata } from '../src/effects';

describe('Effect Metadata', () => {
  it('should get the effects metadata for a class instance', () => {
    class Fixture {
      @Effect() a;
      @Effect() b;
      @Effect({ dispatch: false }) c;
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
      a;
      b;
      c;
    }

    const mock = new Fixture();

    expect(getEffectsMetadata(mock)).toEqual([]);
  });
});
