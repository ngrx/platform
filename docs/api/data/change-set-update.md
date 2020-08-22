---
kind: InterfaceDeclaration
name: ChangeSetUpdate
module: data
---

# ChangeSetUpdate

```ts
interface ChangeSetUpdate<T = any> {
  op: ChangeSetOperation.Update;
  entityName: string;
  entities: Update<T>[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L21-L25)
