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
    expectPotentialObservable('{ ngrx: boolean; }').toBeInferredAs(
      '{ ngrx: boolean; }'
    );
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
});
