import { tags } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '@ngrx/schematics-core/testing';

describe('Effects Migration 13_0_0', () => {
  describe('@Effect to createEffect', () => {
    const collectionPath = path.join(__dirname, '../migration.json');
    const schematicRunner = new SchematicTestRunner(
      'schematics',
      collectionPath
    );

    let appTree: UnitTestTree;

    beforeEach(async () => {
      appTree = await createWorkspace(schematicRunner, appTree);
    });

    it('migrates to createEffect for dispatching effects', async () => {
      const input = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
        @Effect()
        foo$ = this.actions$.pipe(
          ofType<LoginAction>(AuthActions.login),
          tap(action => console.log(action))
        );
      }
    `;

      const output = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}

        foo$ = createEffect(() => this.actions$.pipe(
          ofType<LoginAction>(AuthActions.login),
          tap(action => console.log(action))
        ));
      }
    `;

      await runTest(input, output);
    });

    it('migrates to createEffect for non-dispatching effects', async () => {
      const input = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
        @Effect({ dispatch: false })
        bar$ = this.actions$.pipe(
          ofType(AuthActions.login, AuthActions.logout),
          tap(action => console.log(action))
        );
      }
    `;

      const output = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}

        bar$ = createEffect(() => this.actions$.pipe(
          ofType(AuthActions.login, AuthActions.logout),
          tap(action => console.log(action))
        ), { dispatch: false });
      }
    `;

      await runTest(input, output);
    });

    it('migrates to createEffect for effects as functions', async () => {
      const input = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
        @Effect()
        baz$ = ({ debounce = 300, scheduler = asyncScheduler } = {}) => this.actions$.pipe(
          ofType(login),
          tap(action => console.log(action))
        );
      }
    `;

      const output = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}

        baz$ = createEffect(() => ({ debounce = 300, scheduler = asyncScheduler } = {}) => this.actions$.pipe(
          ofType(login),
          tap(action => console.log(action))
        ));
      }
    `;

      await runTest(input, output);
    });

    it('keeps other decorators', async () => {
      const input = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
        @Effect()
        @Log()
        login$ = this.actions$.pipe(
          ofType('LOGIN'),
          map(() => ({ type: 'LOGGED_IN' }))
        );
        @Log()
        @Effect()
        logout$ = this.actions$.pipe(
          ofType('LOGOUT'),
          map(() => ({ type: 'LOGGED_OUT' }))
        );
      }
    `;

      const output = tags.stripIndent`
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}

        @Log()
        login$ = createEffect(() => this.actions$.pipe(
          ofType('LOGIN'),
          map(() => ({ type: 'LOGGED_IN' }))
        ));

        @Log()
        logout$ = createEffect(() => this.actions$.pipe(
          ofType('LOGOUT'),
          map(() => ({ type: 'LOGGED_OUT' }))
        ));
      }
    `;

      await runTest(input, output);
    });

    it('imports createEffect from effects', async () => {
      const input = tags.stripIndent`
      import { Actions, ofType, Effect } from '@ngrx/effects';
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
      }
    `;

      const output = tags.stripIndent`
      import { Actions, ofType, createEffect } from '@ngrx/effects';
      @Injectable()
      export class SomeEffectsClass {
        constructor(private actions$: Actions) {}
      }
    `;

      await runTest(input, output);
    });

    it('does not import createEffect if already imported', async () => {
      const input = tags.stripIndent`
      import { Actions, Effect, createEffect, ofType } from '@ngrx/effects';
      @Injectable()
      export class SomeEffectsClass {
        @Effect()
        logout$ = this.actions$.pipe(
          ofType('LOGOUT'),
          map(() => ({ type: 'LOGGED_OUT' }))
        );
        constructor(private actions$: Actions) {}
      }
    `;

      const output = tags.stripIndent`
      import { Actions, createEffect, ofType } from '@ngrx/effects';
      @Injectable()
      export class SomeEffectsClass {

        logout$ = createEffect(() => this.actions$.pipe(
          ofType('LOGOUT'),
          map(() => ({ type: 'LOGGED_OUT' }))
        ));
        constructor(private actions$: Actions) {}
      }
    `;

      await runTest(input, output);
    });

    it('does not migrate if the createEffect syntax is already used', async () => {
      const input = tags.stripIndent`
      import { Actions, createEffect, ofType } from '@ngrx/effects';
      @Injectable()
      export class SomeEffectsClass {
        logout$ = createEffect(() => this.actions$.pipe(
          ofType('LOGOUT'),
          map(() => ({ type: 'LOGGED_OUT' }))
        ));
        constructor(private actions$: Actions) {}
      }
    `;

      await runTest(input, input);
    });

    it('removes the @Effect decorator', async () => {
      const input = tags.stripIndent`
        import { Actions, createEffect, ofType } from '@ngrx/effects';
        @Injectable()
        export class SomeEffectsClass {
          @Effect()
          logout$ = createEffect(() => this.actions$.pipe(
            ofType('LOGOUT'),
            map(() => ({ type: 'LOGGED_OUT' }))
          ));
          constructor(private actions$: Actions) {}
        }
      `;
      const output = tags.stripIndent`
        import { Actions, createEffect, ofType } from '@ngrx/effects';
        @Injectable()
        export class SomeEffectsClass {
          logout$ = createEffect(() => this.actions$.pipe(
            ofType('LOGOUT'),
            map(() => ({ type: 'LOGGED_OUT' }))
          ));
          constructor(private actions$: Actions) {}
        }
      `;
      await runTest(input, output);
    });

    async function runTest(input: string, expected: string) {
      const effectPath = '/some.effects.ts';
      appTree.create(effectPath, input);

      const tree = await schematicRunner
        .runSchematicAsync(`ngrx-effects-migration-03`, {}, appTree)
        .toPromise();

      const actual = tree.readContent(effectPath);

      const removeEmptyLines = (value: string) =>
        value.replace(/^\s*$(?:\r\n?|\n)/gm, '');

      expect(removeEmptyLines(actual)).toBe(removeEmptyLines(expected));
    }
  });
});
