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
export const { selectAll: allBooks } = booksAdapter.getSelectors(createSelector(selectBookInfo, (state) => state.books));
                          ~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
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
              ~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
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
                    ~~~~~~~~~~~~~ [${prefixSelectorsWithSelect} suggest]`,
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
