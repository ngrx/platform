import { Provider } from '@angular/core';
import {
  Actions,
  EffectSources,
  EffectsRootModule,
  EffectsRunner,
  ROOT_EFFECTS,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NEVER } from 'rxjs';
import { MockEffectsRunner } from './mock_effects_runner';
import { MockEffectsSources } from './mock_effects_sources';

export function provideMockEffects(): Provider[] {
  return [
    {
      provide: EffectSources,
      useClass: MockEffectsSources,
    },
    {
      provide: EffectsRunner,
      useClass: MockEffectsRunner,
    },
    {
      provide: ROOT_EFFECTS,
      useValue: [],
    },
    {
      provide: Actions,
      useValue: NEVER,
    },
    {
      provide: EffectsRootModule,
      useFactory: mockRootModule,
      deps: [EffectSources, EffectsRunner, ROOT_EFFECTS, Store],
    },
  ];
}

export function mockRootModule(
  sources: EffectSources,
  runner: EffectsRunner,
  rootEffects: [],
  store: Store<any>
) {
  return new EffectsRootModule(
    sources,
    runner,
    store,
    rootEffects,
    undefined,
    undefined,
    undefined
  );
}
