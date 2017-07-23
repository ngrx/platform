import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { ReflectiveInjector } from '@angular/core';
import { toPayload } from '@ngrx/effects';
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

    actions$.ofType(ADD).map(update => update.type).toArray().subscribe({
      next(actual) {
        expect(actual).toEqual(expected);
      },
    });

    actions.forEach(action => dispatcher.next({ type: action }));
    dispatcher.complete();
  });

  it('should let you specify types with ofType and infer the type with toPayload', function() {
    const ACTIONTYPE = 'ActionWithNumberType';
    class ActionWithNumber implements Action {
      readonly type = ACTIONTYPE;
      constructor(public payload: number) {}
    }

    const increment = (x: number) => x + 1;

    actions$
      .ofType<ActionWithNumber>(ACTIONTYPE)
      .map(toPayload)
      // Note: at this point the compiler knows the actual type of payload--it is not just "any"
      .map(payload => increment(payload))
      .subscribe({
        next(actual) {
          expect(actual).toEqual(2);
        },
      });

    dispatcher.next(new ActionWithNumber(1));
    dispatcher.complete();
  });
});
