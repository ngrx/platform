import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import rule, {
  noReducerInKeyNames,
  noReducerInKeyNamesSuggest,
} from '../../src/rules/store/no-reducer-in-key-names';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
@NgModule({
  imports: [
    StoreModule.forRoot({
      foo,
      persons: personsReducer,
      'people': peopleReducer,
    }),
  ],
})
export class AppModule {}`,
  `
  @NgModule({
    imports: [
      StoreModule.forFeature({
        foo,
        persons: personsReducer,
        'people': peopleReducer,
      }),
    ],
  })
  export class AppModule {}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/91
  `
@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {metaReducers}),
  ],
})
export class AppModule {}`,
  `
export const reducers: ActionReducerMap<AppState> = {
  foo,
  persons: personsReducer,
  'people': peopleReducer,
};`,
];

const invalid: () => RunTests['invalid'] = () => [
  {
    code: `
@NgModule({
  imports: [
    StoreModule.forRoot({
      feeReducer,
    }),
  ],
})
export class AppModule {}`,
    errors: [
      {
        column: 7,
        endColumn: 17,
        line: 5,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
@NgModule({
  imports: [
    StoreModule.forRoot({
      fee,
    }),
  ],
})
export class AppModule {}`,
          },
        ],
      },
    ],
  },
  {
    code: `
@NgModule({
  imports: [
    StoreModule.forFeature({
      'foo-reducer': foo,
      FoeReducer: FoeReducer,
    }),
  ],
})
export class AppModule {}`,
    errors: [
      {
        column: 7,
        endColumn: 20,
        line: 5,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
@NgModule({
  imports: [
    StoreModule.forFeature({
      'foo-': foo,
      FoeReducer: FoeReducer,
    }),
  ],
})
export class AppModule {}`,
          },
        ],
      },
      {
        column: 7,
        endColumn: 17,
        line: 6,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
@NgModule({
  imports: [
    StoreModule.forFeature({
      'foo-reducer': foo,
      Foe: FoeReducer,
    }),
  ],
})
export class AppModule {}`,
          },
        ],
      },
    ],
  },
  {
    code: `
export const reducers: ActionReducerMap<AppState> = {
  feeReducer,
  'fieReducer': fie,
  ['fooReducerName']: foo,
  [\`ReducerFoe\`]: FoeReducer,
};`,
    errors: [
      {
        column: 3,
        endColumn: 13,
        line: 3,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
export const reducers: ActionReducerMap<AppState> = {
  fee,
  'fieReducer': fie,
  ['fooReducerName']: foo,
  [\`ReducerFoe\`]: FoeReducer,
};`,
          },
        ],
      },
      {
        column: 3,
        endColumn: 15,
        line: 4,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
export const reducers: ActionReducerMap<AppState> = {
  feeReducer,
  'fie': fie,
  ['fooReducerName']: foo,
  [\`ReducerFoe\`]: FoeReducer,
};`,
          },
        ],
      },
      {
        column: 4,
        endColumn: 20,
        line: 5,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
export const reducers: ActionReducerMap<AppState> = {
  feeReducer,
  'fieReducer': fie,
  ['fooName']: foo,
  [\`ReducerFoe\`]: FoeReducer,
};`,
          },
        ],
      },
      {
        column: 4,
        endColumn: 16,
        line: 6,
        messageId: noReducerInKeyNames,
        suggestions: [
          {
            messageId: noReducerInKeyNamesSuggest,
            output: `
export const reducers: ActionReducerMap<AppState> = {
  feeReducer,
  'fieReducer': fie,
  ['fooReducerName']: foo,
  [\`Foe\`]: FoeReducer,
};`,
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
