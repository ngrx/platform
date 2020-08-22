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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action.ts#L13-L37)
