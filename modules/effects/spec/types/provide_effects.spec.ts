import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('provideEffects()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {
        CreateEffectMetadata,
        FunctionalEffect,
        provideEffects,
      } from '@ngrx/effects';
      import { Observable } from 'rxjs';

      class ClassEffects {}
      const fnEffectsRecord: Record<string, FunctionalEffect> = {};
      const nonFnEffectsRecord: Record<
        string,
        // it should fail if at least one effect in the record is not functional
        FunctionalEffect | (Observable<unknown> & CreateEffectMetadata)
      > = {};

      ${code}`,
    compilerOptions()
  );

  it('should compile without params', () => {
    expectSnippet(`
      provideEffects();
    `).toSucceed();
  });

  it('should compile with a single effects class', () => {
    expectSnippet(`
      provideEffects(ClassEffects);
    `).toSucceed();
  });

  it('should compile with an array of effects classes', () => {
    expectSnippet(`
      provideEffects([ClassEffects]);
    `).toSucceed();
  });

  it('should compile with a sequence of effects classes', () => {
    expectSnippet(`
      provideEffects(ClassEffects, ClassEffects);
    `).toSucceed();
  });

  it('should compile with a single functional effects record', () => {
    expectSnippet(`
      provideEffects(fnEffectsRecord);
    `).toSucceed();
  });

  it('should compile with an array of functional effects records', () => {
    expectSnippet(`
      provideEffects([fnEffectsRecord, fnEffectsRecord]);
    `).toSucceed();
  });

  it('should compile with a sequence of functional effects records', () => {
    expectSnippet(`
      provideEffects(fnEffectsRecord, fnEffectsRecord, fnEffectsRecord);
    `).toSucceed();
  });

  it('should compile with an array of functional effects records and classes', () => {
    expectSnippet(`
      provideEffects([fnEffectsRecord, ClassEffects, fnEffectsRecord]);
    `).toSucceed();
  });

  it('should compile with a sequence of functional effects records and classes', () => {
    expectSnippet(`
      provideEffects(ClassEffects, fnEffectsRecord, ClassEffects);
    `).toSucceed();
  });

  it('should fail with a single non-functional effects record', () => {
    expectSnippet(`
      provideEffects(nonFnEffectsRecord);
    `).toFail();
  });

  it('should fail with an array of classes, functional, and non-functional effects records', () => {
    expectSnippet(`
      provideEffects([fnEffectsRecord, ClassEffects, nonFnEffectsRecord]);
    `).toFail();
  });

  it('should fail with a sequence of classes, functional, and non-functional effects records', () => {
    expectSnippet(`
      provideEffects(nonFnEffectsRecord, fnEffectsRecord, ClassEffects);
    `).toFail();
  });
}, 8_000);
