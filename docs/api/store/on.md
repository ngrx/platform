---
kind: FunctionDeclaration
name: on
module: store
---

# on

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L181-L190)

## Parameters

| Name | Type                                                                                                                                                   | Description                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| args | `(Function | ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>)[]` | `ActionCreator`'s followed by a state change function. |

## returns

an association of action types with a state change function.

## Overloads

```ts
function on<C1 extends ActionCreator, S>(
  creator1: C1,
  reducer: OnReducer<S, [C1]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L14-L17)

### Parameters

| Name     | Type                 | Description |
| -------- | -------------------- | ----------- |
| creator1 | `C1`                 |             |
| reducer  | `OnReducer<S, [C1]>` |             |

```ts
function on<C1 extends ActionCreator, C2 extends ActionCreator, S>(
  creator1: C1,
  creator2: C2,
  reducer: OnReducer<S, [C1, C2]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L18-L22)

### Parameters

| Name     | Type                     | Description |
| -------- | ------------------------ | ----------- |
| creator1 | `C1`                     |             |
| creator2 | `C2`                     |             |
| reducer  | `OnReducer<S, [C1, C2]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  reducer: OnReducer<S, [C1, C2, C3]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L23-L33)

### Parameters

| Name     | Type                         | Description |
| -------- | ---------------------------- | ----------- |
| creator1 | `C1`                         |             |
| creator2 | `C2`                         |             |
| creator3 | `C3`                         |             |
| reducer  | `OnReducer<S, [C1, C2, C3]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  reducer: OnReducer<S, [C1, C2, C3, C4]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L34-L46)

### Parameters

| Name     | Type                             | Description |
| -------- | -------------------------------- | ----------- |
| creator1 | `C1`                             |             |
| creator2 | `C2`                             |             |
| creator3 | `C3`                             |             |
| creator4 | `C4`                             |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L47-L61)

### Parameters

| Name     | Type                                 | Description |
| -------- | ------------------------------------ | ----------- |
| creator1 | `C1`                                 |             |
| creator2 | `C2`                                 |             |
| creator3 | `C3`                                 |             |
| creator4 | `C4`                                 |             |
| creator5 | `C5`                                 |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  C6 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L62-L78)

### Parameters

| Name     | Type                                     | Description |
| -------- | ---------------------------------------- | ----------- |
| creator1 | `C1`                                     |             |
| creator2 | `C2`                                     |             |
| creator3 | `C3`                                     |             |
| creator4 | `C4`                                     |             |
| creator5 | `C5`                                     |             |
| creator6 | `C6`                                     |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  C6 extends ActionCreator,
  C7 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L79-L97)

### Parameters

| Name     | Type                                         | Description |
| -------- | -------------------------------------------- | ----------- |
| creator1 | `C1`                                         |             |
| creator2 | `C2`                                         |             |
| creator3 | `C3`                                         |             |
| creator4 | `C4`                                         |             |
| creator5 | `C5`                                         |             |
| creator6 | `C6`                                         |             |
| creator7 | `C7`                                         |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  C6 extends ActionCreator,
  C7 extends ActionCreator,
  C8 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L98-L118)

### Parameters

| Name     | Type                                             | Description |
| -------- | ------------------------------------------------ | ----------- |
| creator1 | `C1`                                             |             |
| creator2 | `C2`                                             |             |
| creator3 | `C3`                                             |             |
| creator4 | `C4`                                             |             |
| creator5 | `C5`                                             |             |
| creator6 | `C6`                                             |             |
| creator7 | `C7`                                             |             |
| creator8 | `C8`                                             |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  C6 extends ActionCreator,
  C7 extends ActionCreator,
  C8 extends ActionCreator,
  C9 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  creator9: C9,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L119-L141)

### Parameters

| Name     | Type                                                 | Description |
| -------- | ---------------------------------------------------- | ----------- |
| creator1 | `C1`                                                 |             |
| creator2 | `C2`                                                 |             |
| creator3 | `C3`                                                 |             |
| creator4 | `C4`                                                 |             |
| creator5 | `C5`                                                 |             |
| creator6 | `C6`                                                 |             |
| creator7 | `C7`                                                 |             |
| creator8 | `C8`                                                 |             |
| creator9 | `C9`                                                 |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9]>` |             |

```ts
function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  C4 extends ActionCreator,
  C5 extends ActionCreator,
  C6 extends ActionCreator,
  C7 extends ActionCreator,
  C8 extends ActionCreator,
  C9 extends ActionCreator,
  C10 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  creator4: C4,
  creator5: C5,
  creator6: C6,
  creator7: C7,
  creator8: C8,
  creator9: C9,
  creator10: C10,
  reducer: OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]>
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L142-L166)

### Parameters

| Name      | Type                                                      | Description |
| --------- | --------------------------------------------------------- | ----------- |
| creator1  | `C1`                                                      |             |
| creator2  | `C2`                                                      |             |
| creator3  | `C3`                                                      |             |
| creator4  | `C4`                                                      |             |
| creator5  | `C5`                                                      |             |
| creator6  | `C6`                                                      |             |
| creator7  | `C7`                                                      |             |
| creator8  | `C8`                                                      |             |
| creator9  | `C9`                                                      |             |
| creator10 | `C10`                                                     |             |
| reducer   | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]>` |             |

```ts
function on<S>(
  creator: ActionCreator,
  ...rest: (ActionCreator | OnReducer<S, [ActionCreator]>)[]
): On<S>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/reducer_creator.ts#L167-L170)

### Parameters

| Name    | Type                                                                                                                                                                                                                                                                                                | Description |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| creator | `ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>`                                                                                                                                                             |             |
| rest    | `(ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>> | OnReducer<S, [ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>]>)[]` |             |
