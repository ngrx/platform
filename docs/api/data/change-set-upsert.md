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
