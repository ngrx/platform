import { ENVIRONMENT_INITIALIZER, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { map } from 'rxjs';
import {
  createAction,
  createFeatureSelector,
  createReducer,
  props,
  provideState,
  provideStore,
  Store,
} from '@ngrx/store';
import {
  Actions,
  concatLatestFrom,
  createEffect,
  EffectsRunner,
  ofType,
  provideEffects,
  rootEffectsInit,
} from '../src/index';

describe('provideEffects', () => {
  it('starts effects runner when called first time', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useValue: () => jest.spyOn(inject(EffectsRunner), 'start'),
        },
        provideStore(),
        // provide effects twice
        provideEffects(),
        provideEffects(),
      ],
    });

    const effectsRunner = TestBed.inject(EffectsRunner);
    expect(effectsRunner.start).toHaveBeenCalledTimes(1);
  });

  it('dispatches effects init action when called first time', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useValue: () => jest.spyOn(inject(Store), 'dispatch'),
        },
        provideStore(),
        // provide effects twice
        provideEffects(),
        provideEffects(),
      ],
    });

    const store = TestBed.inject(Store);
    expect(store.dispatch).toHaveBeenCalledWith(rootEffectsInit());
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('throws an error when store is not provided', () => {
    TestBed.configureTestingModule({
      // provide only effects
      providers: [provideEffects(TestEffects)],
    });

    expect(() => TestBed.inject(TestEffects)).toThrowError();
  });

  it('runs provided effects', (done) => {
    TestBed.configureTestingModule({
      providers: [provideStore(), provideEffects(TestEffects)],
    });

    const store = TestBed.inject(Store);
    const effects = TestBed.inject(TestEffects);

    effects.simpleEffect$.subscribe((action) => {
      expect(action).toEqual(simpleEffectDone());
      done();
    });

    store.dispatch(simpleEffectTest());
  });

  it('runs provided effects after root state registration', (done) => {
    TestBed.configureTestingModule({
      providers: [
        provideEffects(TestEffects),
        // provide store after effects
        provideStore({ [rootSliceKey]: createReducer('ngrx') }),
      ],
    });

    const store = TestBed.inject(Store);
    const effects = TestBed.inject(TestEffects);

    effects.effectWithRootState$.subscribe((action) => {
      expect(action).toEqual(
        effectWithRootStateDone({ [rootSliceKey]: 'ngrx' })
      );
      done();
    });

    store.dispatch(effectWithRootStateTest());
  });

  it('runs provided effects after feature state registration', (done) => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects(TestEffects),
        // provide feature state after effects
        provideState(featureSliceKey, createReducer('effects')),
      ],
    });

    const store = TestBed.inject(Store);
    const effects = TestBed.inject(TestEffects);

    effects.effectWithFeatureState$.subscribe((action) => {
      expect(action).toEqual(
        effectWithFeatureStateDone({ [featureSliceKey]: 'effects' })
      );
      done();
    });

    store.dispatch(effectWithFeatureStateTest());
  });
});

const rootSliceKey = 'rootSlice';
const featureSliceKey = 'featureSlice';
const selectRootSlice = createFeatureSelector<string>(rootSliceKey);
const selectFeatureSlice = createFeatureSelector<string>(featureSliceKey);

const simpleEffectTest = createAction('simpleEffectTest');
const simpleEffectDone = createAction('simpleEffectDone');
const effectWithRootStateTest = createAction('effectWithRootStateTest');
const effectWithRootStateDone = createAction(
  'effectWithRootStateDone',
  props<{ [rootSliceKey]: string }>()
);
const effectWithFeatureStateTest = createAction('effectWithFeatureStateTest');
const effectWithFeatureStateDone = createAction(
  'effectWithFeatureStateDone',
  props<{ [featureSliceKey]: string }>()
);

@Injectable()
class TestEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store
  ) {}

  readonly simpleEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(simpleEffectTest),
      map(() => simpleEffectDone())
    );
  });

  readonly effectWithRootState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(effectWithRootStateTest),
      concatLatestFrom(() => this.store.select(selectRootSlice)),
      map(([, rootSlice]) => effectWithRootStateDone({ rootSlice }))
    );
  });

  readonly effectWithFeatureState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(effectWithFeatureStateTest),
      concatLatestFrom(() => this.store.select(selectFeatureSlice)),
      map(([, featureSlice]) => effectWithFeatureStateDone({ featureSlice }))
    );
  });
}
