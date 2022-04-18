import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-effect-callback-in-block-statement';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
  @Injectable()
  class Effect {
    effectOK = createEffect(() => {
      return this.actions.pipe(
        ofType('PING'),
        map(() => ({ type: 'PONG' }))
      )
    })
  }`,
  `
@Injectable()
class Effect {
  effectOK1 = createEffect(() => {
    return this.actions.pipe(
      ofType('PING'),
      tap(() => doSomething())
    )
  }, {dispatch: false})
}`,
  `
@Injectable()
class Effect {
  effectOK2 = createEffect(() => ({ debounce = 200 } = {}) => {
    return this.actions$.pipe()
  })
}`,
  `
@Injectable()
class Effect {
  readonly effectOK3: CreateEffectMetadata;

  constructor() {
    this.effectOK3 = createEffect(function () {
      return ({ debounce = defaultDebounce } = {}) => {
        return this.actions$.pipe()
      }
    })
  }
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
@Injectable()
class Effect {
  effectNOK = createEffect(() => this.actions.pipe(ofType('PING'),map(() => ({ type: 'PONG' }))))
                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}`,
    {
      output: `
@Injectable()
class Effect {
  effectNOK = createEffect(() => { return this.actions.pipe(ofType('PING'),map(() => ({ type: 'PONG' }))) })
}`,
    }
  ),
  fromFixture(
    `
@Injectable()
class Effect {
  effectNOK1 = createEffect(() =>
    (condition ? this.actions.pipe() : of({})),
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    { dispatch: false }
  )
}`,
    {
      output: `
@Injectable()
class Effect {
  effectNOK1 = createEffect(() =>
    { return (condition ? this.actions.pipe() : of({})) },
    { dispatch: false }
  )
}`,
    }
  ),
  fromFixture(
    `
@Injectable()
class Effect {
  effectNOK2 = createEffect(
    () => ({ debounce = 500 } = {}) => (this.actions$.pipe())
                                        ~~~~~~~~~~~~~~~~~~~~  [${messageId}]
  )
}`,
    {
      output: `
@Injectable()
class Effect {
  effectNOK2 = createEffect(
    () => ({ debounce = 500 } = {}) => { return (this.actions$.pipe()) }
  )
}`,
    }
  ),
  fromFixture(
    `
@Injectable()
class Effect {
  effectNOK3 = createEffect(() => {
    return ({ scheduler = asyncScheduler } = {}) => this.actions$.pipe()
                                                    ~~~~~~~~~~~~~~~~~~~~  [${messageId}]
  })
}`,
    {
      output: `
@Injectable()
class Effect {
  effectNOK3 = createEffect(() => {
    return ({ scheduler = asyncScheduler } = {}) => { return this.actions$.pipe() }
  })
}`,
    }
  ),
  fromFixture(
    `
@Injectable()
class Effect {
  readonly effectNOK4: CreateEffectMetadata;

  constructor() {
    this.effectNOK4 = createEffect(
      () =>
        ({ debounce = 700 } = {}) =>
          this.actions$.pipe(),
          ~~~~~~~~~~~~~~~~~~~~  [${messageId}]
    )
  }
}`,
    {
      output: `
@Injectable()
class Effect {
  readonly effectNOK4: CreateEffectMetadata;

  constructor() {
    this.effectNOK4 = createEffect(
      () =>
        ({ debounce = 700 } = {}) =>
          { return this.actions$.pipe() },
    )
  }
}`,
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
