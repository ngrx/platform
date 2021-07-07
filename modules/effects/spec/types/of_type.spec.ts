import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('ofType()', () => {
  describe('action creators', () => {
    const expectSnippet = expecter(
      (code) => `
      import { Action, createAction, props } from '@ngrx/store';
      import { Actions, ofType } from '@ngrx/effects';
      import { of } from 'rxjs';

      const actions$ = {} as Actions;

      ${code}`,
      compilerOptions()
    );

    it('should infer correctly', () => {
      expectSnippet(`
        const actionA = createAction('Action A');
        const effect = actions$.pipe(ofType(actionA))
      `).toInfer('effect', 'Observable<TypedAction<"Action A">>');
    });

    it('should infer correctly with props', () => {
      expectSnippet(`
        const actionA = createAction('Action A', props<{ foo: string }>());
        const effect = actions$.pipe(ofType(actionA))
      `).toInfer(
        'effect',
        'Observable<{ foo: string; } & TypedAction<"Action A">>'
      );
    });

    it('should infer correctly with function', () => {
      expectSnippet(`
        const actionA = createAction('Action A', (foo: string) => ({ foo }));
        const effect = actions$.pipe(ofType(actionA))
      `).toInfer(
        'effect',
        'Observable<{ foo: string; } & TypedAction<"Action A">>'
      );
    });

    it('should infer correctly with multiple actions (with over 5 actions)', () => {
      expectSnippet(`
        const actionA = createAction('Action A');
        const actionB = createAction('Action B');
        const actionC = createAction('Action C');
        const actionD = createAction('Action D');
        const actionE = createAction('Action E');
        const actionF = createAction('Action F');
        const actionG = createAction('Action G');

        const effect = actions$.pipe(ofType(actionA, actionB, actionC, actionD, actionE, actionF, actionG))
      `).toInfer(
        'effect',
        'Observable<TypedAction<"Action A"> | TypedAction<"Action B"> | TypedAction<"Action C"> | TypedAction<"Action D"> | TypedAction<"Action E"> | TypedAction<...> | TypedAction<...>>'
      );
    });
  });

  describe('strings with typed Actions', () => {
    const expectSnippet = expecter(
      (code) => `
      import { Action } from '@ngrx/store';
      import { Actions, ofType } from '@ngrx/effects';
      import { of } from 'rxjs';

      const ACTION_A = 'ACTION A'
      const ACTION_B = 'ACTION B'
      const ACTION_C = 'ACTION C'
      const ACTION_D = 'ACTION D'
      const ACTION_E = 'ACTION E'
      const ACTION_F = 'ACTION F'

      interface ActionA { type: typeof ACTION_A };
      interface ActionB { type: typeof ACTION_B };
      interface ActionC { type: typeof ACTION_C };
      interface ActionD { type: typeof ACTION_D };
      interface ActionE { type: typeof ACTION_E };
      interface ActionF { type: typeof ACTION_F };

      ${code}`,
      compilerOptions()
    );

    it('should infer correctly', () => {
      expectSnippet(`
        const actions$ = {} as Actions<ActionA>;
        const effect = actions$.pipe(ofType(ACTION_A))
      `).toInfer('effect', 'Observable<ActionA>');
    });

    it('should infer correctly with multiple actions (up to 5 actions)', () => {
      expectSnippet(`
        const actions$ = {} as Actions<ActionA | ActionB | ActionC | ActionD | ActionE>;
        const effect = actions$.pipe(ofType(ACTION_A, ACTION_B, ACTION_C, ACTION_D, ACTION_E))
      `).toInfer(
        'effect',
        'Observable<ActionA | ActionB | ActionC | ActionD | ActionE>'
      );
    });

    it('should infer to Action when more than 5 actions', () => {
      expectSnippet(`
        const actions$ = {} as Actions<ActionA | ActionB | ActionC | ActionD | ActionE | ActionF>;
        const effect = actions$.pipe(ofType(ACTION_A, ACTION_B, ACTION_C, ACTION_D, ACTION_E, ACTION_F))
      `).toInfer('effect', 'Observable<Action>');
    });

    it('should infer to never when the action is not in Actions', () => {
      expectSnippet(`
        const actions$ = {} as Actions<ActionA>;
        const effect = actions$.pipe(ofType(ACTION_B))
      `).toInfer('effect', 'Observable<never>');
    });
  });

  describe('strings ofType generic', () => {
    const expectSnippet = expecter(
      (code) => `
      import { Action } from '@ngrx/store';
      import { Actions, ofType } from '@ngrx/effects';
      import { of } from 'rxjs';

      const ACTION_A = 'ACTION A'
      const ACTION_B = 'ACTION B'
      const ACTION_C = 'ACTION C'
      const ACTION_D = 'ACTION D'
      const ACTION_E = 'ACTION E'
      const ACTION_F = 'ACTION F'

      interface ActionA { type: typeof ACTION_A };
      interface ActionB { type: typeof ACTION_B };
      interface ActionC { type: typeof ACTION_C };
      interface ActionD { type: typeof ACTION_D };
      interface ActionE { type: typeof ACTION_E };
      interface ActionF { type: typeof ACTION_F };

      ${code}`,
      compilerOptions()
    );

    it('should infer correctly', () => {
      expectSnippet(`
        const actions$ = {} as Actions;
        const effect = actions$.pipe(ofType<ActionA>(ACTION_A))
      `).toInfer('effect', 'Observable<ActionA>');
    });

    it('should infer correctly with multiple actions (with over 5 actions)', () => {
      expectSnippet(`
        const actions$ = {} as Actions;
        const effect = actions$.pipe(ofType<ActionA | ActionB | ActionC | ActionD | ActionE | ActionF>(ACTION_A, ACTION_B, ACTION_C, ACTION_D, ACTION_E, ACTION_F))
      `).toInfer(
        'effect',
        'Observable<ActionA | ActionB | ActionC | ActionD | ActionE | ActionF>'
      );
    });

    it('should infer to the generic even if the generic is wrong', () => {
      expectSnippet(`
        const actions$ = {} as Actions;
        const effect = actions$.pipe(ofType<ActionA>(ACTION_B))
      `).toInfer('effect', 'Observable<ActionA>');
    });
  });
});
