import { ESLintUtils } from '@typescript-eslint/utils';
import { InvalidTestCase, ValidTestCase } from '@typescript-eslint/rule-tester';
import rule, {
  messageId,
} from '../../../src/rules/component-store/require-super-ondestroy';
import { fromFixture, ruleTester } from '../../utils';
import * as path from 'path';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState>
{
}`,
  `
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  cleanUp() {}

  override ngOnDestroy(): void {
    this.cleanUp();
    super.ngOnDestroy();
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  cleanUp() {}

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.cleanUp();
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  cleanUp() {}

  override ngOnDestroy(): void {
    this.cleanUp();
    super.ngOnDestroy();
    this.cleanUp();
  }
}`,
  `
import { ComponentStore } from '../components/component-store';

class BooksStore extends ComponentStore implements OnDestroy
{
  cleanUp() {}

  override ngOnDestroy(): void {
    this.cleanUp();
  }
}`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy {
  override ngOnDestroy(): void {
           ~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy {
  cleanUp() {}

  override ngOnDestroy(): void {
           ~~~~~~~~~~~ [${messageId}]
    this.cleanUp();
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy {
  override ngOnDestroy(): void {
           ~~~~~~~~~~~ [${messageId}]
    super.ngOnDestroy;
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store';

class BooksStore extends ComponentStore<BooksState> implements OnDestroy {
  override ngOnDestroy(): void {
           ~~~~~~~~~~~ [${messageId}]
    super.get();
  }
}`),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);
