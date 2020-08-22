---
kind: TypeAliasDeclaration
name: EntityFilterFn
module: data
---

# EntityFilterFn

## description

Filters the `entities` array argument and returns the original `entities`,
or a new filtered array of entities.
NEVER mutate the original `entities` array itself.
/

```ts
export type EntityFilterFn<T> = (entities: T[], pattern?: any) => T[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-metadata/entity-filters.ts#L6-L6)
