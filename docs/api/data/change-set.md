---
kind: InterfaceDeclaration
name: ChangeSet
module: data
---

# ChangeSet

```ts
interface ChangeSet<T = any> {
  changes: ChangeSetItem[];
  extras?: T;
  tag?: string;
}
```
