import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/effects/use-effects-lifecycle-interface';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `class Foo {}`,
  `
class UserEffects implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[UserEffects]: Init' }
  }
}`,
  `
export class UserEffects implements OnRunEffects {
  constructor(private actions$: Actions) {}
  updateUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType('UPDATE_USER'),
        tap(action => {
          console.log(action)
        })
      ),
    { dispatch: false })
  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    )
  }
}`,
  `
    class EffectWithIdentifier implements OnIdentifyEffects {
      constructor(private effectIdentifier: string) {}
      ngrxOnIdentifyEffects() {
        return this.effectIdentifier
      }
    }`,
  `
class UserEffects implements ngrx.OnInitEffects, OnIdentifyEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[UserEffects]: Init' }
  }
  ngrxOnIdentifyEffects(): string {
    return ''
  }
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
class UserEffects {
  ngrxOnInitEffects() {}
  ~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
}`,
    {
      output: `import { OnInitEffects } from '@ngrx/effects';

class UserEffects implements OnInitEffects {
  ngrxOnInitEffects() {}
}`,
    }
  ),
  fromFixture(
    `
import Effects from '@ngrx/effects'
class UserEffects {
  ngrxOnIdentifyEffects() {}
  ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]
}`,
    {
      output: `
import Effects, { OnIdentifyEffects } from '@ngrx/effects'
class UserEffects implements OnIdentifyEffects {
  ngrxOnIdentifyEffects() {}
}`,
    }
  ),
  fromFixture(
    `
import { Injectable } from '@angular/core'
class UserEffects {
  ngrxOnRunEffects() {}
  ~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnRunEffects", "methodName": "ngrxOnRunEffects" }]
}`,
    {
      output: `import { OnRunEffects } from '@ngrx/effects';

import { Injectable } from '@angular/core'
class UserEffects implements OnRunEffects {
  ngrxOnRunEffects() {}
}`,
    }
  ),
  fromFixture(
    `
import * as ngrx from '@ngrx/effects'
class UserEffects {
  ngrxOnInitEffects() {}
  ~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
}`,
    {
      output: `import { OnInitEffects } from '@ngrx/effects';

import * as ngrx from '@ngrx/effects'
class UserEffects implements OnInitEffects {
  ngrxOnInitEffects() {}
}`,
    }
  ),
  fromFixture(
    `
import type { OnInitEffects, OnRunEffects } from '@ngrx/effects'
class UserEffects implements OnInitEffects, OnRunEffects {
  ngrxOnInitEffects() {}

  ngrxOnIdentifyEffects() {}
  ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]

  ngrxOnRunEffects() {}
}`,
    {
      output: `
import type { OnInitEffects, OnRunEffects, OnIdentifyEffects } from '@ngrx/effects'
class UserEffects implements OnInitEffects, OnRunEffects, OnIdentifyEffects {
  ngrxOnInitEffects() {}

  ngrxOnIdentifyEffects() {}

  ngrxOnRunEffects() {}
}`,
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
