---
kind: FunctionDeclaration
name: createFeatureSelector
module: store
---

# createFeatureSelector

```ts
function createFeatureSelector(featureName: any): MemoizedSelector<any, any>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L612-L633)

## Parameters

| Name        | Type  | Description |
| ----------- | ----- | ----------- |
| featureName | `any` |             |

## Overloads

```ts
function createFeatureSelector<T>(
  featureName: string
): MemoizedSelector<object, T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L606-L608)

### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| featureName | `string` |             |

```ts
function createFeatureSelector<T, V>(
  featureName: keyof T
): MemoizedSelector<T, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L609-L611)

### Parameters

| Name        | Type      | Description |
| ----------- | --------- | ----------- |
| featureName | `keyof T` |             |
