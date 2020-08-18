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
