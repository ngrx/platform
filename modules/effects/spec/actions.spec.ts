import { Injector } from '@angular/core';
import {
  Action,
  props,
  ScannedActionsSubject,
  ActionsSubject,
  createAction,
} from '@ngrx/store';
import { Actions, ofType } from '../';
import { map, toArray } from 'rxjs/operators';

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

  // Class-based Action types
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

  it('should be an observable of actions', (done) => {
    const actions = [
      { type: ADD },
      { type: SUBTRACT },
      { type: SUBTRACT },
      { type: SUBTRACT },
    ];

    const iterations = [...actions];

    actions$.subscribe({
      next(value) {
        const change = iterations.shift();
        expect(value.type).toEqual(change?.type);
        done();
      },
    });

    actions.forEach((action) => dispatcher.next(action));
    dispatcher.complete();
  });

  it('should filter out actions', (done) => {
    const expected = actions.filter((type) => type === ADD);

    actions$
      .pipe(
        ofType(ADD),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();
  });

  it('should filter out actions and ofType can take an explicit type argument', (done) => {
    const expected = actions.filter((type) => type === ADD);

    actions$
      .pipe(
        ofType<AddAction>(ADD),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();
  });

  it('should let you filter out multiple action types with explicit type argument', (done) => {
    const expected = actions.filter(
      (type) => type === ADD || type === SUBTRACT
    );

    actions$
      .pipe(
        ofType<AddAction | SubtractAction>(ADD, SUBTRACT),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    actions.forEach((action) => dispatcher.next({ type: action }));
    dispatcher.complete();
  });

  it('should filter out actions by action creator', (done) => {
    actions$
      .pipe(
        ofType(square),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(['SQUARE']);
          done();
        },
      });

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );
    dispatcher.complete();
  });

  it('should infer the type for the action when it is filter by action creator with property', (done) => {
    const MULTYPLY_BY = 5;

    actions$
      .pipe(
        ofType(multiply),
        map((update) => update.by),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual([MULTYPLY_BY]);
          done();
        },
      });

    // Unrelated Actions
    actions.forEach((action) => dispatcher.next({ type: action }));
    // Action under test
    dispatcher.next(multiply({ by: MULTYPLY_BY }));
    dispatcher.complete();
  });

  it('should infer the type for the action when it is filter by action creator', (done) => {
    // Types are not provided for generic Actions
    const untypedActions$: Actions = actions$;
    const MULTYPLY_BY = 5;

    untypedActions$
      .pipe(
        ofType(multiply),
        // Type is infered, even though untypedActions$ is Actions<Action>
        map((update) => update.by),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual([MULTYPLY_BY]);
          done();
        },
      });

    // Unrelated Actions
    actions.forEach((action) => dispatcher.next({ type: action }));
    // Action under test
    dispatcher.next(multiply({ by: MULTYPLY_BY }));
    dispatcher.complete();
  });

  it('should filter out multiple actions by action creator', (done) => {
    const DIVIDE_BY = 3;
    const MULTYPLY_BY = 5;
    const expected = [DIVIDE_BY, MULTYPLY_BY];

    actions$
      .pipe(
        ofType(divide, multiply),
        // Both have 'by' property
        map((update) => update.by),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    // Unrelated Actions
    actions.forEach((action) => dispatcher.next({ type: action }));
    // Actions under test, in specific order
    dispatcher.next(divide({ by: DIVIDE_BY }));
    dispatcher.next(divide({ by: MULTYPLY_BY }));
    dispatcher.complete();
  });

  it('should filter out actions by action creator and type string', (done) => {
    const expected = [...actions.filter((type) => type === ADD), square.type];

    actions$
      .pipe(
        ofType(ADD, square),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );

    dispatcher.complete();
  });

  it('should filter out actions by action creator and type string, with explicit type argument', (done) => {
    const expected = [...actions.filter((type) => type === ADD), square.type];

    actions$
      .pipe(
        // Provided type overrides any inference from arguments
        ofType<AddAction | ReturnType<typeof square>>(ADD, square),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    [...actions, square.type].forEach((action) =>
      dispatcher.next({ type: action })
    );

    dispatcher.complete();
  });

  it('should filter out up to 5 actions with type inference', (done) => {
    // Mixing all of them, up to 5
    const expected = [divide.type, ADD, square.type, SUBTRACT, multiply.type];

    actions$
      .pipe(
        ofType(divide, ADD, square, SUBTRACT, multiply),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    // Actions under test, in specific order
    dispatcher.next(divide({ by: 1 }));
    dispatcher.next({ type: ADD });
    dispatcher.next(square());
    dispatcher.next({ type: SUBTRACT });
    dispatcher.next(multiply({ by: 2 }));
    dispatcher.complete();
  });

  it('should support more than 5 actions', (done) => {
    const log = createAction('logarithm');
    const expected = [
      divide.type,
      ADD,
      square.type,
      SUBTRACT,
      multiply.type,
      log.type,
    ];

    actions$
      .pipe(
        // Mixing all of them, more than 5. It still works, but we loose the type info
        ofType(divide, ADD, square, SUBTRACT, multiply, log),
        map((update) => update.type),
        toArray()
      )
      .subscribe({
        next(actual) {
          expect(actual).toEqual(expected);
          done();
        },
      });

    // Actions under test, in specific order
    dispatcher.next(divide({ by: 1 }));
    dispatcher.next({ type: ADD });
    dispatcher.next(square());
    dispatcher.next({ type: SUBTRACT });
    dispatcher.next(multiply({ by: 2 }));
    dispatcher.next(log());
    dispatcher.complete();
  });
});
