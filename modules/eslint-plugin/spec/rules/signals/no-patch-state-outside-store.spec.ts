import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/signals/no-patch-state-outside-store';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
    withMethods((store, anotherStore = inject(AnotherStore)) => ({
      doSomething() {
        patchState(store, {});
      },
    }))
  `,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(`
class TodosComponent {
  readonly store = inject(TodosStore);

  addTodo(todo: Todo): void {
    patchState(store, { todos: [todo] });
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
withMethods((store, anotherStore = inject(AnotherStore)) => ({
  doSomething() {
    patchState(store, {});
    patchState(anotherStore, {});
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    patchState(store, {});
    patchState(anotherStore, {});
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  },
}))`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
