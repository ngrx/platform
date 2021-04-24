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
  USER_PROVIDED_EFFECTS,
} from '..';
import { ofType, createEffect, OnRunEffects, EffectNotification } from '../src';
import { mapTo, exhaustMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

describe('NgRx Effects Integration spec', () => {
  it('throws if forRoot() with Effects is used more than once', (done: any) => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
      ],
    });

    const router: Router = TestBed.inject(Router);
    const loader: SpyNgModuleFactoryLoader = TestBed.inject(
      NgModuleFactoryLoader
    ) as SpyNgModuleFactoryLoader;

    loader.stubbedModules = { feature: FeatModuleWithForRoot };
    router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

    router.navigateByUrl('/feature-path').catch((err: TypeError) => {
      expect(err.message).toBe(
        'EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.'
      );
      done();
    });
  });

  it('does not throw if forRoot() is used more than once with empty effects', (done: any) => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
      ],
    });

    const router: Router = TestBed.inject(Router);
    const loader: SpyNgModuleFactoryLoader = TestBed.inject(
      NgModuleFactoryLoader
    ) as SpyNgModuleFactoryLoader;

    //                       empty forRoot([]) 👇
    loader.stubbedModules = { feature: FeatModuleWithEmptyForRoot };
    router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

    router.navigateByUrl('/feature-path').then(() => {
      // success
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
        const dispatchedActionsLog: string[] = [];
        TestBed.configureTestingModule({
          imports: [
            StoreModule.forRoot({
              dispatched: createDispatchedReducer(dispatchedActionsLog),
            }),
            EffectsModule.forRoot([EffectWithOnInitAndResponse]),
          ],
        });
        TestBed.inject(EffectSources);

        expect(dispatchedActionsLog).toEqual([
          INIT,

          '[EffectWithOnInitAndResponse]: INIT',
          '[EffectWithOnInitAndResponse]: INIT Response',

          ROOT_EFFECTS_INIT,
        ]);
      });

      it('should dispatch once for an instance', () => {
        const dispatchedActionsLog: string[] = [];
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
        TestBed.inject(EffectSources);

        expect(dispatchedActionsLog).toEqual([
          INIT,

          '[RootEffectWithInitAction]: INIT',
          '[RootEffectWithInitAction2]: INIT',

          ROOT_EFFECTS_INIT,
        ]);
      });

      it('should dispatch once per instance key', () => {
        const dispatchedActionsLog: string[] = [];
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
      const dispatchedActionsLog: string[] = [];
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            dispatched: createDispatchedReducer(dispatchedActionsLog),
          }),
          EffectsModule.forRoot([
            EffectLoggerWithOnRunEffects,
            RootEffectWithInitAction,
            EffectWithOnInitAndResponse,
            RootEffectWithoutLifecycle,
            RootEffectWithInitActionWithPayload,
          ]),
          EffectsModule.forFeature([FeatEffectWithInitAction]),
          RouterTestingModule.withRoutes([]),
        ],
      });

      const logger = TestBed.inject(EffectLoggerWithOnRunEffects);

      const effectSources = TestBed.inject(EffectSources);
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('one')
      );
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('two')
      );
      effectSources.addEffects(
        new FeatEffectWithIdentifierAndInitAction('one')
      );

      const router: Router = TestBed.inject(Router);
      const loader: SpyNgModuleFactoryLoader = TestBed.inject(
        NgModuleFactoryLoader
      ) as SpyNgModuleFactoryLoader;

      loader.stubbedModules = { feature: FeatModuleWithForFeature };
      router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

      await router.navigateByUrl('/feature-path');

      const expectedLog = [
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
      ];

      // reducers should receive all actions
      expect(dispatchedActionsLog).toEqual(expectedLog);

      // ngrxOnRunEffects should receive all actions except STORE_INIT
      expect(logger.actionsLog).toEqual(expectedLog.slice(1));
    });

    it('should dispatch user provided effects actions in order', async () => {
      const dispatchedActionsLog: string[] = [];
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            dispatched: createDispatchedReducer(dispatchedActionsLog),
          }),
          EffectsModule.forRoot([
            EffectLoggerWithOnRunEffects,
            RootEffectWithInitAction,
          ]),
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          UserProvidedEffect1,
          {
            provide: USER_PROVIDED_EFFECTS,
            multi: true,
            useValue: [UserProvidedEffect1],
          },
        ],
      });

      const logger = TestBed.inject(EffectLoggerWithOnRunEffects);
      const router: Router = TestBed.inject(Router);
      const loader: SpyNgModuleFactoryLoader = TestBed.inject(
        NgModuleFactoryLoader
      ) as SpyNgModuleFactoryLoader;

      loader.stubbedModules = { feature: FeatModuleWithUserProvidedEffects };
      router.resetConfig([{ path: 'feature-path', loadChildren: 'feature' }]);

      await router.navigateByUrl('/feature-path');

      const expectedLog = [
        // Store init
        INIT,

        // Root effects
        '[RootEffectWithInitAction]: INIT',

        // User provided effects loaded by root module
        '[UserProvidedEffect1]: INIT',

        // Effects init
        ROOT_EFFECTS_INIT,

        // User provided effects loaded by feature module
        '[UserProvidedEffect2]: INIT',
      ];
      expect(dispatchedActionsLog).toEqual(expectedLog);
    });
  });

  @Injectable()
  class EffectLoggerWithOnRunEffects implements OnRunEffects {
    actionsLog: string[] = [];

    constructor(private actions$: Actions) {}

    ngrxOnRunEffects(
      resolvedEffects$: Observable<EffectNotification>
    ): Observable<EffectNotification> {
      return this.actions$.pipe(
        tap((action) => this.actionsLog.push(action.type)),
        exhaustMap(() => resolvedEffects$)
      );
    }
  }

  @Injectable()
  class EffectWithOnInitAndResponse implements OnInitEffects {
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

    ngrxOnInitEffects(): Action {
      return { type: '[EffectWithOnInitAndResponse]: INIT' };
    }
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

  class UserProvidedEffect1 implements OnInitEffects {
    public ngrxOnInitEffects(): Action {
      return { type: '[UserProvidedEffect1]: INIT' };
    }
  }

  class UserProvidedEffect2 implements OnInitEffects {
    public ngrxOnInitEffects(): Action {
      return { type: '[UserProvidedEffect2]: INIT' };
    }
  }

  @NgModule({
    imports: [EffectsModule.forFeature()],
    providers: [
      UserProvidedEffect2,
      {
        provide: USER_PROVIDED_EFFECTS,
        multi: true,
        useValue: [UserProvidedEffect2],
      },
    ],
  })
  class FeatModuleWithUserProvidedEffects {}

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

  @Injectable()
  class SomeEffect {}

  @NgModule({
    imports: [EffectsModule.forRoot([SomeEffect])],
  })
  class FeatModuleWithForRoot {}

  @NgModule({
    imports: [EffectsModule.forRoot([])],
  })
  class FeatModuleWithEmptyForRoot {}

  @NgModule({
    imports: [
      EffectsModule.forFeature([FeatEffectFromLazyLoadedModuleWithInitAction]),
      // should not be loaded because it's already loaded in forRoot
      EffectsModule.forFeature([FeatEffectWithInitAction]),
    ],
  })
  class FeatModuleWithForFeature {}
});
