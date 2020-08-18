---
kind: FunctionDeclaration
name: createFeatureSelector
module: store
---

# createFeatureSelector

```ts
function createFeatureSelector(featureName: any): MemoizedSelector<any, any>;
```

## Parameters

| Name        | Type  | Description |
| ----------- | ----- | ----------- |
| featureName | `any` |             |

## Overloads

```ts
function createFeatureSelector(featureName: any): MemoizedSelector<any, any>;
```

### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| featureName | `string` |             |

```ts
function createFeatureSelector(featureName: any): MemoizedSelector<any, any>;
```

### Parameters

| Name        | Type      | Description |
| ----------- | --------- | ----------- |
| featureName | `keyof T` |             |
