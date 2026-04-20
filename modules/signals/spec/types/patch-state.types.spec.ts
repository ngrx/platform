import { PartialStateUpdater, patchState, signalState } from '@ngrx/signals';

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
    // @ts-expect-error - 'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>> | PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>'
    patchState(state, { x: 1 });
    // @ts-expect-error - 'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>> | PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>'
    patchState(state, { foo: 'baz' }, { x: 1 });
    // @ts-expect-error - 'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>> | PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>'
    patchState(state, { x: 1 }, { count: 0 });
    // @ts-expect-error - 'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>> | PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>'
    patchState(state, increment(), { x: 1 });
    // @ts-expect-error - 'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>> | PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>'
    patchState(state, { x: 1 }, increment());
  });

  it('fails with wrong partial state updater', () => {
    const state = signalState({ count: 1, foo: 'bar' });
    // @ts-expect-error - PartialStateUpdater<{ numbers: number[]; }> is not assignable to PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>
    const test = () => patchState(state, addNumber(10));
    // @ts-expect-error - PartialStateUpdater<{ numbers: number[]; }> is not assignable to PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>
    const test2 = () => patchState(state, { count: 10 }, addNumber(10));
    // @ts-expect-error - PartialStateUpdater<{ numbers: number[]; }> is not assignable to PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>
    const test3 = () => patchState(state, addNumber(10), { count: 10 });
    // @ts-expect-error - PartialStateUpdater<{ numbers: number[]; }> is not assignable to PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>
    const test4 = () => patchState(state, increment(), addNumber(10));
    // @ts-expect-error - PartialStateUpdater<{ numbers: number[]; }> is not assignable to PartialStateUpdater<NoInfer<{ count: number; foo: string; }>>
    const test5 = () => patchState(state, addNumber(10), increment());
  });
});
