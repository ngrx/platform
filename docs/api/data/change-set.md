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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L45-L57)
