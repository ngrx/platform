---
kind: InterfaceDeclaration
name: EntityCollectionServiceElements
module: data
---

# EntityCollectionServiceElements

```ts
interface EntityCollectionServiceElements<
  T,
  S$ extends EntitySelectors$<T> = EntitySelectors$<T>
> {
  readonly dispatcher: EntityDispatcher<T>;
  readonly entityName: string;
  readonly selectors: EntitySelectors<T>;
  readonly selectors$: S$;
}
```
