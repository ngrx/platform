import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('EffectsModule()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {
        CreateEffectMetadata,
        EffectsModule,
        FunctionalEffect,
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

  describe('forRoot', () => {
    it('should compile without params', () => {
      expectSnippet(`
        EffectsModule.forRoot();
      `).toSucceed();
    });

    it('should compile with a single effects class', () => {
      expectSnippet(`
        EffectsModule.forRoot(ClassEffects);
      `).toSucceed();
    });

    it('should compile with an array of effects classes', () => {
      expectSnippet(`
        EffectsModule.forRoot([ClassEffects]);
      `).toSucceed();
    });

    it('should compile with a sequence of effects classes', () => {
      expectSnippet(`
        EffectsModule.forRoot(ClassEffects, ClassEffects);
      `).toSucceed();
    });

    it('should compile with a single functional effects record', () => {
      expectSnippet(`
        EffectsModule.forRoot(fnEffectsRecord);
      `).toSucceed();
    });

    it('should compile with an array of functional effects records', () => {
      expectSnippet(`
        EffectsModule.forRoot([fnEffectsRecord, fnEffectsRecord]);
      `).toSucceed();
    });

    it('should compile with a sequence of functional effects records', () => {
      expectSnippet(`
        EffectsModule.forRoot(fnEffectsRecord, fnEffectsRecord, fnEffectsRecord);
      `).toSucceed();
    });

    it('should compile with an array of functional effects records and classes', () => {
      expectSnippet(`
        EffectsModule.forRoot([fnEffectsRecord, ClassEffects, fnEffectsRecord]);
      `).toSucceed();
    });

    it('should compile with a sequence of functional effects records and classes', () => {
      expectSnippet(`
        EffectsModule.forRoot(ClassEffects, fnEffectsRecord, ClassEffects);
      `).toSucceed();
    });

    it('should fail with a single non-functional effects record', () => {
      expectSnippet(`
        EffectsModule.forRoot(nonFnEffectsRecord);
      `).toFail();
    });

    it('should fail with an array of classes, functional, and non-functional effects records', () => {
      expectSnippet(`
        EffectsModule.forRoot([fnEffectsRecord, ClassEffects, nonFnEffectsRecord]);
      `).toFail();
    });

    it('should fail with a sequence of classes, functional, and non-functional effects records', () => {
      expectSnippet(`
        EffectsModule.forRoot(nonFnEffectsRecord, fnEffectsRecord, ClassEffects);
      `).toFail();
    });
  });

  describe('forFeature', () => {
    it('should compile without params', () => {
      expectSnippet(`
        EffectsModule.forFeature();
      `).toSucceed();
    });

    it('should compile with a single effects class', () => {
      expectSnippet(`
        EffectsModule.forFeature(ClassEffects);
      `).toSucceed();
    });

    it('should compile with an array of effects classes', () => {
      expectSnippet(`
        EffectsModule.forFeature([ClassEffects]);
      `).toSucceed();
    });

    it('should compile with a sequence of effects classes', () => {
      expectSnippet(`
        EffectsModule.forFeature(ClassEffects, ClassEffects);
      `).toSucceed();
    });

    it('should compile with a single functional effects record', () => {
      expectSnippet(`
        EffectsModule.forFeature(fnEffectsRecord);
      `).toSucceed();
    });

    it('should compile with an array of functional effects records', () => {
      expectSnippet(`
        EffectsModule.forFeature([fnEffectsRecord, fnEffectsRecord]);
      `).toSucceed();
    });

    it('should compile with a sequence of functional effects records', () => {
      expectSnippet(`
        EffectsModule.forFeature(fnEffectsRecord, fnEffectsRecord, fnEffectsRecord);
      `).toSucceed();
    });

    it('should compile with an array of functional effects records and classes', () => {
      expectSnippet(`
        EffectsModule.forFeature([fnEffectsRecord, ClassEffects, fnEffectsRecord]);
      `).toSucceed();
    });

    it('should compile with a sequence of functional effects records and classes', () => {
      expectSnippet(`
        EffectsModule.forFeature(ClassEffects, fnEffectsRecord, ClassEffects);
      `).toSucceed();
    });

    it('should fail with a single non-functional effects record', () => {
      expectSnippet(`
        EffectsModule.forFeature(nonFnEffectsRecord);
      `).toFail();
    });

    it('should fail with an array of classes, functional, and non-functional effects records', () => {
      expectSnippet(`
        EffectsModule.forFeature([fnEffectsRecord, ClassEffects, nonFnEffectsRecord]);
      `).toFail();
    });

    it('should fail with a sequence of classes, functional, and non-functional effects records', () => {
      expectSnippet(`
        EffectsModule.forFeature(nonFnEffectsRecord, fnEffectsRecord, ClassEffects);
      `).toFail();
    });
  });
});
