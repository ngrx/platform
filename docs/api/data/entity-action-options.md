---
kind: InterfaceDeclaration
name: EntityActionOptions
module: data
---

# EntityActionOptions

```ts
interface EntityActionOptions {
  readonly correlationId?: any;
  readonly isOptimistic?: boolean;
  readonly mergeStrategy?: MergeStrategy;
  readonly tag?: string;
  error?: Error;
  skip?: boolean;
}
```
