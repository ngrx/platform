import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/effects/no-multiple-actions-in-effects';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
@Injectable()
export class Effects {
  effectOK$ = createEffect(() =>
    this.actions$.pipe(map(() => foo()))
  )
}`,
  `
@Injectable()
export class Effects {
  effectOK1$ = createEffect(() =>
    this.actions$.pipe(switchMap(() => {
      return of(foo())
    }))
  )
}`,
  `
const action = () => foo()
@Injectable()
export class Effects {
  effectOK2$ = createEffect(() => ({ debounce = 700 } = {}) =>
    this.actions$.pipe(mapTo(action()))
  )
}`,
  // This specific test ensures that we only care about built-in `rxjs` operators.
  `
@Injectable()
export class Effects {
  effectOK3$ = createEffect(() =>
    this.actions$.pipe(
      aconcatMapTo([foo()]),
      switchMapTop([bar()]),
    )
  )
}`,
  `
const foo = {type: 'foo'}
@Injectable()
export class Effects {
  effectOK4$: CreateEffectMetadata

  constructor() {
    this.effectOK4$ = createEffect(() =>
      this.actions$.pipe(
        exhaustMap(() => {
          return of({}).pipe(
            map(() => foo),
            catchError(() => of(bar()))
          );
        })
      )
    )
  }
}`,
  `
export const saveSearchCriteria$ = createEffect(
  (actions$ = inject(Actions$), store = inject(Store), saveLoadService = inject(SaveLoadService)) => {
    return actions$.pipe(
      ofType(SearchCriteriaActions.save),
      concatLatestFrom(() => store.select(inventoryFeature.selectInventoryItems)),
      concatMap(([{ searchCriteriaName }, inventoryItems]) => {
        const tags = Object.keys(inventoryItems)
          .filter((inventoryType) => {
            const [, inventorySearchType] = splitInventoryType(inventoryType as InventoryType);
            return inventorySearchType === 'costCenter' || inventorySearchType === 'wbs';
          })
          .map((inventoryType) => splitInventoryType(inventoryType as InventoryType))
          .map(([value, type]) => ({ value, type }));
        return saveLoadService.saveSearch(searchCriteriaName, tags, false).pipe(
          map(() => SearchCriteriaActions.saveSucceeded()),
          catchError((error: Error) => {
            if (error instanceof HttpErrorResponse && error.status === 409) {
              return of(SearchCriteriaActions.saveAlreadyExists({ searchCriteriaName, tags }));
            }

            return defaultErrorHadnler(error, 'inventoryDomain.messages.saveSearchFailed', SearchCriteriaActions.saveFailed());
          })
        );
      })
    );
  },
  { functional: true }
);
  `,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
@Injectable()
export class Effects {
  effectNOK$ = createEffect(() =>
    this.actions$.pipe(flatMap(_ => [foo(), bar()])),
                                    ~~~~~~~~~~~~~~  [${messageId}]
  )
}`
  ),
  fromFixture(
    `
@Injectable()
export class Effects {
  effectNOK1$ = createEffect(() =>
    this.actions$.pipe(mergeMap(_ => { return [foo(), bar()] }))
                                              ~~~~~~~~~~~~~~  [${messageId}]
  )
}`
  ),
  fromFixture(
    `
@Injectable()
export class Effects {
  effectNOK2$ = createEffect(() =>
    this.actions$.pipe(exhaustMap(function() { return [foo(), bar()] }))
                                                      ~~~~~~~~~~~~~~  [${messageId}]
  )
}`
  ),
  fromFixture(
    `
import { of } from 'rxjs'
@Injectable()
export class Effects {
  readonly effectNOK3$ = createEffect(() =>
    this.actions$.pipe(concatMapTo(condition ? [foo(), bar()] : of(foo())))
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  [${messageId}]
  )
}`
  ),
  fromFixture(
    `
const actions = [foo(), bar()]
@Injectable()
export class Effects {
  readonly effectNOK4$ = createEffect(() =>
    this.actions$.pipe(concatMapTo(actions))
                                   ~~~~~~~  [${messageId}]
  )
}`
  ),
  fromFixture(
    `
const actions = () => [foo(), bar()]
@Injectable()
export class Effects {
  effectNOK5$ = createEffect(() =>
    condition
      ? this.actions$.pipe(
          exhaustMap(() => {
            return of({}).pipe(
              switchMap(() => actions()),
                              ~~~~~~~~~  [${messageId}]
              catchError(() => of(bar())),
            )
          }),
        )
      : this.actions.pipe(),
  )
}`
  ),
  fromFixture(
    `
import { Action } from '@ngrx/store'
@Injectable()
export class Effects {
  effectNOK6$ = createEffect(() =>
    this.actions$.pipe(concatMap(() => {
      let actions: Action[] = [];
      return actions;
             ~~~~~~~  [${messageId}]
    }))
  )
}`
  ),
  fromFixture(
    `
import { Action } from '@ngrx/store'
import { of } from 'rxjs'
@Injectable()
export class Effects {
  readonly effectNOK7$: CreateEffectMetadata

  constructor() {
    effectNOK7$ = createEffect(() => ({ debounce = 300 } = {}) =>
      this.actions$.pipe(switchMap(() => {
        let actions: Action[] | null;
        return actions ?? of(foo());
               ~~~~~~~~~~~~~~~~~~~~  [${messageId}]
      }))
    )
  }
}`
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
