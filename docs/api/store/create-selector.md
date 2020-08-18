---
kind: FunctionDeclaration
name: createSelector
module: store
---

# createSelector

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

## Parameters

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| input | `any[]` |             |

## Overloads

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                  | Description |
| --------- | --------------------- | ----------- |
| s1        | `Selector<State, S1>` |             |
| projector | `(s1: S1) => Result`  |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                  | Description |
| --------- | ------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>` |             |
| projector | `(s1: S1, props: Props) => Result`    |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                    | Description |
| --------- | ----------------------- | ----------- |
| selectors | `[Selector<State, S1>]` |             |
| projector | `(s1: S1) => Result`    |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                    | Description |
| --------- | --------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>]` |             |
| projector | `(s1: S1, props: Props) => Result`      |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                         | Description |
| --------- | ---------------------------- | ----------- |
| s1        | `Selector<State, S1>`        |             |
| s2        | `Selector<State, S2>`        |             |
| projector | `(s1: S1, s2: S2) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                       | Description |
| --------- | ------------------------------------------ | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`      |             |
| s2        | `SelectorWithProps<State, Props, S2>`      |             |
| projector | `(s1: S1, s2: S2, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                         | Description |
| --------- | -------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>]` |             |
| projector | `(s1: S1, s2: S2) => Result`                 |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                         | Description |
| --------- | ---------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>]` |             |
| projector | `(s1: S1, s2: S2, props: Props) => Result`                                   |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                 | Description |
| --------- | ------------------------------------ | ----------- |
| s1        | `Selector<State, S1>`                |             |
| s2        | `Selector<State, S2>`                |             |
| s3        | `Selector<State, S3>`                |             |
| projector | `(s1: S1, s2: S2, s3: S3) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                               | Description |
| --------- | -------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`              |             |
| s2        | `SelectorWithProps<State, Props, S2>`              |             |
| s3        | `SelectorWithProps<State, Props, S3>`              |             |
| projector | `(s1: S1, s2: S2, s3: S3, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                              | Description |
| --------- | ----------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3) => Result`                              |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                              | Description |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, props: Props) => Result`                                                                |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                         | Description |
| --------- | -------------------------------------------- | ----------- |
| s1        | `Selector<State, S1>`                        |             |
| s2        | `Selector<State, S2>`                        |             |
| s3        | `Selector<State, S3>`                        |             |
| s4        | `Selector<State, S4>`                        |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                       | Description |
| --------- | ---------------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                      |             |
| s2        | `SelectorWithProps<State, Props, S2>`                      |             |
| s3        | `SelectorWithProps<State, Props, S3>`                      |             |
| s4        | `SelectorWithProps<State, Props, S4>`                      |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                   | Description |
| --------- | -------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4) => Result`                                           |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                   | Description |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result`                                                                                             |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                 | Description |
| --------- | ---------------------------------------------------- | ----------- |
| s1        | `Selector<State, S1>`                                |             |
| s2        | `Selector<State, S2>`                                |             |
| s3        | `Selector<State, S3>`                                |             |
| s4        | `Selector<State, S4>`                                |             |
| s5        | `Selector<State, S5>`                                |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                               | Description |
| --------- | ------------------------------------------------------------------ | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                              |             |
| s2        | `SelectorWithProps<State, Props, S2>`                              |             |
| s3        | `SelectorWithProps<State, Props, S3>`                              |             |
| s4        | `SelectorWithProps<State, Props, S4>`                              |             |
| s5        | `SelectorWithProps<State, Props, S5>`                              |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                        | Description |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result`                                                        |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                                                        | Description |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, props: Props) => Result`                                                                                                                          |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                         | Description |
| --------- | ------------------------------------------------------------ | ----------- |
| s1        | `Selector<State, S1>`                                        |             |
| s2        | `Selector<State, S2>`                                        |             |
| s3        | `Selector<State, S3>`                                        |             |
| s4        | `Selector<State, S4>`                                        |             |
| s5        | `Selector<State, S5>`                                        |             |
| s6        | `Selector<State, S6>`                                        |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                       | Description |
| --------- | -------------------------------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                                      |             |
| s2        | `SelectorWithProps<State, Props, S2>`                                      |             |
| s3        | `SelectorWithProps<State, Props, S3>`                                      |             |
| s4        | `SelectorWithProps<State, Props, S4>`                                      |             |
| s5        | `SelectorWithProps<State, Props, S5>`                                      |             |
| s6        | `SelectorWithProps<State, Props, S6>`                                      |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                             | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result`                                                                     |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                                                                                             | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, props: Props) => Result`                                                                                                                                                       |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                 | Description |
| --------- | -------------------------------------------------------------------- | ----------- |
| s1        | `Selector<State, S1>`                                                |             |
| s2        | `Selector<State, S2>`                                                |             |
| s3        | `Selector<State, S3>`                                                |             |
| s4        | `Selector<State, S4>`                                                |             |
| s5        | `Selector<State, S5>`                                                |             |
| s6        | `Selector<State, S6>`                                                |             |
| s7        | `Selector<State, S7>`                                                |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                               | Description |
| --------- | ---------------------------------------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                                              |             |
| s2        | `SelectorWithProps<State, Props, S2>`                                              |             |
| s3        | `SelectorWithProps<State, Props, S3>`                                              |             |
| s4        | `SelectorWithProps<State, Props, S4>`                                              |             |
| s5        | `SelectorWithProps<State, Props, S5>`                                              |             |
| s6        | `SelectorWithProps<State, Props, S6>`                                              |             |
| s7        | `SelectorWithProps<State, Props, S7>`                                              |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                  | Description |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>, Selector<State, S7>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result`                                                                                  |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                                                                                                                                  | Description |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>, SelectorWithProps<State, Props, S7>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, props: Props) => Result`                                                                                                                                                                                    |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                         | Description |
| --------- | ---------------------------------------------------------------------------- | ----------- |
| s1        | `Selector<State, S1>`                                                        |             |
| s2        | `Selector<State, S2>`                                                        |             |
| s3        | `Selector<State, S3>`                                                        |             |
| s4        | `Selector<State, S4>`                                                        |             |
| s5        | `Selector<State, S5>`                                                        |             |
| s6        | `Selector<State, S6>`                                                        |             |
| s7        | `Selector<State, S7>`                                                        |             |
| s8        | `Selector<State, S8>`                                                        |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                       | Description |
| --------- | ------------------------------------------------------------------------------------------ | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                                                      |             |
| s2        | `SelectorWithProps<State, Props, S2>`                                                      |             |
| s3        | `SelectorWithProps<State, Props, S3>`                                                      |             |
| s4        | `SelectorWithProps<State, Props, S4>`                                                      |             |
| s5        | `SelectorWithProps<State, Props, S5>`                                                      |             |
| s6        | `SelectorWithProps<State, Props, S6>`                                                      |             |
| s7        | `SelectorWithProps<State, Props, S7>`                                                      |             |
| s8        | `SelectorWithProps<State, Props, S8>`                                                      |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, props: Props) => Result` |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                                       | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>, Selector<State, S7>, Selector<State, S8>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result`                                                                                               |             |

```ts
function createSelector(
  ...input: any[]
): MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
```

### Parameters

| Name      | Type                                                                                                                                                                                                                                                                                                       | Description |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>, SelectorWithProps<State, Props, S7>, SelectorWithProps<State, Props, S8>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, props: Props) => Result`                                                                                                                                                                                                                 |             |
