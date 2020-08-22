---
kind: InterfaceDeclaration
name: EntityState
module: entity
---

# EntityState

```ts
interface EntityState<T> {
  ids: string[] | number[];
  entities: Dictionary<T>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/entity/src/models.ts#L44-L47)
