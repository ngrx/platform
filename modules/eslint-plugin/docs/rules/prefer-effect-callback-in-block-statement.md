---
Fixable: yes
---

# prefer-effect-callback-in-block-statement

> A block statement is easier to troubleshoot.

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule prefers that the callback of an effect is a block statement.
This makes it easier to troubleshoot type errors, for when example an RxJS operator isn't imported.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  effectNOK = createEffect(() =>
    this.actions.pipe(
      ofType(detailsLoaded),
      concatMap(() => ...),
    )
  )
}
```

Examples of **correct** code for this rule:

```ts
class Effect {
  effectOK = createEffect(() => {
    return this.actions.pipe(
      ofType(detailsLoaded),
      concatMap(() => ...),
    )
  })
}
```

## Further reading

- https://github.com/ngrx/platform/issues/2192
