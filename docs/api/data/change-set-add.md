---
kind: InterfaceDeclaration
name: ChangeSetAdd
module: data
---

# ChangeSetAdd

```ts
interface ChangeSetAdd<T = any> {
  op: ChangeSetOperation.Add;
  entityName: string;
  entities: T[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L9-L13)
