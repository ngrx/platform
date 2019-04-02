import { getSourceForInstance } from '../src/utils';

describe('getSourceProto', () => {
  it('should get the prototype for an instance of a source', () => {
    class Fixture {}
    const instance = new Fixture();

    const proto = getSourceForInstance(instance);

    expect(proto).toBe(Fixture.prototype);
  });
});
