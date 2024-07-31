# no-store-subscription

Using the `async` pipe is preferred over `store` subscription.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Examples of **incorrect** code for this rule:

```ts
ngOnInit() {
  this.store.select(selectedItems).subscribe(items => {
    this.items = items;
  })
}
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```ts
// in code
selectedItems$ = this.store.select(selectedItems)

// in template
{{ selectedItems$ | async }}
```
