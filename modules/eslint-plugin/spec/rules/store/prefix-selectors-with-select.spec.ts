import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  prefixSelectorsWithSelect,
  prefixSelectorsWithSelectSuggest,
} from '../../../src/rules/store/prefix-selectors-with-select';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `export const selectFeature: MemoizedSelector<any, any> = (state: AppState) => state.feature`,
  `export const selectFeature: MemoizedSelectorWithProps<any, any> = ({ feature }) => feature`,
  `export const selectFeature = createSelector((state: AppState) => state.feature)`,
  `export const selectFeature = createFeatureSelector<FeatureState>(featureKey)`,
  `export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey)`,
  `export const selectThing = (id: string) => createSelector(selectThings, things => things[id])`,
  `export const selectFeature = createSelectorFactory(factoryFn)`,
  `export const select_feature = createSelectorFactory(factoryFn)`,
  `export const select$feature = createSelectorFactory(factoryFn)`,
  `export const selectF01 = createSelector(factoryFn)`,
  `
    export const authFeature = createFeature({
      name: 'auth',
      reducer: authReducer,
      extraSelectors: ({selectToken}) => ({
        selectIsAuthorized: createSelector(selectToken, token => !!token)
      }),
    })
  `,
  `
    export const { selectAll: selectAllBooks } = booksAdapter.getSelectors(createSelector(selectBookInfo, (state) => state.books));
  `,
  `
    const { selectAll, selectEntities } = getSelectors(adapter);
  `,
  `
    const { selectAll: selectAllItems, selectEntities: selectEntitiesMap } = getSelectors(adapter);
  `,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
export const getCount: MemoizedSelector<any, any> = (state: AppState) => state.feature
             ~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectCount' },
          output: `
export const selectCount: MemoizedSelector<any, any> = (state: AppState) => state.feature`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const getF01 = createSelector((state: AppState) => state.feature)
             ~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          output: `
export const selectF01 = createSelector((state: AppState) => state.feature)`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const get_f01 = createSelector((state: AppState) => state.feature)
             ~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          output: `
export const select_f01 = createSelector((state: AppState) => state.feature)`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const select = (id: string) => createSelector(selectThings, things => things[id])
             ~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          data: {
            name: 'selectSelect',
          },
          messageId: prefixSelectorsWithSelectSuggest,
          output: `
export const selectSelect = (id: string) => createSelector(selectThings, things => things[id])`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const SELECT_TEST = (id: string) => {
             ~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
  return createSelector(selectThings, things => things[id])
}`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectSELECT_TEST',
          },
          output: `
export const selectSELECT_TEST = (id: string) => {
  return createSelector(selectThings, things => things[id])
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const feature = createFeatureSelector<AppState, FeatureState>(featureKey)
             ~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectFeature',
          },
          output: `
export const selectFeature = createFeatureSelector<AppState, FeatureState>(featureKey)`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const selectfeature = createSelector((state: AppState) => state.feature)
             ~~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectFeature',
          },
          output: `
export const selectFeature = createSelector((state: AppState) => state.feature)`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const createSelect = createSelectorFactory((projectionFun) =>
             ~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]
  defaultMemoize(
    projectionFun,
    orderDoesNotMatterComparer,
    orderDoesNotMatterComparer,
  ),
)`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectCreateSelect',
          },
          output: `
export const selectCreateSelect = createSelectorFactory((projectionFun) =>
  defaultMemoize(
    projectionFun,
    orderDoesNotMatterComparer,
    orderDoesNotMatterComparer,
  ),
)`,
        },
      ],
    }
  ),
  // https://github.com/ngrx/platform/issues/3956
  fromFixture(
    `
import {createFeatureSelector} from '@ngrx/store';

export interface FileListResponseState {
  loading: boolean;
}

const featureSelector = createFeatureSelector<FileListResponseState>("name");
      ~~~~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: {
            name: 'selectFeatureSelector',
          },
          output: `
import {createFeatureSelector} from '@ngrx/store';

export interface FileListResponseState {
  loading: boolean;
}

const selectFeatureSelector = createFeatureSelector<FileListResponseState>("name");`,
        },
      ],
    }
  ),
  fromFixture(
    `
export const { selectAll: allBooks } = booksAdapter.getSelectors(createSelector(selectBookInfo, (state) => state.books));
                          ~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectAllBooks' },
          output: `
export const { selectAll: selectAllBooks } = booksAdapter.getSelectors(createSelector(selectBookInfo, (state) => state.books));`,
        },
      ],
    }
  ),
  fromFixture(
    `
const { selectAll: allItems } = getSelectors(adapter);
                   ~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectAllItems' },
          output: `
const { selectAll: selectAllItems } = getSelectors(adapter);`,
        },
      ],
    }
  ),
  fromFixture(
    `
const { selectEntities: entitiesMap } = getSelectors(adapter);
                        ~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectEntitiesMap' },
          output: `
const { selectEntities: selectEntitiesMap } = getSelectors(adapter);`,
        },
      ],
    }
  ),
  fromFixture(
    `
const { allItems } = getSelectors(adapter);
        ~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectAllItems' },
          output: `
const { selectAllItems } = getSelectors(adapter);`,
        },
      ],
    }
  ),
  fromFixture(
    `
const { entitiesMap } = getSelectors(adapter);
        ~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
    {
      suggestions: [
        {
          messageId: prefixSelectorsWithSelectSuggest,
          data: { name: 'selectEntitiesMap' },
          output: `
const { selectEntitiesMap } = getSelectors(adapter);`,
        },
      ],
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});
