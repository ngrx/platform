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

## Parameters

| Name | Type                                                                                                                                                   | Description                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| args | `(Function | ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>)[]` | `ActionCreator`'s followed by a state change function. |

## returns

an association of action types with a state change function.

## Overloads

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| reducer  | `OnReducer<S, [C1]>`                                        |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2]>`                                    |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3]>`                                |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4]>`                            |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| creator5 | `C5`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5]>`                        |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| creator5 | `C5`                                                        |             |
| creator6 | `C6`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6]>`                    |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| creator5 | `C5`                                                        |             |
| creator6 | `C6`                                                        |             |
| creator7 | `C7`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7]>`                |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| creator5 | `C5`                                                        |             |
| creator6 | `C6`                                                        |             |
| creator7 | `C7`                                                        |             |
| creator8 | `C8`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8]>`            |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name     | Type                                                        | Description |
| -------- | ----------------------------------------------------------- | ----------- |
| args     | `` | `ActionCreator`'s followed by a state change function. |
| creator1 | `C1`                                                        |             |
| creator2 | `C2`                                                        |             |
| creator3 | `C3`                                                        |             |
| creator4 | `C4`                                                        |             |
| creator5 | `C5`                                                        |             |
| creator6 | `C6`                                                        |             |
| creator7 | `C7`                                                        |             |
| creator8 | `C8`                                                        |             |
| creator9 | `C9`                                                        |             |
| reducer  | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9]>`        |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name      | Type                                                        | Description |
| --------- | ----------------------------------------------------------- | ----------- |
| args      | `` | `ActionCreator`'s followed by a state change function. |
| creator1  | `C1`                                                        |             |
| creator2  | `C2`                                                        |             |
| creator3  | `C3`                                                        |             |
| creator4  | `C4`                                                        |             |
| creator5  | `C5`                                                        |             |
| creator6  | `C6`                                                        |             |
| creator7  | `C7`                                                        |             |
| creator8  | `C8`                                                        |             |
| creator9  | `C9`                                                        |             |
| creator10 | `C10`                                                       |             |
| reducer   | `OnReducer<S, [C1, C2, C3, C4, C5, C6, C7, C8, C9, C10]>`   |             |

## returns

an association of action types with a state change function.

## description

Associates actions with a given state change function.
A state change function must be provided as the last parameter.

```ts
function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] };
```

### Parameters

| Name    | Type                                                                                                                                                                                                                                                                                                | Description |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| args    | `` | `ActionCreator`'s followed by a state change function.                                                                                                                                                                                                                                         |
| creator | `ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>`                                                                                                                                                             |             |
| rest    | `(ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>> | OnReducer<S, [ActionCreator<string, import("C:/Users/tdeschryver/dev/platform/modules/store/src/models").FunctionWithParametersType<any[], object>>]>)[]` |             |

## returns

an association of action types with a state change function.
