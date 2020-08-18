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
