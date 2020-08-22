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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/entity/src/models.ts#L90-L99)
