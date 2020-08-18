---
kind: FunctionDeclaration
name: ofEntityType
module: data
---

# ofEntityType

```ts
function ofEntityType<T extends EntityAction>(
  ...allowedEntityNames: any[]
): OperatorFunction<EntityAction, T>;
```

## Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| allowedEntityNames | `any[]` |             |

## Overloads

```ts
function ofEntityType<T extends EntityAction>(
  ...allowedEntityNames: any[]
): OperatorFunction<EntityAction, T>;
```

### Parameters

| Name               | Type       | Description |
| ------------------ | ---------- | ----------- |
| allowedEntityNames | `string[]` |             |

```ts
function ofEntityType<T extends EntityAction>(
  ...allowedEntityNames: any[]
): OperatorFunction<EntityAction, T>;
```

### Parameters

| Name               | Type       | Description |
| ------------------ | ---------- | ----------- |
| allowedEntityNames | `string[]` |             |
