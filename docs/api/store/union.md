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

## Parameters

| Name     | Type | Description |
| -------- | ---- | ----------- |
| creators | `C`  |             |
