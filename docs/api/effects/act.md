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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/act.ts#L79-L171)

## Parameters

| Name            | Type                                                                                                                                           | Description |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| configOrProject | `ActConfig<Input, OutputAction, ErrorAction, CompleteAction, UnsubscribeAction> | ((input: Input, index: number) => Observable<OutputAction>)` |             |
| errorFn         | `(error: any, input: Input) => ErrorAction`                                                                                                    |             |

## Overloads

### description

Wraps project fn with error handling making it safe to use in Effects.
Takes either config with named properties that represent different possible
callbacks or project/error callbacks that are required.

```ts
function act<Input, OutputAction extends Action, ErrorAction extends Action>(
  project: (input: Input, index: number) => Observable<OutputAction>,
  error: (error: any, input: Input) => ErrorAction
): (source: Observable<Input>) => Observable<OutputAction | ErrorAction>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/act.ts#L52-L59)

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
  config: ActConfig<
    Input,
    OutputAction,
    ErrorAction,
    CompleteAction,
    UnsubscribeAction
  >
): (
  source: Observable<Input>
) => Observable<
  OutputAction | ErrorAction | CompleteAction | UnsubscribeAction
>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/effects/src/act.ts#L60-L78)

### Parameters

| Name   | Type                                                                             | Description |
| ------ | -------------------------------------------------------------------------------- | ----------- |
| config | `ActConfig<Input, OutputAction, ErrorAction, CompleteAction, UnsubscribeAction>` |             |
