import { compose } from '../src/compose';

const double = (i: number) => 2 * i;
const add = (amount: number) => (i: number) => i + amount;
const toString = (i: number) => `${i}`;

describe('compose Function', function() {
  it('should return an identity function if no functions are composed', function() {
    expect(compose()(1)).toEqual(1);
    expect(compose()('a')).toEqual('a');
  });

  it('should return the result of the first function if only one function is provided', function() {
    expect(compose(double)(3)).toBe(6);
  });

  it('should compose all functions from right to left maintaining the type signature', function() {
    const fn = compose(toString, add(3), double);

    expect(fn(3)).toEqual('9');
  });
});
