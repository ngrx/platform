---
kind: FunctionDeclaration
name: ofEntityOp
module: data
---

# ofEntityOp

```ts
function ofEntityOp<T extends EntityAction>(
  ...allowedEntityOps: any[]
): OperatorFunction<EntityAction, T>;
```

## Parameters

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| allowedEntityOps | `any[]` |             |

## Overloads

```ts
function ofEntityOp<T extends EntityAction>(
  ...allowedEntityOps: any[]
): OperatorFunction<EntityAction, T>;
```

### Parameters

| Name       | Type                    | Description |
| ---------- | ----------------------- | ----------- |
| allowedOps | `string[] | EntityOp[]` |             |

```ts
function ofEntityOp<T extends EntityAction>(
  ...allowedEntityOps: any[]
): OperatorFunction<EntityAction, T>;
```

### Parameters

| Name       | Type       | Description |
| ---------- | ---------- | ----------- |
| allowedOps | `string[]` |             |
