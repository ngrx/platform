---
kind: InterfaceDeclaration
name: EntityAdapter
module: entity
---

# EntityAdapter

```ts
interface EntityAdapter<T> {
  selectId: IdSelector<T>;
  sortComparer: false | Comparer<T>;

  // inherited from EntityStateAdapter
}
```
