import { TestBed } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import {
  EffectsModule,
  OnInitEffects,
  ROOT_EFFECTS_INIT,
  OnIdentifyEffects,
  EffectSources,
} from '..';

describe('NgRx Effects Integration spec', () => {
  let dispatch: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EffectsModule.forRoot([
          RootEffectWithInitAction,
          RootEffectWithoutLifecycle,
          RootEffectWithInitActionWithPayload,
        ]),
        EffectsModule.forFeature([FeatEffectWithInitAction]),
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch'),
          },
        },
      ],
    });

    const store = TestBed.get(Store) as Store<any>;

    const effectSources = TestBed.get(EffectSources) as EffectSources;
    effectSources.addEffects(new FeatEffectWithIdentifierAndInitAction('one'));
    effectSources.addEffects(new FeatEffectWithIdentifierAndInitAction('two'));
    effectSources.addEffects(new FeatEffectWithIdentifierAndInitAction('one'));

    dispatch = store.dispatch as jasmine.Spy;
  });

  it('should dispatch init actions in the correct order', () => {
    expect(dispatch.calls.count()).toBe(7);

    // All of the root effects init actions are dispatched first
    expect(dispatch.calls.argsFor(0)).toEqual([
      { type: '[RootEffectWithInitAction]: INIT' },
    ]);

    expect(dispatch.calls.argsFor(1)).toEqual([new ActionWithPayload()]);

    // After all of the root effects are registered, the ROOT_EFFECTS_INIT action is dispatched
    expect(dispatch.calls.argsFor(2)).toEqual([{ type: ROOT_EFFECTS_INIT }]);

    // After the root effects init, the feature effects are dispatched
    expect(dispatch.calls.argsFor(3)).toEqual([
      { type: '[FeatEffectWithInitAction]: INIT' },
    ]);

    expect(dispatch.calls.argsFor(4)).toEqual([
      { type: '[FeatEffectWithIdentifierAndInitAction]: INIT' },
    ]);

    expect(dispatch.calls.argsFor(5)).toEqual([
      { type: '[FeatEffectWithIdentifierAndInitAction]: INIT' },
    ]);

    // While the effect has the same identifier the init effect action is still being dispatched
    expect(dispatch.calls.argsFor(6)).toEqual([
      { type: '[FeatEffectWithIdentifierAndInitAction]: INIT' },
    ]);
  });

  class RootEffectWithInitAction implements OnInitEffects {
    ngrxOnInitEffects(): Action {
      return { type: '[RootEffectWithInitAction]: INIT' };
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
});
