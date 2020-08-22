---
kind: InterfaceDeclaration
name: ChangeSetUpsert
module: data
---

# ChangeSetUpsert

```ts
interface ChangeSetUpsert<T = any> {
  op: ChangeSetOperation.Upsert;
  entityName: string;
  entities: T[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L27-L31)
