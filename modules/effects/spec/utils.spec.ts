import {
  getClasses,
  getSourceForInstance,
  isClass,
  isClassInstance,
} from '../src/utils';

describe('getSourceForInstance', () => {
  it('gets the prototype for an instance of a source', () => {
    class Fixture {}
    const instance = new Fixture();

    const proto = getSourceForInstance(instance);

    expect(proto).toBe(Fixture.prototype);
  });
});

describe('isClassInstance', () => {
  it('returns true for a class instance', () => {
    class C {}
    expect(isClassInstance(new C())).toBe(true);
  });

  it('returns false for a class', () => {
    expect(isClassInstance(class C {})).toBe(false);
  });

  it('returns false for a record', () => {
    expect(isClassInstance({ foo: 'bar' })).toBe(false);
  });

  it('returns false for a function', () => {
    expect(isClassInstance(() => {})).toBe(false);
  });
});

describe('isClass', () => {
  it('returns true for a class', () => {
    expect(isClass(class C {})).toBe(true);
  });

  it('returns false for a record', () => {
    expect(isClass({ foo: 'bar' })).toBe(false);
  });
});

describe('getClasses', () => {
  it('gets classes from an array with classes and records', () => {
    class C1 {}
    class C2 {}
    class C3 {}

    const classes = getClasses([C1, {}, C2, C3, { foo: 'bar' }]);
    expect(classes).toEqual([C1, C2, C3]);
  });
});
