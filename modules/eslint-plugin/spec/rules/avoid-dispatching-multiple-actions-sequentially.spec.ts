import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/store/avoid-dispatching-multiple-actions-sequentially';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'

class Ok {
ngOnInit() {
  this.dispatch(UserActions.add())
}
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
constructor(private store: Store) {}

ping() {
  this.store.dispatch(GameActions.ping())
}
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/47
  `
import { Store } from '@ngrx/store'

class Ok2 {
constructor(private store: Store) {}

pingPong() {
  if (condition) {
    this.store.dispatch(GameActions.ping())
  } else {
    this.store.dispatch(GameActions.pong())
  }
}
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/86
  `
import { Store } from '@ngrx/store'

class Ok3 {
constructor(private store: Store) {}

ngOnInit() {
  this.store.subscribe(() => {
    this.store.dispatch(one());
  });
  this.store.subscribe(() => {
    this.store.dispatch(anotherOne());
  });
}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk {
constructor(private store: Store) {}

pingPong() {
  this.store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk1 {
constructor(store: Store, private readonly store$: Store) {
  store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.ping();
  this.name = 'Bob'
  this.store$.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk2 {
constructor(private store: Store) {}

pingPongPong() {
  this.store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/44
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk3 {
constructor(private customName: Store) {}

ngOnInit() {
  customName.dispatch()
}

pingPong() {
  this.customName.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.customName.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
