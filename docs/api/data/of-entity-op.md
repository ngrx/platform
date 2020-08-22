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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L25-L47)

## Parameters

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| allowedEntityOps | `any[]` |             |

## Overloads

### description

Select actions concerning one of the allowed Entity operations

```ts
function ofEntityOp<T extends EntityAction>(
  allowedOps: string[] | EntityOp[]
): OperatorFunction<EntityAction, T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L19-L21)

### Parameters

| Name             | Type                                                                              | Description |
| ---------------- | --------------------------------------------------------------------------------- | ----------- |
| allowedEntityOps | `` | Entity operations (e.g, EntityOp.QUERY_ALL) whose actions should be selected |
| allowedOps       | `string[] | EntityOp[]`                                                           |             |

```ts
function ofEntityOp<T extends EntityAction>(
  ...allowedOps: (string | EntityOp)[]
): OperatorFunction<EntityAction, T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L22-L24)

### Parameters

| Name       | Type       | Description |
| ---------- | ---------- | ----------- |
| allowedOps | `string[]` |             |
