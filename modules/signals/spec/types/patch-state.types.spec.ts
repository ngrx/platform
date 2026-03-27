import {
  type PartialStateUpdater,
  patchState,
  signalState,
} from '@ngrx/signals';
import { describe, expect, it } from 'tstyche';

function increment(): PartialStateUpdater<{ count: number }> {
  return ({ count }) => ({ count: count + 1 });
}

function addNumber(num: number): PartialStateUpdater<{ numbers: number[] }> {
  return ({ numbers }) => ({ numbers: [...numbers, num] });
}

describe('patchState', () => {
  it('infers the state type from WritableStateSource with updater', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    patchState(state, increment());
  });

  it('infers the state type from WritableStateSource with object', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    patchState(state, { foo: 'baz' });
  });

  it('infers the state type from WritableStateSource with updater and object', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    patchState(state, { foo: 'baz' }, increment());
    patchState(state, increment(), { foo: 'baz' });
  });

  it('fails with wrong partial state object', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    expect(patchState).type.not.toBeCallableWith(state, { x: 1 });
    expect(patchState).type.not.toBeCallableWith(
      state,
      { foo: 'baz' },
      { x: 1 }
    );
    expect(patchState).type.not.toBeCallableWith(state, { x: 1 }, { count: 0 });
    expect(patchState).type.not.toBeCallableWith(state, increment(), { x: 1 });
    expect(patchState).type.not.toBeCallableWith(state, { x: 1 }, increment());
  });

  it('fails with wrong partial state updater', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    expect(patchState).type.not.toBeCallableWith(state, addNumber(10));
    expect(patchState).type.not.toBeCallableWith(
      state,
      { count: 10 },
      addNumber(10)
    );
    expect(patchState).type.not.toBeCallableWith(state, addNumber(10), {
      count: 10,
    });
    expect(patchState).type.not.toBeCallableWith(
      state,
      increment(),
      addNumber(10)
    );
    expect(patchState).type.not.toBeCallableWith(
      state,
      addNumber(10),
      increment()
    );
  });
});
