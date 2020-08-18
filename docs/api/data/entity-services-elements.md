---
kind: ClassDeclaration
name: EntityServicesElements
module: data
---

# EntityServicesElements

```ts
class EntityServicesElements {
  readonly entityActionErrors$: Observable<EntityAction>;
  readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;
  readonly reducedActions$: Observable<Action>;
}
```
