import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Actions,
  createEffect,
  EffectsModule,
  ofType,
  OnInitEffects,
  rootEffectsInit,
} from '@ngrx/effects';
import { Action, createAction, Store, StoreModule } from '@ngrx/store';
import { defer, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { provideMockEffects } from '../src/mock_effects';

describe('Mock Effects', () => {
  const ping = createAction('ping');
  const pong = createAction('pong');
  const reducer = jasmine.createSpy('reducer').and.returnValue({});

  @Injectable()
  class FeatureEffects implements OnInitEffects {
    pingpong$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ping),
        map(pong)
      );
    });

    hello$ = createEffect(() => {
      return defer(() => {
        return of({ type: 'Hello from Effect' });
      });
    });

    ngrxOnInitEffects(): Action {
      return { type: 'Feature initialized' };
    }

    constructor(private actions$: Actions) {}
  }

  @Injectable()
  class RootEffects {
    init$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(rootEffectsInit),
        map(pong),
        shareReplay(1)
      );
    });

    constructor(private actions$: Actions) {}
  }

  let store: Store<any>;
  let featureEffect: FeatureEffects;
  let rootEffect: RootEffects;

  beforeEach(() => {
    reducer.calls.reset();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ reducer }),
        EffectsModule.forRoot([RootEffects]),
        EffectsModule.forFeature([FeatureEffects]),
      ],
      providers: [provideMockEffects()],
    });

    store = TestBed.get(Store);
    featureEffect = TestBed.get(FeatureEffects);
    rootEffect = TestBed.get(RootEffects);
  });

  it('should not trigger effects', (done: DoneFn) => {
    featureEffect.pingpong$.subscribe(() => {
      done.fail('I should not be called');
    });
    store.dispatch(ping());
    done();
  });

  it('root lifecycles should not trigger effects', (done: DoneFn) => {
    rootEffect.init$.subscribe(() => {
      done.fail('I should not be called');
    });

    expect(reducer).not.toHaveBeenCalledWith(
      {},
      {
        type: 'Feature initialized',
      }
    );
    done();
  });

  it('feature lifecycles should not dispatch actions', () => {
    expect(reducer).not.toHaveBeenCalledWith(
      {},
      {
        type: 'Feature initialized',
      }
    );
  });

  it('should not dispatch actions from effects', () => {
    expect(reducer).not.toHaveBeenCalledWith(
      {},
      {
        type: 'Hello from Effect',
      }
    );
  });
});
