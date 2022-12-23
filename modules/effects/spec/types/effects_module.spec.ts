import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('EffectsModule()', () => {
  const expectSnippet = expecter(
    (code) => `
      import { EffectsModule } from '@ngrx/effects';

      class EffectFixture {}

      ${code}`,
    compilerOptions()
  );

  describe('forRoot', () => {
    it('should compile without params', () => {
      expectSnippet(`
        EffectsModule.forRoot();
      `).toSucceed();
    });

    it('should compile with a single param', () => {
      expectSnippet(`
        EffectsModule.forRoot(EffectFixture);
      `).toSucceed();
    });

    it('should compile with an array param', () => {
      expectSnippet(`
        EffectsModule.forRoot([EffectFixture]);
      `).toSucceed();
    });

    it('should compile with a spreaded array param', () => {
      expectSnippet(`
        EffectsModule.forRoot(EffectFixture, EffectFixture);
      `).toSucceed();
    });
  });

  describe('forFeature', () => {
    it('should compile without params', () => {
      expectSnippet(`
        EffectsModule.forFeature();
      `).toSucceed();
    });

    it('should compile with a single param', () => {
      expectSnippet(`
        EffectsModule.forFeature(EffectFixture);
      `).toSucceed();
    });

    it('should compile with an array param', () => {
      expectSnippet(`
        EffectsModule.forFeature([EffectFixture]);
      `).toSucceed();
    });

    it('should compile with a spreaded array param', () => {
      expectSnippet(`
        EffectsModule.forFeature(EffectFixture, EffectFixture);
      `).toSucceed();
    });
  });
});
