import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-action-creator-in-of-type';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
@Injectable()
class Test {
  effectOK = createEffect(() => this.actions$.pipe(ofType(userActions.ping)))

  constructor(private readonly actions$: Actions) {}
}`,
  `
@Injectable()
class Test {
  effectOK1 = createEffect(() => this.actions$.pipe(ofType(userActions.ping.type)))

  constructor(private readonly actions$: Actions) {}
}`,
  `
@Injectable()
class Test {
  effectOK2 = createEffect(() => this.actions$.pipe(ofType(method())))

  constructor(private readonly actions$: Actions) {}
}`,
  `
@Injectable()
class Test {
  effectOK3 = createEffect(() => this.actions$.pipe(ofType(condition ? methodA() : bookActions.load)))

  constructor(private readonly actions$: Actions) {}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
@Injectable()
class Test {
  effectNOK = createEffect(() => this.actions$.pipe(ofType('PING')))
                                                           ~~~~~~ [${messageId}]

  constructor(private readonly actions$: Actions) {}
}`
  ),
  fromFixture(
    `
@Injectable()
class Test {
  effectNOK1 = createEffect(() => this.actions$.pipe(ofType(BookActions.load, 'PONG')))
                                                                              ~~~~~~ [${messageId}]

  constructor(private readonly actions$: Actions) {}
}`
  ),
  fromFixture(
    `
@Injectable()
class Test {
  effectNOK2 = createEffect(() =>
    this.actions$.pipe(ofType(legacy ? 'error here' : myAction)),
                                       ~~~~~~~~~~~~ [${messageId}]
  )

  constructor(private readonly actions$: Actions) {}
}`
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
