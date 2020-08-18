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
