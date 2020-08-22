---
kind: InterfaceDeclaration
name: ChangeSetDelete
module: data
---

# ChangeSetDelete

```ts
interface ChangeSetDelete {
  op: ChangeSetOperation.Delete;
  entityName: string;
  entities: string[] | number[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L15-L19)
