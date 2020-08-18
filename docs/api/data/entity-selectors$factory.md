---
kind: ClassDeclaration
name: EntitySelectors$Factory
module: data
---

# EntitySelectors\$Factory

```ts
class EntitySelectors$Factory {
  entityCache$: Observable<EntityCache>;
  entityActionErrors$: Observable<EntityAction>;

  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string,
    selectors: EntitySelectors<T>
  ): S$;
}
```
