# require-super-ondestroy

Overriden ngOnDestroy method in component stores require a call to super.ngOnDestroy().

- **Type**: problem
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule enforces that any class which inherits the `ComponentStore` class and overrides the `ngOnDestroy` lifecycle hook must include a call to `super.ngOnDestroy()`. This ensures proper cleanup of resources managed by the `ComponentStore` class.

Example of **incorrect** code for this rule:

```ts
@Injectable()
export class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  // ... other BooksStore class members

  override ngOnDestroy(): void {
    this.cleanUp(); // custom cleanup logic
  }
}
```

Example of **correct** code for this rule:

```ts
@Injectable()
export class BooksStore extends ComponentStore<BooksState> implements OnDestroy
{
  // ... other BooksStore class members

  override ngOnDestroy(): void {
    this.cleanUp();
    super.ngOnDestroy();
  }
}
```
