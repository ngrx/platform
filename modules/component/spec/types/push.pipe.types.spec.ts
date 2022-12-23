import { potentialObservableExpecter } from './utils';

describe('PushPipe', () => {
  const expectPotentialObservable = potentialObservableExpecter(
    (potentialObservableType) => `
      import { Observable } from 'rxjs';
      import { PushPipe } from '@ngrx/component';

      const unknownVal: unknown = {};
      const pushPipe = unknownVal as PushPipe;
      const value = pushPipe.transform(unknownVal as ${potentialObservableType});
    `
  );

  it('should infer the result when potential observable is a non-observable', () => {
    expectPotentialObservable('string').toBeInferredAs('string');
    expectPotentialObservable('undefined').toBeInferredAs('undefined');
    expectPotentialObservable('boolean[]').toBeInferredAs('boolean[]');
    expectPotentialObservable('{}').toBeInferredAs('{}');
    expectPotentialObservable(
      '{ x: number; y: string; z: symbol; }'
    ).toBeInferredAs('{ x: number; y: string; z: symbol; }');
    expectPotentialObservable(
      'Book',
      'interface Book { title: string; }'
    ).toBeInferredAs('Book');
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
    ).toBeInferredAs('Record<string, unknown> | number[] | undefined');
  });

  it('should infer the result when potential observable is a union of observable, promise, and non-observable', () => {
    expectPotentialObservable(
      'Observable<{ z: symbol; }> | Promise<number[]> | boolean | null'
    ).toBeInferredAs('boolean | { z: symbol; } | number[] | null | undefined');
  });

  it('should infer the result when potential observable is an observable dictionary', () => {
    expectPotentialObservable(
      '{ o1: Observable<number | boolean>; o2: Observable<{ ngrx: string }> }'
    ).toBeInferredAs(
      '{ o1: number | boolean; o2: { ngrx: string; }; } | undefined'
    );
  });

  it('should infer the result when potential observable is an observable dictionary typed as interface', () => {
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { o1: Observable<bigint>; o2: Observable<string | symbol> }'
    ).toBeInferredAs('{ o1: bigint; o2: string | symbol; } | undefined');
  });

  it('should infer the result as static when potential observable is a dictionary with at least one non-observable property', () => {
    expectPotentialObservable(
      '{ o: Observable<string>; b: boolean }'
    ).toBeInferredAs('{ o: Observable<string>; b: boolean; }');
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { o: Observable<string>; p: Promise<null> }'
    ).toBeInferredAs('Dictionary');
  });

  it('should infer the result as static when potential observable is an observable dictionary with optional properties', () => {
    expectPotentialObservable(
      '{ x: Observable<number>; y?: Observable<bigint> }'
    ).toBeInferredAs(
      '{ x: Observable<number>; y?: Observable<bigint> | undefined; }'
    );
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { o1: Observable<number>; o2?: Observable<bigint> }'
    ).toBeInferredAs('Dictionary');
  });

  it('should infer the result when potential observable is a union of observable dictionary and non-observable', () => {
    expectPotentialObservable(
      '{ x: Observable<string> } | { y: number; z: bigint; }'
    ).toBeInferredAs('{ y: number; z: bigint; } | { x: string; } | undefined');
    expectPotentialObservable(
      'Dictionary | number',
      'interface Dictionary { x: Observable<string> }'
    ).toBeInferredAs('number | { x: string; } | undefined');
  });

  it('should infer the result when potential observable is a union of observable dictionary and promise', () => {
    expectPotentialObservable(
      '{ ngrx: Observable<string> } | Promise<string>'
    ).toBeInferredAs('string | { ngrx: string; } | undefined');
    expectPotentialObservable(
      'Dictionary | Promise<symbol>',
      'interface Dictionary { o: Observable<symbol> }'
    ).toBeInferredAs('symbol | { o: symbol; } | undefined');
  });

  it('should infer the value when potential observable is a union of observable dictionary and observable', () => {
    expectPotentialObservable(
      '{ o: Observable<number> } | Observable<number>'
    ).toBeInferredAs('number | { o: number; } | undefined');
    expectPotentialObservable(
      'Dictionary | Observable<bigint>',
      'interface Dictionary { o: Observable<bigint> }'
    ).toBeInferredAs('bigint | { o: bigint; } | undefined');
  });
});
