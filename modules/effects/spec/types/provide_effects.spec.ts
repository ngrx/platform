import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('provideEffects()', () => {
  const expectSnippet = expecter(
    (code) => `
      import { provideEffects } from '@ngrx/effects';

      class EffectFixture {}

      ${code}`,
    compilerOptions()
  );

  it('should compile without params', () => {
    expectSnippet(`
        provideEffects();
      `).toSucceed();
  });

  it('should compile with a single param', () => {
    expectSnippet(`
        provideEffects(EffectFixture);
      `).toSucceed();
  });

  it('should compile with an array param', () => {
    expectSnippet(`
        provideEffects([EffectFixture]);
      `).toSucceed();
  });

  it('should compile with a spreaded array param', () => {
    expectSnippet(`
        provideEffects(EffectFixture, EffectFixture);
      `).toSucceed();
  });
});
