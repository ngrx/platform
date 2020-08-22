---
kind: FunctionDeclaration
name: union
module: store
---

# union

```ts
function union<C extends { [key: string]: ActionCreator<string, Creator> }>(
  creators: C
): ReturnType<C[keyof C]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/action_creator.ts#L131-L135)

## Parameters

| Name     | Type | Description |
| -------- | ---- | ----------- |
| creators | `C`  |             |
