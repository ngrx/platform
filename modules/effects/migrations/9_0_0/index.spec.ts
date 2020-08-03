import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createPackageJson } from '@ngrx/schematics-core/testing/create-package';

describe('Effects Migration 9_0_0', () => {
  let appTree: UnitTestTree;
  const collectionPath = path.join(__dirname, '../migration.json');
  const pkgName = 'effects';

  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create(
      '/tsconfig.json',
      `
        {
          "include": [**./*.ts"]
        }
       `
    );
    createPackageJson('', pkgName, appTree);
  });

  describe('Replaces resubscribeOnError with useEffectsErrorHandler in effect options', () => {
    describe('should replace resubscribeOnError configuration key with useEffectsErrorHandler', () => {
      it('in createEffect() effect creator', () => {
        const input = `
  import { Injectable } from '@angular/core';
  import { Actions, ofType, createEffect } from '@ngrx/effects';
  import { tap } from 'rxjs/operators';
   
  @Injectable()
  export class LogEffects {
    constructor(private actions$: Actions) {}
    
    logActions$ = createEffect(() =>
      this.actions$.pipe(
        tap(action => console.log(action))
      ), { resubscribeOnError: false });
  }
        `;

        const expected = `
  import { Injectable } from '@angular/core';
  import { Actions, ofType, createEffect } from '@ngrx/effects';
  import { tap } from 'rxjs/operators';
   
  @Injectable()
  export class LogEffects {
    constructor(private actions$: Actions) {}
    
    logActions$ = createEffect(() =>
      this.actions$.pipe(
        tap(action => console.log(action))
      ), { useEffectsErrorHandler: false });
  }
        `;

        test(input, expected);
      });

      it('in @Effect() decorator', () => {
        const input = `
  import { Injectable } from '@angular/core';
  import { Actions, Effect, ofType } from '@ngrx/effects';
  import { tap } from 'rxjs/operators';
   
  @Injectable()
  export class LogEffects {
    constructor(private actions$: Actions) {}
    
    @Effect({ resubscribeOnError: false })
    logActions$ = this.actions$.pipe(
      tap(action => console.log(action))
    )
  }
        `;

        const expected = `
  import { Injectable } from '@angular/core';
  import { Actions, Effect, ofType } from '@ngrx/effects';
  import { tap } from 'rxjs/operators';
   
  @Injectable()
  export class LogEffects {
    constructor(private actions$: Actions) {}
    
    @Effect({ useEffectsErrorHandler: false })
    logActions$ = this.actions$.pipe(
      tap(action => console.log(action))
    )
  }
        `;

        test(input, expected);
      });
    });

    describe('should not replace non-ngrx identifiers', () => {
      it('in module scope', () => {
        const input = `
export const resubscribeOnError = null;
      `;

        test(input, input);
      });

      it('within create effect callback', () => {
        const input = `
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
 
@Injectable()
export class LogEffects {
  constructor(private actions$: Actions) {}
  
  logActions$ = createEffect(() =>
    this.actions$.pipe(
      tap(resubscribeOnError => console.log(resubscribeOnError))
    ));
}
      `;

        test(input, input);
      });
    });

    async function test(input: string, expected: string) {
      appTree.create('./app.module.ts', input);
      const runner = new SchematicTestRunner('schematics', collectionPath);

      const newTree = await runner
        .runSchematicAsync(`ngrx-${pkgName}-migration-02`, {}, appTree)
        .toPromise();
      const file = newTree.readContent('app.module.ts');

      expect(file).toBe(expected);
    }
  });
});
