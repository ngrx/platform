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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L509-L513)

## Parameters

| Name  | Type    | Description |
| ----- | ------- | ----------- |
| input | `any[]` |             |

## Overloads

```ts
function createSelector<State, S1, Result>(
  s1: Selector<State, S1>,
  projector: (s1: S1) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L121-L124)

### Parameters

| Name      | Type                  | Description |
| --------- | --------------------- | ----------- |
| s1        | `Selector<State, S1>` |             |
| projector | `(s1: S1) => Result`  |             |

```ts
function createSelector<State, Props, S1, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  projector: (s1: S1, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L125-L128)

### Parameters

| Name      | Type                                  | Description |
| --------- | ------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>` |             |
| projector | `(s1: S1, props: Props) => Result`    |             |

```ts
function createSelector<State, S1, Result>(
  selectors: [Selector<State, S1>],
  projector: (s1: S1) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L129-L132)

### Parameters

| Name      | Type                    | Description |
| --------- | ----------------------- | ----------- |
| selectors | `[Selector<State, S1>]` |             |
| projector | `(s1: S1) => Result`    |             |

```ts
function createSelector<State, Props, S1, Result>(
  selectors: [SelectorWithProps<State, Props, S1>],
  projector: (s1: S1, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L133-L136)

### Parameters

| Name      | Type                                    | Description |
| --------- | --------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>]` |             |
| projector | `(s1: S1, props: Props) => Result`      |             |

```ts
function createSelector<State, S1, S2, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  projector: (s1: S1, s2: S2) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L138-L142)

### Parameters

| Name      | Type                         | Description |
| --------- | ---------------------------- | ----------- |
| s1        | `Selector<State, S1>`        |             |
| s2        | `Selector<State, S2>`        |             |
| projector | `(s1: S1, s2: S2) => Result` |             |

```ts
function createSelector<State, Props, S1, S2, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  projector: (s1: S1, s2: S2, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L143-L147)

### Parameters

| Name      | Type                                       | Description |
| --------- | ------------------------------------------ | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`      |             |
| s2        | `SelectorWithProps<State, Props, S2>`      |             |
| projector | `(s1: S1, s2: S2, props: Props) => Result` |             |

```ts
function createSelector<State, S1, S2, Result>(
  selectors: [Selector<State, S1>, Selector<State, S2>],
  projector: (s1: S1, s2: S2) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L148-L151)

### Parameters

| Name      | Type                                         | Description |
| --------- | -------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>]` |             |
| projector | `(s1: S1, s2: S2) => Result`                 |             |

```ts
function createSelector<State, Props, S1, S2, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>
  ],
  projector: (s1: S1, s2: S2, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L152-L158)

### Parameters

| Name      | Type                                                                         | Description |
| --------- | ---------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>]` |             |
| projector | `(s1: S1, s2: S2, props: Props) => Result`                                   |             |

```ts
function createSelector<State, S1, S2, S3, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  projector: (s1: S1, s2: S2, s3: S3) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L160-L165)

### Parameters

| Name      | Type                                 | Description |
| --------- | ------------------------------------ | ----------- |
| s1        | `Selector<State, S1>`                |             |
| s2        | `Selector<State, S2>`                |             |
| s3        | `Selector<State, S3>`                |             |
| projector | `(s1: S1, s2: S2, s3: S3) => Result` |             |

```ts
function createSelector<State, Props, S1, S2, S3, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  projector: (s1: S1, s2: S2, s3: S3, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L166-L171)

### Parameters

| Name      | Type                                               | Description |
| --------- | -------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`              |             |
| s2        | `SelectorWithProps<State, Props, S2>`              |             |
| s3        | `SelectorWithProps<State, Props, S3>`              |             |
| projector | `(s1: S1, s2: S2, s3: S3, props: Props) => Result` |             |

```ts
function createSelector<State, S1, S2, S3, Result>(
  selectors: [Selector<State, S1>, Selector<State, S2>, Selector<State, S3>],
  projector: (s1: S1, s2: S2, s3: S3) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L172-L175)

### Parameters

| Name      | Type                                                              | Description |
| --------- | ----------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3) => Result`                              |             |

```ts
function createSelector<State, Props, S1, S2, S3, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>
  ],
  projector: (s1: S1, s2: S2, s3: S3, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L176-L183)

### Parameters

| Name      | Type                                                                                                              | Description |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, props: Props) => Result`                                                                |             |

```ts
function createSelector<State, S1, S2, S3, S4, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L185-L191)

### Parameters

| Name      | Type                                         | Description |
| --------- | -------------------------------------------- | ----------- |
| s1        | `Selector<State, S1>`                        |             |
| s2        | `Selector<State, S2>`                        |             |
| s3        | `Selector<State, S3>`                        |             |
| s4        | `Selector<State, S4>`                        |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4) => Result` |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  s4: SelectorWithProps<State, Props, S4>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L192-L198)

### Parameters

| Name      | Type                                                       | Description |
| --------- | ---------------------------------------------------------- | ----------- |
| s1        | `SelectorWithProps<State, Props, S1>`                      |             |
| s2        | `SelectorWithProps<State, Props, S2>`                      |             |
| s3        | `SelectorWithProps<State, Props, S3>`                      |             |
| s4        | `SelectorWithProps<State, Props, S4>`                      |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result` |             |

```ts
function createSelector<State, S1, S2, S3, S4, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L199-L207)

### Parameters

| Name      | Type                                                                                   | Description |
| --------- | -------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4) => Result`                                           |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>,
    SelectorWithProps<State, Props, S4>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L208-L216)

### Parameters

| Name      | Type                                                                                                                                                   | Description |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, props: Props) => Result`                                                                                             |             |

```ts
function createSelector<State, S1, S2, S3, S4, S5, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L218-L225)

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
function createSelector<State, Props, S1, S2, S3, S4, S5, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  s4: SelectorWithProps<State, Props, S4>,
  s5: SelectorWithProps<State, Props, S5>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L226-L233)

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
function createSelector<State, S1, S2, S3, S4, S5, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L234-L243)

### Parameters

| Name      | Type                                                                                                        | Description |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => Result`                                                        |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, S5, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>,
    SelectorWithProps<State, Props, S4>,
    SelectorWithProps<State, Props, S5>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, props: Props) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L244-L253)

### Parameters

| Name      | Type                                                                                                                                                                                        | Description |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, props: Props) => Result`                                                                                                                          |             |

```ts
function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L255-L263)

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
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  s4: SelectorWithProps<State, Props, S4>,
  s5: SelectorWithProps<State, Props, S5>,
  s6: SelectorWithProps<State, Props, S6>,
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L264-L280)

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
function createSelector<State, S1, S2, S3, S4, S5, S6, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,

    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L281-L292)

### Parameters

| Name      | Type                                                                                                                             | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6) => Result`                                                                     |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>,
    SelectorWithProps<State, Props, S4>,
    SelectorWithProps<State, Props, S5>,
    SelectorWithProps<State, Props, S6>
  ],
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L293-L311)

### Parameters

| Name      | Type                                                                                                                                                                                                                             | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, props: Props) => Result`                                                                                                                                                       |             |

```ts
function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  s7: Selector<State, S7>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L313-L322)

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
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  s4: SelectorWithProps<State, Props, S4>,
  s5: SelectorWithProps<State, Props, S5>,
  s6: SelectorWithProps<State, Props, S6>,
  s7: SelectorWithProps<State, Props, S7>,
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L323-L352)

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
function createSelector<State, S1, S2, S3, S4, S5, S6, S7, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>,
    Selector<State, S7>
  ],
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L353-L364)

### Parameters

| Name      | Type                                                                                                                                                  | Description |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>, Selector<State, S7>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7) => Result`                                                                                  |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>,
    SelectorWithProps<State, Props, S4>,
    SelectorWithProps<State, Props, S5>,
    SelectorWithProps<State, Props, S6>,
    SelectorWithProps<State, Props, S7>
  ],
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L365-L396)

### Parameters

| Name      | Type                                                                                                                                                                                                                                                                  | Description |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>, SelectorWithProps<State, Props, S7>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, props: Props) => Result`                                                                                                                                                                                    |             |

```ts
function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  s1: Selector<State, S1>,
  s2: Selector<State, S2>,
  s3: Selector<State, S3>,
  s4: Selector<State, S4>,
  s5: Selector<State, S5>,
  s6: Selector<State, S6>,
  s7: Selector<State, S7>,
  s8: Selector<State, S8>,
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    s8: S8
  ) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L398-L417)

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
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  s1: SelectorWithProps<State, Props, S1>,
  s2: SelectorWithProps<State, Props, S2>,
  s3: SelectorWithProps<State, Props, S3>,
  s4: SelectorWithProps<State, Props, S4>,
  s5: SelectorWithProps<State, Props, S5>,
  s6: SelectorWithProps<State, Props, S6>,
  s7: SelectorWithProps<State, Props, S7>,
  s8: SelectorWithProps<State, Props, S8>,
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    s8: S8,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L418-L450)

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
function createSelector<State, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  selectors: [
    Selector<State, S1>,
    Selector<State, S2>,
    Selector<State, S3>,
    Selector<State, S4>,
    Selector<State, S5>,
    Selector<State, S6>,
    Selector<State, S7>,
    Selector<State, S8>
  ],
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    s8: S8
  ) => Result
): MemoizedSelector<State, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L451-L472)

### Parameters

| Name      | Type                                                                                                                                                                       | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[Selector<State, S1>, Selector<State, S2>, Selector<State, S3>, Selector<State, S4>, Selector<State, S5>, Selector<State, S6>, Selector<State, S7>, Selector<State, S8>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8) => Result`                                                                                               |             |

```ts
function createSelector<State, Props, S1, S2, S3, S4, S5, S6, S7, S8, Result>(
  selectors: [
    SelectorWithProps<State, Props, S1>,
    SelectorWithProps<State, Props, S2>,
    SelectorWithProps<State, Props, S3>,
    SelectorWithProps<State, Props, S4>,
    SelectorWithProps<State, Props, S5>,
    SelectorWithProps<State, Props, S6>,
    SelectorWithProps<State, Props, S7>,
    SelectorWithProps<State, Props, S8>
  ],
  projector: (
    s1: S1,
    s2: S2,
    s3: S3,
    s4: S4,
    s5: S5,
    s6: S6,
    s7: S7,
    s8: S8,
    props: Props
  ) => Result
): MemoizedSelectorWithProps<State, Props, Result>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/selector.ts#L473-L507)

### Parameters

| Name      | Type                                                                                                                                                                                                                                                                                                       | Description |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| selectors | `[SelectorWithProps<State, Props, S1>, SelectorWithProps<State, Props, S2>, SelectorWithProps<State, Props, S3>, SelectorWithProps<State, Props, S4>, SelectorWithProps<State, Props, S5>, SelectorWithProps<State, Props, S6>, SelectorWithProps<State, Props, S7>, SelectorWithProps<State, Props, S8>]` |             |
| projector | `(s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, props: Props) => Result`                                                                                                                                                                                                                 |             |
