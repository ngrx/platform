import { ReflectiveInjector } from '@angular/core';
import {
  Action,
  StoreModule,
  ScannedActionsSubject,
  ActionsSubject,
} from '@ngrx/store';
import { Actions, ofType } from '../';
import { map, toArray, switchMap } from 'rxjs/operators';
import { hot, cold } from 'jasmine-marbles';
import { of } from 'rxjs';

describe('Actions', function() {
  let actions$: Actions;
  let dispatcher: ScannedActionsSubject;

  const ADD = 'ADD';
  const SUBTRACT = 'SUBTRACT';

  function reducer(state: number = 0, action: Action) {
    switch (action.type) {
      case ADD:
        return state + 1;
      case SUBTRACT:
        return state - 1;
      default:
        return state;
    }
  }

  beforeEach(function() {
    const injector = ReflectiveInjector.resolveAndCreate([
      StoreModule.forRoot(reducer).providers || [],
      Actions,
    ]);

    actions$ = injector.get(Actions);
    dispatcher = injector.get(ScannedActionsSubject);
  });

  it('should be an observable of actions', function() {
    const actions = [
      { type: ADD },
      { type: SUBTRACT },
      { type: SUBTRACT },
      { type: SUBTRACT },
    ];

    let iterations = [...actions];

    actions$.subscribe({
      next(value) {
        let change = iterations.shift();
        expect(value.type).toEqual(change!.type);
      },
    });

    actions.forEach(action => dispatcher.next(action));
  });

  it('should let you filter out actions', function() {
    const actions = [ADD, ADD, SUBTRACT, ADD, SUBTRACT];
    const expected = actions.filter(type => type === ADD);

    actions$
      .pipe(
        ofType(ADD),
        map(update => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
        },
      });

    actions.forEach(action => dispatcher.next({ type: action }));
    dispatcher.complete();
  });

  it('should support using the ofType instance operator', () => {
    const action = { type: ADD };

    const response = cold('-b', { b: true });
    const expected = cold('--c', { c: true });

    const effect$ = new Actions(hot('-a', { a: action }))
      .ofType(ADD)
      .pipe(switchMap(() => response));

    expect(effect$).toBeObservable(expected);
  });
});
