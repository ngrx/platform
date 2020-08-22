---
kind: FunctionDeclaration
name: createSelectorFactory
module: store
---

# createSelectorFactory

```ts
function createSelectorFactory(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<any, any> = {
    stateFn: defaultStateFn,
  }
);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L555-L604)

## Parameters

| Name    | Type                              | Description |
| ------- | --------------------------------- | ----------- |
| memoize | `MemoizeFn`                       |             |
| options | `SelectorFactoryConfig<any, any>` |             |

## Overloads

```ts
function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn
): (...input: any[]) => MemoizedSelector<T, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L541-L543)

### Parameters

| Name    | Type        | Description |
| ------- | ----------- | ----------- |
| memoize | `MemoizeFn` |             |

```ts
function createSelectorFactory<T = any, V = any>(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<T, V>
): (...input: any[]) => MemoizedSelector<T, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L544-L547)

### Parameters

| Name    | Type                          | Description |
| ------- | ----------------------------- | ----------- |
| memoize | `MemoizeFn`                   |             |
| options | `SelectorFactoryConfig<T, V>` |             |

```ts
function createSelectorFactory<T = any, Props = any, V = any>(
  memoize: MemoizeFn
): (...input: any[]) => MemoizedSelectorWithProps<T, Props, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L548-L550)

### Parameters

| Name    | Type        | Description |
| ------- | ----------- | ----------- |
| memoize | `MemoizeFn` |             |

```ts
function createSelectorFactory<T = any, Props = any, V = any>(
  memoize: MemoizeFn,
  options: SelectorFactoryConfig<T, V>
): (...input: any[]) => MemoizedSelectorWithProps<T, Props, V>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L551-L554)

### Parameters

| Name    | Type                          | Description |
| ------- | ----------------------------- | ----------- |
| memoize | `MemoizeFn`                   |             |
| options | `SelectorFactoryConfig<T, V>` |             |
