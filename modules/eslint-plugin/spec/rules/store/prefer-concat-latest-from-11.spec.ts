import * as path from 'path';
import rule from '../../../src/rules/effects/prefer-concat-latest-from';
import { NGRX_MODULE_PATHS } from '../../../src/utils';
import { ruleTester } from '../../utils';

const validNgrx11 = [
  `
import { of, withLatestFrom } from 'rxjs';

class Ok {
  effect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
        switchMap(([action, bookCollection]) => {
          return of({ type: 'noop' })
        }),
      ),
  );
}`,
];

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '11.0.0' }).run(
  path.parse(__filename).name,
  rule,
  { valid: validNgrx11, invalid: [] }
);
