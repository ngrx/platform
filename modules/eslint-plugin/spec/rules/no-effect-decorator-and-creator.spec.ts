import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  noEffectDecoratorAndCreator,
  noEffectDecoratorAndCreatorSuggest,
} from '../../src/rules/effects/no-effect-decorator-and-creator';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
@Injectable()
export class FixtureEffects {
  creator = createEffect(() => this.actions)
  constructor(private actions: Actions) {}
}`,
  `
@Injectable()
export class FixtureEffects {
  @Effect({ dispatch: false })
  decorator = this.actions
  constructor(private actions: Actions) {}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Effect } from '@ngrx/effects'
@Injectable()
export class FixtureEffects {
  @Effect()
  both = createEffect(() => this.actions)
  ~~~~ [${noEffectDecoratorAndCreator}]
  constructor(private actions: Actions) {}
}
@Injectable()
export class FixtureEffects2 {
  @Effect() source$ = defer(() => {
    return mySocketService.connect()
  })
}`,
    {
      output: `
import { Effect } from '@ngrx/effects'
@Injectable()
export class FixtureEffects {
  
  both = createEffect(() => this.actions)
  constructor(private actions: Actions) {}
}
@Injectable()
export class FixtureEffects2 {
  @Effect() source$ = defer(() => {
    return mySocketService.connect()
  })
}`,
    }
  ),
  {
    code: `
import {Effect} from '@ngrx/effects'
@Injectable()
export class FixtureEffects {
  @Effect({ dispatch: false })
  both = createEffect(() => this.actions)
  constructor(private actions: Actions) {}
}`,
    errors: [
      {
        column: 3,
        endColumn: 7,
        line: 6,
        messageId: noEffectDecoratorAndCreator,
        suggestions: [
          {
            messageId: noEffectDecoratorAndCreatorSuggest as MessageIds,
            output: `

@Injectable()
export class FixtureEffects {
  
  both = createEffect(() => this.actions)
  constructor(private actions: Actions) {}
}`,
          },
        ],
      },
    ],
  },
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
