import { NgModuleFactoryLoader, NgModule, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  RouterTestingModule,
  SpyNgModuleFactoryLoader,
} from '@angular/router/testing';
import { Router } from '@angular/router';
import { Action, StoreModule, INIT } from '@ngrx/store';
import {
  EffectsModule,
  OnInitEffects,
  ROOT_EFFECTS_INIT,
  OnIdentifyEffects,
  EffectSources,
  Actions,
} from '..';
import { ofType, createEffect } from '../src';
import { mapTo } from 'rxjs/operators';

describe('NgRx Effects Integration spec', () => {
  it('throws if forRoot() is used more than once', (done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
      ],
    });

    let router: Router = TestBed.get(Router);
    const loader: SpyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader);

    loader.stubbedModules = { feature: FeatModuleWithForRoot };
    router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

    router.navigateByUrl('/feature-path').catch((err: TypeError) => {
      expect(err.message).toBe(
        'EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.'
      );
      done();
    });
  });

  describe('actions', () => {
    const createDispatchedReducer = (dispatchedActions: string[] = []) => (
      state = {},
      action: Action
    ) => {
      dispatchedActions.push(action.type);
      return state;
    };

    describe('init actions', () => {
      it('should dispatch and react to init effect', () => {
        let dispatchedActionsLog: string[] = [];
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({
              dispatched: createDispatchedReducer(dispatchedActionsLog),
            }),
            EffectsModule.forRoot([EffectWithOnInitAndResponse]),
          ],
        });
        TestBed.get(EffectSources);

        expect(dispatchedActionsLog).toEqual([
          INIT,

          '[EffectWithOnInitAndResponse]: INIT',
          '[EffectWithOnInitAndResponse]: INIT Response',

          ROOT_EFFECTS_INIT,
        ]);
      });

      it('should dispatch once for an instance', () => {
        let dispatchedActionsLog: string[] = [];
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({
              dispatched: createDispatchedReducer(dispatchedActionsLog),
            }),
            EffectsModule.forRoot([
              RootEffectWithInitAction,
              RootEffectWithInitAction,
              RootEffectWithInitAction2,
            ]),
            EffectsModule.forFeature([
              RootEffectWithInitAction,
              RootEffectWithInitAction2,
            ]),
          ],
        });
        TestBed.get(EffectSources);

        expect(dispatchedActionsLog).toEqual([
          INIT,

          '[RootEffectWithInitAction]: INIT',
          '[RootEffectWithInitAction2]: INIT',

          ROOT_EFFECTS_INIT,
        ]);
      });

      it('should dispatch once per instance key', () => {
        let dispatchedActionsLog: string[] = [];
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({
              dispatched: createDispatchedReducer(dispatchedActionsLog),
            }),
            EffectsModule.forRoot([]),
          ],
        });
        const effectsSources = TestBed.inject(EffectSources);

        effectsSources.addEffects(
          new FeatEffectWithIdentifierAndInitAction('One')
        );
        effectsSources.addEffects(
          new FeatEffectWithIdentifierAndInitAction('Two')
        );
        effectsSources.addEffects(
          new FeatEffectWithIdentifierAndInitAction('One')
        );
        effectsSources.addEffects(
          new FeatEffectWithIdentifierAndInitAction('Two')
        );

        expect(dispatchedActionsLog).toEqual([
          INIT,
          ROOT_EFFECTS_INIT,

          // for One
          '[FeatEffectWithIdentifierAndInitAction]: INIT',
          // for Two
          '[FeatEffectWithIdentifierAndInitAction]: INIT',
        ]);
      });
    });

    it('should dispatch actions in the correct order', async () => {
      let dispatchedActionsLog: string[] = [];
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            dispatched: createDispatchedReducer(dispatchedActionsLog),
          }),
          EffectsModule.forRoot([
            RootEffectWithInitAction,
            EffectWithOnInitAndResponse,
            RootEffectWithoutLifecycle,
            RootEffectWithInitActionWithPayload,
          ]),
          EffectsModule.forFeature([FeatEffectWithInitAction]),
          RouterTestingModule.withRoutes([]),
        ],
      });

      const effectSources = TestBed.get(EffectSources) as EffectSources;
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('one')
      );
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('two')
      );
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('one')
      );

      let router: Router = TestBed.get(Router);
      const loader: SpyNgModuleFactoryLoader = TestBed.get(
        NgModuleFactoryLoader
      );

      loader.stubbedModules = { feature: FeatModuleWithForFeature };
      router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

      await router.navigateByUrl('/feature-path');

      expect(dispatchedActionsLog).toEqual([
        // first store init
        INIT,

        // second root effects
        '[RootEffectWithInitAction]: INIT',
        '[EffectWithOnInitAndResponse]: INIT',
        '[EffectWithOnInitAndResponse]: INIT Response',
        '[RootEffectWithInitActionWithPayload]: INIT',

        // third effects init
        ROOT_EFFECTS_INIT,

        // next feat effects
        '[FeatEffectWithInitAction]: INIT',

        // lastly added features (3 effects but 2 unique keys)
        '[FeatEffectWithIdentifierAndInitAction]: INIT',
        '[FeatEffectWithIdentifierAndInitAction]: INIT',

        // from lazy loaded module
        '[FeatEffectFromLazyLoadedModuleWithInitAction]: INIT',
      ]);
    });
  });

  @Injectable()
  class EffectWithOnInitAndResponse implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[EffectWithOnInitAndResponse]: INIT' };
    }

    response = createEffect(() => {
      return this.actions$.pipe(
        ofType('[EffectWithOnInitAndResponse]: INIT'),
        mapTo({ type: '[EffectWithOnInitAndResponse]: INIT Response' })
      );
    });

    noop = createEffect(() => {
      return this.actions$.pipe(
        ofType('noop'),
        mapTo({ type: 'noop response' })
      );
    });

    constructor(private actions$: Actions) {}
  }

  class RootEffectWithInitAction implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[RootEffectWithInitAction]: INIT' };
    }
  }

  class RootEffectWithInitAction2 implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[RootEffectWithInitAction2]: INIT' };
    }
  }

  class ActionWithPayload implements Action {
    readonly type = '[RootEffectWithInitActionWithPayload]: INIT';
    readonly payload = 47;
  }

  class RootEffectWithInitActionWithPayload implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return new ActionWithPayload();
    }
  }

  class RootEffectWithoutLifecycle {}

  class FeatEffectWithInitAction implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[FeatEffectWithInitAction]: INIT' };
    }
  }

  class FeatEffectWithIdentifierAndInitAction
    implements OnInitEffects, OnIdentifyEffects {
    ngrxOnIdentifyEffects(): string {
      return this.effectIdentifier;
    }

    ngrxOnInitEffects(): Action {
      return { type: '[FeatEffectWithIdentifierAndInitAction]: INIT' };
    }

    constructor(private effectIdentifier: string) {}
  }

  class FeatEffectFromLazyLoadedModuleWithInitAction implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[FeatEffectFromLazyLoadedModuleWithInitAction]: INIT' };
    }
  }

  @NgModule({
    imports: [EffectsModule.forRoot([])],
  })
  class FeatModuleWithForRoot {}

  @NgModule({
    imports: [
      EffectsModule.forFeature([FeatEffectFromLazyLoadedModuleWithInitAction]),
      // should not be loaded because it's already loaded in forRoot
      EffectsModule.forFeature([FeatEffectWithInitAction]),
    ],
  })
  class FeatModuleWithForFeature {}
});
