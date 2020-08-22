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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L67-L89)

## Parameters

| Name               | Type    | Description |
| ------------------ | ------- | ----------- |
| allowedEntityNames | `any[]` |             |

## Overloads

### description

Select actions concerning one of the allowed Entity types

```ts
function ofEntityType<T extends EntityAction>(
  allowedEntityNames?: string[]
): OperatorFunction<EntityAction, T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L61-L63)

### Parameters

| Name               | Type       | Description                                                      |
| ------------------ | ---------- | ---------------------------------------------------------------- |
| allowedEntityNames | `string[]` | Entity-type names (e.g, 'Hero') whose actions should be selected |

```ts
function ofEntityType<T extends EntityAction>(
  ...allowedEntityNames: string[]
): OperatorFunction<EntityAction, T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-operators.ts#L64-L66)

### Parameters

| Name               | Type       | Description |
| ------------------ | ---------- | ----------- |
| allowedEntityNames | `string[]` |             |
