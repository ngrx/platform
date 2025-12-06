import { vi } from 'vitest';
import { NgModule, Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Action, StoreModule, INIT } from '@ngrx/store';
import { concat, exhaustMap, map, NEVER, Observable, of, tap } from 'rxjs';
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

describe('NgRx Effects Integration spec', () => {
  it('throws if forRoot() with Effects is used more than once', async () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
      ],
    });

    const router: Router = TestBed.inject(Router);
    router.resetConfig([
      {
        path: 'feature-path',
        loadChildren: () => Promise.resolve(FeatModuleWithForRoot),
      },
    ]);

    await expect(router.navigateByUrl('/feature-path')).rejects.toThrow(
      'EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.'
    );
  });

  it('does not throw if forRoot() is used more than once with empty effects', async () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
      ],
    });

    const router: Router = TestBed.inject(Router);
    router.resetConfig([
      {
        path: 'feature-path',
        loadChildren: () => Promise.resolve(FeatModuleWithEmptyForRoot),
      },
    ]);

    await expect(router.navigateByUrl('/feature-path')).resolves.toBeTruthy();
  });

  it('runs provided class and functional effects', () => {
    const obs$ = concat(of('ngrx'), NEVER);
    const classEffectRun = vi.fn();
    const functionalEffectRun = vi.fn();
    const classEffect$ = createEffect(() => obs$.pipe(tap(classEffectRun)), {
      dispatch: false,
    });
    const functionalEffect = createEffect(
      () => obs$.pipe(tap(functionalEffectRun)),
      {
        functional: true,
        dispatch: false,
      }
    );

    class ClassEffects1 {
      classEffect$ = classEffect$;
    }

    class ClassEffects2 {
      classEffect$ = classEffect$;
    }

    const functionalEffects1 = { functionalEffect };
    const functionalEffects2 = { functionalEffect };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(),
        EffectsModule.forRoot(ClassEffects1, functionalEffects1),
        EffectsModule.forFeature(
          ClassEffects1,
          functionalEffects2,
          ClassEffects2
        ),
        EffectsModule.forFeature(
          functionalEffects1,
          functionalEffects2,
          ClassEffects2
        ),
      ],
    });
    TestBed.inject(EffectSources);

    expect(classEffectRun).toHaveBeenCalledTimes(2);
    expect(functionalEffectRun).toHaveBeenCalledTimes(2);
  });

  it('runs user provided effects defined as injection token', () => {
    const userProvidedEffectRun = vi.fn();

    const TOKEN_EFFECTS = new InjectionToken('Token Effects', {
      providedIn: 'root',
      factory: () => ({
        userProvidedEffect$: createEffect(
          () => concat(of('ngrx'), NEVER).pipe(tap(userProvidedEffectRun)),
          { dispatch: false }
        ),
      }),
    });

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [
        {
          provide: USER_PROVIDED_EFFECTS,
          useValue: [TOKEN_EFFECTS],
          multi: true,
        },
      ],
    });
    TestBed.inject(EffectSources);

    expect(userProvidedEffectRun).toHaveBeenCalledTimes(1);
  });

  describe('actions', () => {
    const createDispatchedReducer =
      (dispatchedActions: string[] = []) =>
      (state = {}, action: Action) => {
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

      router.resetConfig([
        {
          path: 'feature-path',
          loadChildren: () => Promise.resolve(FeatModuleWithForFeature),
        },
      ]);

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
      router.resetConfig([
        {
          path: 'feature-path',
          loadChildren: () =>
            Promise.resolve(FeatModuleWithUserProvidedEffects),
        },
      ]);

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
        map(() => ({ type: '[EffectWithOnInitAndResponse]: INIT Response' }))
      );
    });

    noop = createEffect(() => {
      return this.actions$.pipe(
        ofType('noop'),
        map(() => ({ type: 'noop response' }))
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
    implements OnInitEffects, OnIdentifyEffects
  {
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
