import { potentialObservableExpecter } from './utils';

describe('LetDirective', () => {
  const expectPotentialObservable = potentialObservableExpecter(
    (potentialObservableType) => `
      import { Observable } from 'rxjs';
      import { LetDirective } from '@ngrx/component';

      const directive = {} as LetDirective<${potentialObservableType}>;
      const ctx = {};

      if (LetDirective.ngTemplateContextGuard(directive, ctx)) {
        const value = ctx.$implicit;
      }
    `
  );

  it('should infer the value when potential observable is a non-observable', () => {
    expectPotentialObservable('number').toBeInferredAs('number');
    expectPotentialObservable('null').toBeInferredAs('null');
    expectPotentialObservable('string[]').toBeInferredAs('string[]');
    expectPotentialObservable('{}').toBeInferredAs('{}');
    expectPotentialObservable('{ ngrx: boolean; }').toBeInferredAs(
      '{ ngrx: boolean; }'
    );
    expectPotentialObservable(
      'User',
      'interface User { name: string; }'
    ).toBeInferredAs('User');
  });

  it('should infer the value when potential observable is a union of non-observables', () => {
    expectPotentialObservable(
      'string | { ngrx: boolean; } | null'
    ).toBeInferredAs('string | { ngrx: boolean; } | null');
  });

  it('should infer the value when potential observable is a promise', () => {
    expectPotentialObservable('Promise<{ ngrx: number; }>').toBeInferredAs(
      '{ ngrx: number; }'
    );
  });

  it('should infer the value when potential observable is a union of promises', () => {
    expectPotentialObservable(
      'Promise<string> | Promise<boolean | { ngrx: number; }>'
    ).toBeInferredAs('string | boolean | { ngrx: number; }');
  });

  it('should infer the value when potential observable is a union of promise and non-observable', () => {
    expectPotentialObservable(
      'Promise<{ ngrx: string; }> | number[] | null'
    ).toBeInferredAs('{ ngrx: string; } | number[] | null');
  });

  it('should infer the value when potential observable is an observable', () => {
    expectPotentialObservable(
      'Observable<{ component: boolean; }>'
    ).toBeInferredAs('{ component: boolean; }');
  });

  it('should infer the value when potential observable is a union of observables', () => {
    expectPotentialObservable(
      'Observable<string> | Observable<{ ngrx: number; } | null>'
    ).toBeInferredAs('string | { ngrx: number; } | null');
  });

  it('should infer the value when potential observable is a union of observable and promise', () => {
    expectPotentialObservable(
      'Observable<{ component: number; }> | Promise<string | undefined>'
    ).toBeInferredAs('string | { component: number; } | undefined');
  });

  it('should infer the value when potential observable is a union of observable and non-observable', () => {
    expectPotentialObservable(
      'Observable<Record<string, unknown>> | boolean[] | undefined'
    ).toBeInferredAs('Record<string, unknown> | boolean[] | undefined');
  });

  it('should infer the value when potential observable is a union of observable, promise, and non-observable', () => {
    expectPotentialObservable(
      'Observable<number> | Promise<{ ngrx: string; }> | boolean | null'
    ).toBeInferredAs('number | boolean | { ngrx: string; } | null');
  });

  it('should infer the value when potential observable is an observable dictionary', () => {
    expectPotentialObservable(
      '{ o1: Observable<number>; o2: Observable<{ ngrx: string }> }'
    ).toBeInferredAs('{ o1: number; o2: { ngrx: string; }; }');
  });

  it('should infer the value when potential observable is an observable dictionary typed as interface', () => {
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { x: Observable<string>; y: Observable<boolean | undefined> }'
    ).toBeInferredAs('{ x: string; y: boolean | undefined; }');
  });

  it('should infer the value as static when potential observable is a dictionary with at least one non-observable property', () => {
    expectPotentialObservable(
      '{ o: Observable<bigint>; n: number }'
    ).toBeInferredAs('{ o: Observable<bigint>; n: number; }');
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { o: Observable<number>; p: Promise<string> }'
    ).toBeInferredAs('Dictionary');
  });

  it('should infer the value as static when potential observable is an observable dictionary with optional properties', () => {
    expectPotentialObservable(
      '{ o1: Observable<boolean>; o2?: Observable<string> }'
    ).toBeInferredAs(
      '{ o1: Observable<boolean>; o2?: Observable<string> | undefined; }'
    );
    expectPotentialObservable(
      'Dictionary',
      'interface Dictionary { o1: Observable<number>; o2?: Observable<bigint> }'
    ).toBeInferredAs('Dictionary');
  });

  it('should infer the value when potential observable is a union of observable dictionary and non-observable', () => {
    expectPotentialObservable(
      '{ o: Observable<string> } | { ngrx: string }'
    ).toBeInferredAs('{ ngrx: string; } | { o: string; }');
    expectPotentialObservable(
      'Dictionary | number',
      'interface Dictionary { o: Observable<number> }'
    ).toBeInferredAs('number | { o: number; }');
  });

  it('should infer the value when potential observable is a union of observable dictionary and promise', () => {
    expectPotentialObservable(
      '{ o: Observable<symbol> } | Promise<{ ngrx: string }>'
    ).toBeInferredAs('{ ngrx: string; } | { o: symbol; }');
    expectPotentialObservable(
      'Dictionary | Promise<number>',
      'interface Dictionary { o: Observable<number> }'
    ).toBeInferredAs('number | { o: number; }');
  });

  it('should infer the value when potential observable is a union of observable dictionary and observable', () => {
    expectPotentialObservable(
      '{ o: Observable<number> } | Observable<{ ngrx: string }>'
    ).toBeInferredAs('{ ngrx: string; } | { o: number; }');
    expectPotentialObservable(
      'Dictionary | Observable<boolean>',
      'interface Dictionary { o: Observable<boolean> }'
    ).toBeInferredAs('boolean | { o: boolean; }');
  });
});
