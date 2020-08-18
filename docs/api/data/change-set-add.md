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
