---
kind: ClassDeclaration
name: EntityActionFactory
module: data
---

# EntityActionFactory

```ts
class EntityActionFactory {
  create<P = any>(
    nameOrPayload: EntityActionPayload<P> | string,
    entityOp?: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  create<P = any>(
    entityName: string,
    entityOp: EntityOp,
    data?: P,
    options?: EntityActionOptions
  ): EntityAction<P>;
  create<P = any>(payload: EntityActionPayload<P>): EntityAction<P>;
  createFromAction<P = any>(
    from: EntityAction,
    newProperties: Partial<EntityActionPayload<P>>
  ): EntityAction<P>;
  formatActionType(op: string, tag: string);
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L9-L85)

## Methods

### create

```ts
create<P = any>(  nameOrPayload: EntityActionPayload<P> | string,  entityOp?: EntityOp,  data?: P,  options?: EntityActionOptions ): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L34-L50)

#### Parameters (#create-parameters)

| Name          | Type                              | Description |
| ------------- | --------------------------------- | ----------- |
| nameOrPayload | `string | EntityActionPayload<P>` |             |
| entityOp      | `EntityOp`                        |             |
| data          | `P`                               |             |
| options       | `EntityActionOptions`             |             |

### create

#### description (#create-description)

Create an EntityAction to perform an operation (op) for a particular entity type
(entityName) with optional data and other optional flags

```ts
create<P = any>(  entityName: string,  entityOp: EntityOp,  data?: P,  options?: EntityActionOptions ): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L19-L24)

#### Parameters (#create-parameters)

| Name       | Type                        | Description                     |
| ---------- | --------------------------- | ------------------------------- |
| entityName | `string`                    | Name of the entity type         |
| entityOp   | `EntityOp`                  | Operation to perform (EntityOp) |
| [data]     | `` | data for the operation |
| [options]  | `` | additional options     |
| data       | `P`                         |                                 |
| options    | `EntityActionOptions`       |                                 |

### create

#### description (#create-description)

Create an EntityAction to perform an operation (op) for a particular entity type
(entityName) with optional data and other optional flags

```ts
create<P = any>(payload: EntityActionPayload<P>): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L31-L31)

#### Parameters (#create-parameters)

| Name    | Type                     | Description                              |
| ------- | ------------------------ | ---------------------------------------- |
| payload | `EntityActionPayload<P>` | Defines the EntityAction and its options |

### createFromAction

#### description (#createFromAction-description)

Create an EntityAction from another EntityAction, replacing properties with those from newPayload;

```ts
createFromAction<P = any>(  from: EntityAction,  newProperties: Partial<EntityActionPayload<P>> ): EntityAction<P>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L74-L79)

#### Parameters (#createFromAction-parameters)

| Name          | Type                              | Description                                                           |
| ------------- | --------------------------------- | --------------------------------------------------------------------- |
| from          | `EntityAction<any>`               | Source action that is the base for the new action                     |
| newProperties | `Partial<EntityActionPayload<P>>` | New EntityAction properties that replace the source action properties |

### formatActionType

```ts
formatActionType(op: string, tag: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-factory.ts#L81-L84)

#### Parameters (#formatActionType-parameters)

| Name | Type     | Description |
| ---- | -------- | ----------- |
| op   | `string` |             |
| tag  | `string` |             |
