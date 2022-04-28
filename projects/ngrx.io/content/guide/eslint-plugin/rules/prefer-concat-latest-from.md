# prefer-concat-latest-from

> Required NgRx Version Range: ${meta.version}

Use `concatLatestFrom` instead of `withLatestFrom` to prevent the selector from firing until the correct `Action` is dispatched.

- **Type**: problem
- **Recommended**: Yes
- **Fixable**: Yes
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: Yes

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Using `concatLatestFrom` (a lazy version of `withLatestFrom`) ensures that the selector is only invoked when the effect receives the action.
In contrast to `withLatestFrom` that immediately subscribes whether the action is dispatched yet or not. If that state used by the selector is not initialized yet, you could get an error that you're not expecting.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  detail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ProductDetailPage.loaded),
      // ⚠
      withLatestFrom(this.store.select(selectProducts)),
      mergeMap(([action, products]) => {
        ...
      })
    )
  })
}
```

Examples of **correct** code for this rule:

```ts
class Effect {
  detail$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ProductDetailPage.loaded),
      concatLatestFrom(() => this.store.select(selectProducts)),
      mergeMap(([action, products]) => {
        ...
      })
    )
  })
}
```

## Rule Config

To configure this rule you can use the `strict` option.
The default is `false`.

To always report the uses of `withLatestFrom` use:

```json
"rules": {
  "ngrx/prefer-concat-latest-from": ["warn", { "strict": true }]
}
```

To report only needed uses of `withLatestFrom` use:

```json
"rules": {
  "ngrx/prefer-concat-latest-from": ["warn", { "strict": false }]
}
```

## Further reading

- [`concatLatestFrom` API](https://ngrx.io/api/effects/concatLatestFrom)
- [Incorporating State](https://ngrx.io/guide/effects#incorporating-state)
