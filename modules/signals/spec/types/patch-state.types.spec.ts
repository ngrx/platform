import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('patchState', () => {
  const expectSnippet = expecter(
    (code) => `
        import {
          PartialStateUpdater,
          patchState,
          signalState,
        } from '@ngrx/signals';

        const state = signalState({ count: 1, foo: 'bar' });

        function increment(): PartialStateUpdater<{ count: number }> {
          return ({ count }) => ({ count: count + 1 });
        }

        function addNumber(num: number): PartialStateUpdater<{
          numbers: number[];
        }> {
          return ({ numbers }) => ({ numbers: [...numbers, num] });
        }

        ${code}
      `,
    compilerOptions()
  );

  it('infers the state type from WritableStateSource', () => {
    expectSnippet('patchState(state, increment())').toSucceed();
    expectSnippet("patchState(state, { foo: 'baz' })").toSucceed();
    expectSnippet("patchState(state, { foo: 'baz' }, increment())").toSucceed();
    expectSnippet("patchState(state, increment(), { foo: 'baz' })").toSucceed();
  });

  it('fails with wrong partial state object', () => {
    expectSnippet('patchState(state, { x: 1 })').toFail(
      /'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>>/
    );
    expectSnippet("patchState(state, { foo: 'baz' }, { x: 1 })").toFail(
      /'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>>/
    );
    expectSnippet('patchState(state, { x: 1 }, { count: 0 })').toFail(
      /'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>>/
    );
    expectSnippet('patchState(state, increment(), { x: 1 })').toFail(
      /'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>>/
    );
    expectSnippet('patchState(state, { x: 1 }, increment())').toFail(
      /'x' does not exist in type 'Partial<NoInfer<{ count: number; foo: string; }>>/
    );
  });

  it('fails with wrong partial state updater', () => {
    expectSnippet('patchState(state, addNumber(10))').toFail(
      /Property 'numbers' is missing in type '{ count: number; foo: string; }'/
    );
    expectSnippet('patchState(state, { count: 10 }, addNumber(10))').toFail(
      /Property 'numbers' is missing in type '{ count: number; foo: string; }'/
    );
    expectSnippet('patchState(state, addNumber(10), { count: 10 })').toFail(
      /Property 'numbers' is missing in type '{ count: number; foo: string; }'/
    );
    expectSnippet('patchState(state, increment(), addNumber(10))').toFail(
      /Property 'numbers' is missing in type '{ count: number; foo: string; }'/
    );
    expectSnippet('patchState(state, addNumber(10), increment())').toFail(
      /Property 'numbers' is missing in type '{ count: number; foo: string; }'/
    );
  });
});
