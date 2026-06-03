import { signalState } from '../src';

it('should fail', () => {
  const state = signalState({ foo: 'bar' });

  // @ts-expect-error foo is not a number
  patchStore(state, { foo: 1 });
});
