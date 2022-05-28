import { potentialObservableExpecter } from './utils';

describe('PushPipe', () => {
  const expectPotentialObservable = potentialObservableExpecter(
    (potentialObservableType) => `
      import { Observable } from 'rxjs';
      import { PushPipe } from '@ngrx/component';

      const anyVal = {} as any;
      const pushPipe = new PushPipe(anyVal, anyVal, anyVal);
      const value = pushPipe.transform(anyVal as ${potentialObservableType});
    `
  );

  it('should infer the result when potential observable is a non-observable', () => {
    expectPotentialObservable('string').toBeInferredAs('string');
    expectPotentialObservable('undefined').toBeInferredAs('undefined');
    expectPotentialObservable('boolean[]').toBeInferredAs('boolean[]');
    expectPotentialObservable(
      '{ x: number; y: string; z: symbol; }'
    ).toBeInferredAs('{ x: number; y: string; z: symbol; }');
  });

  it('should infer the result when potential observable is a union of non-observables', () => {
    expectPotentialObservable('number | { x: symbol; } | null').toBeInferredAs(
      'number | { x: symbol; } | null'
    );
  });

  it('should infer the result when potential observable is a promise', () => {
    expectPotentialObservable('Promise<string>').toBeInferredAs(
      'string | undefined'
    );
  });

  it('should infer the result when potential observable is a union of promises', () => {
    expectPotentialObservable(
      'Promise<{ y: number[]; }> | Promise<string | { z: boolean; }>'
    ).toBeInferredAs('string | { y: number[]; } | { z: boolean; } | undefined');
  });

  it('should infer the result when potential observable is a union of promise and non-observable', () => {
    expectPotentialObservable(
      'Promise<string[]> | boolean[] | null'
    ).toBeInferredAs('string[] | boolean[] | null | undefined');
  });

  it('should infer the result when potential observable is an observable', () => {
    expectPotentialObservable('Observable<{ x: number; }>').toBeInferredAs(
      '{ x: number; } | undefined'
    );
  });

  it('should infer the result when potential observable is a union of observables', () => {
    expectPotentialObservable(
      'Observable<symbol> | Observable<{ z: string; }> | null'
    ).toBeInferredAs('symbol | { z: string; } | null | undefined');
  });

  it('should infer the result when potential observable is a union of observable and promise', () => {
    expectPotentialObservable(
      'Observable<boolean> | Promise<string | undefined>'
    ).toBeInferredAs('string | boolean | undefined');
  });

  it('should infer the result when potential observable is a union of observable and non-observable', () => {
    expectPotentialObservable(
      'Observable<number[]> | Record<string, unknown>'
    ).toBeInferredAs('number[] | Record<string, unknown> | undefined');
  });

  it('should infer the result when potential observable is a union of observable, promise, and non-observable', () => {
    expectPotentialObservable(
      'Observable<{ z: symbol; }> | Promise<number[]> | boolean | null'
    ).toBeInferredAs('boolean | { z: symbol; } | number[] | null | undefined');
  });
});
