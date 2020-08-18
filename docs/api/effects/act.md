---
kind: FunctionDeclaration
name: act
module: effects
---

# act

```ts
function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  /** Allow to take either config object or project/error functions */
  configOrProject:
    | ActConfig<
        Input,
        OutputAction,
        ErrorAction,
        CompleteAction,
        UnsubscribeAction
      >
    | ((input: Input, index: number) => Observable<OutputAction>),
  errorFn?: (error: any, input: Input) => ErrorAction
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
```

## Parameters

| Name            | Type                                                                                                                                           | Description |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| configOrProject | `ActConfig<Input, OutputAction, ErrorAction, CompleteAction, UnsubscribeAction> | ((input: Input, index: number) => Observable<OutputAction>)` |             |
| errorFn         | `(error: any, input: Input) => ErrorAction`                                                                                                    |             |

## Overloads

```ts
function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  /** Allow to take either config object or project/error functions */
  configOrProject:
    | ActConfig<
        Input,
        OutputAction,
        ErrorAction,
        CompleteAction,
        UnsubscribeAction
      >
    | ((input: Input, index: number) => Observable<OutputAction>),
  errorFn?: (error: any, input: Input) => ErrorAction
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
```

### Parameters

| Name    | Type                                                        | Description |
| ------- | ----------------------------------------------------------- | ----------- |
| project | `(input: Input, index: number) => Observable<OutputAction>` |             |
| error   | `(error: any, input: Input) => ErrorAction`                 |             |

```ts
function act<
  Input,
  OutputAction extends Action,
  ErrorAction extends Action,
  CompleteAction extends Action = never,
  UnsubscribeAction extends Action = never
>(
  /** Allow to take either config object or project/error functions */
  configOrProject:
    | ActConfig<
        Input,
        OutputAction,
        ErrorAction,
        CompleteAction,
        UnsubscribeAction
      >
    | ((input: Input, index: number) => Observable<OutputAction>),
  errorFn?: (error: any, input: Input) => ErrorAction
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
```

### Parameters

| Name   | Type                                                                             | Description |
| ------ | -------------------------------------------------------------------------------- | ----------- |
| config | `ActConfig<Input, OutputAction, ErrorAction, CompleteAction, UnsubscribeAction>` |             |
