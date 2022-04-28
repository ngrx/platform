# prefix-selectors-with-select

The selector should start with "select", for example "selectThing".

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

It's recommended prefixing selector function names with the word "select" combined with a description of the value being selected.

## Rule Details

Examples of **incorrect** code for this rule:

```ts
// ⚠ Usage of a selector without any prefix
export const feature = createSelector((state: AppState) => state.feature);

// ⚠ Usage of a selector without any description
export const select = (id: string) =>
  createSelector((state: AppState) => state.feature);

// ⚠ Usage of a selector with a `get` prefix
export const getFeature: MemoizedSelector<any, any> = (state: AppState) =>
  state.feature;

// ⚠ Usage of a selector with improper casing
const selectfeature = createFeatureSelector<AppState, FeatureState>(featureKey);

// ⚠ Usage of a `createSelectorFactory` without `select` prefix
const createSelector = createSelectorFactory((projectionFun) =>
  defaultMemoize(
    projectionFun,
    orderDoesNotMatterComparer,
    orderDoesNotMatterComparer
  )
);
```

Examples of **correct** code for this rule:

```ts
export const selectFeature = createSelector((state: AppState) => state.feature);

export const selectFeature: MemoizedSelector<any, any> = (state: AppState) =>
  state.feature;

const selectFeature = createFeatureSelector<FeatureState>(featureKey);

export const selectThing = (id: string) =>
  createSelector(selectThings, (things) => things[id]);
```

## Further reading

- [Redux Style Guide](https://redux.js.org/style-guide/style-guide#name-selector-functions-as-selectthing)
