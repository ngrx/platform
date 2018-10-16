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
  let actions$: Actions<AddAction | SubtractAction>;
  let dispatcher: ScannedActionsSubject;

  const ADD = 'ADD';
  const SUBTRACT = 'SUBTRACT';

  interface AddAction extends Action {
    type: 'ADD';
  }

  interface SubtractAction extends Action {
    type: 'SUBTRACT';
  }

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

  const actions = [ADD, ADD, SUBTRACT, ADD, SUBTRACT];
  const expected = actions.filter(type => type === ADD);

  it('should let you filter out actions', function() {
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

  it('should let you filter out actions and ofType can take an explicit type argument', function() {
    actions$
      .pipe(
        ofType<AddAction>(ADD),
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
});
