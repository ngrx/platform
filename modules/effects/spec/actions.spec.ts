import { Injector } from '@angular/core';
import {
  Action,
  props,
  ScannedActionsSubject,
  ActionsSubject,
  createAction,
} from '@ngrx/store';
import { Actions, ofType } from '../';
import { firstValueFrom } from 'rxjs';
import { map, take, toArray } from 'rxjs/operators';

describe('Actions', function () {
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

  const square = createAction('SQUARE');
  const multiply = createAction('MULTYPLY', props<{ by: number }>());
  const divide = createAction('DIVIDE', props<{ by: number }>());

  const actions = [ADD, ADD, SUBTRACT, ADD, SUBTRACT];

  beforeEach(function () {
    const injector = Injector.create([
      {
        provide: ScannedActionsSubject,
        useClass: ScannedActionsSubject,
        deps: [],
      },
      { provide: ActionsSubject, useClass: ActionsSubject, deps: [] },
      { provide: Actions, useClass: Actions, deps: [ScannedActionsSubject] },
    ]);

    actions$ = injector.get(Actions);
    dispatcher = injector.get(ScannedActionsSubject);
  });

  it('should be an observable of actions', async () => {
    const testActions = [
      { type: ADD },
      { type: SUBTRACT },
      { type: SUBTRACT },
      { type: SUBTRACT },
    ];

    const resultPromise = firstValueFrom(actions$.pipe(take(1)));

    testActions.forEach((action) => dispatcher.next(action));
    dispatcher.complete();

    const value = await resultPromise;
    expect(value.type).toEqual(ADD);
  });

  it('should filter out actions', async () => {
    const expected = actions.filter((type) => type === ADD);

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(ADD),
        map((update) => update.type),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should filter out actions and ofType can take an explicit type argument', async () => {
    const expected = actions.filter((type) => type === ADD);

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType<AddAction>(ADD),
        map((update) => update.type),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should let you filter out multiple action types with explicit type argument', async () => {
    const expected = actions.filter(
      (type) => type === ADD || type === SUBTRACT
    );

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType<AddAction | SubtractAction>(ADD, SUBTRACT),
        map((update) => update.type),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should filter out actions by action creator', async () => {
    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(square),
        map((update) => update.type),
        toArray()
      )
    );

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(['SQUARE']);
  });

  it('should infer the type for the action when it is filter by action creator with property', async () => {
    const MULTYPLY_BY = 5;

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(multiply),
        map((update) => update.by),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.next(multiply({ by: MULTYPLY_BY }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual([MULTYPLY_BY]);
  });

  it('should infer the type for the action when it is filter by action creator', async () => {
    const untypedActions$: Actions = actions$;
    const MULTYPLY_BY = 5;

    const resultPromise = firstValueFrom(
      untypedActions$.pipe(
        ofType(multiply),
        map((update) => update.by),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.next(multiply({ by: MULTYPLY_BY }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual([MULTYPLY_BY]);
  });

  it('should filter out multiple actions by action creator', async () => {
    const DIVIDE_BY = 3;
    const MULTYPLY_BY = 5;
    const expected = [DIVIDE_BY, MULTYPLY_BY];

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(divide, multiply),
        map((update) => update.by),
        toArray()
      )
    );

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.next(divide({ by: DIVIDE_BY }));
    dispatcher.next(divide({ by: MULTYPLY_BY }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should filter out actions by action creator and type string', async () => {
    const expected = [...actions.filter((type) => type === ADD), square.type];

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(ADD, square),
        map((update) => update.type),
        toArray()
      )
    );

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should filter out actions by action creator and type string, with explicit type argument', async () => {
    const expected = [...actions.filter((type) => type === ADD), square.type];

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType<AddAction | ReturnType<typeof square>>(ADD, square),
        map((update) => update.type),
        toArray()
      )
    );

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should filter out up to 5 actions with type inference', async () => {
    const expected = [divide.type, ADD, square.type, SUBTRACT, multiply.type];

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(divide, ADD, square, SUBTRACT, multiply),
        map((update) => update.type),
        toArray()
      )
    );

    dispatcher.next(divide({ by: 1 }));
    dispatcher.next({ type: ADD });
    dispatcher.next(square());
    dispatcher.next({ type: SUBTRACT });
    dispatcher.next(multiply({ by: 2 }));
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });

  it('should support more than 5 actions', async () => {
    const log = createAction('logarithm');
    const expected = [
      divide.type,
      ADD,
      square.type,
      SUBTRACT,
      multiply.type,
      log.type,
    ];

    const resultPromise = firstValueFrom(
      actions$.pipe(
        ofType(divide, ADD, square, SUBTRACT, multiply, log),
        map((update) => update.type),
        toArray()
      )
    );

    dispatcher.next(divide({ by: 1 }));
    dispatcher.next({ type: ADD });
    dispatcher.next(square());
    dispatcher.next({ type: SUBTRACT });
    dispatcher.next(multiply({ by: 2 }));
    dispatcher.next(log());
    dispatcher.complete();

    const actual = await resultPromise;
    expect(actual).toEqual(expected);
  });
});
