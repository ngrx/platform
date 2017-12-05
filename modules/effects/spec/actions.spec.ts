import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { ReflectiveInjector } from '@angular/core';
import {
  Action,
  StoreModule,
  ScannedActionsSubject,
  ActionsSubject,
} from '@ngrx/store';
import { Actions } from '../';

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
      .ofType(ADD)
      .map(update => update.type)
      .toArray()
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
        },
      });

    actions.forEach(action => dispatcher.next({ type: action }));
    dispatcher.complete();
  });
});
