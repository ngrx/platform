---
kind: ClassDeclaration
name: EntityActionGuard
module: data
---

# EntityActionGuard

## description

Guard methods that ensure EntityAction payload is as expected.
Each method returns that payload if it passes the guard or
throws an error.

```ts
class EntityActionGuard<T> {
  mustBeEntity(action: EntityAction<T>): T;
  mustBeEntities(action: EntityAction<T[]>): T[];
  mustBeKey(action: EntityAction<string | number>): string | number | never;
  mustBeKeys(action: EntityAction<(string | number)[]>): (string | number)[];
  mustBeUpdate(action: EntityAction<Update<T>>): Update<T>;
  mustBeUpdates(action: EntityAction<Update<T>[]>): Update<T>[];
  mustBeUpdateResponse(
    action: EntityAction<UpdateResponseData<T>>
  ): UpdateResponseData<T>;
  mustBeUpdateResponses(
    action: EntityAction<UpdateResponseData<T>[]>
  ): UpdateResponseData<T>[];
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L11-L156)

## Methods

### mustBeEntity

```ts
mustBeEntity(action: EntityAction<T>): T;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L15-L25)

#### Parameters (#mustBeEntity-parameters)

| Name   | Type              | Description |
| ------ | ----------------- | ----------- |
| action | `EntityAction<T>` |             |

### mustBeEntities

```ts
mustBeEntities(action: EntityAction<T[]>): T[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L28-L41)

#### Parameters (#mustBeEntities-parameters)

| Name   | Type                | Description |
| ------ | ------------------- | ----------- |
| action | `EntityAction<T[]>` |             |

### mustBeKey

```ts
mustBeKey(action: EntityAction<string | number>): string | number | never;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L44-L53)

#### Parameters (#mustBeKey-parameters)

| Name   | Type                            | Description |
| ------ | ------------------------------- | ----------- |
| action | `EntityAction<string | number>` |             |

### mustBeKeys

```ts
mustBeKeys(action: EntityAction<(string | number)[]>): (string | number)[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L56-L70)

#### Parameters (#mustBeKeys-parameters)

| Name   | Type                                | Description |
| ------ | ----------------------------------- | ----------- |
| action | `EntityAction<(string | number)[]>` |             |

### mustBeUpdate

```ts
mustBeUpdate(action: EntityAction<Update<T>>): Update<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L73-L84)

#### Parameters (#mustBeUpdate-parameters)

| Name   | Type                | Description |
| ------ | ------------------- | ----------- |
| action | `EntityAction<any>` |             |

### mustBeUpdates

```ts
mustBeUpdates(action: EntityAction<Update<T>[]>): Update<T>[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L87-L103)

#### Parameters (#mustBeUpdates-parameters)

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| action | `EntityAction<any[]>` |             |

### mustBeUpdateResponse

```ts
mustBeUpdateResponse(  action: EntityAction<UpdateResponseData<T>> ): UpdateResponseData<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L106-L119)

#### Parameters (#mustBeUpdateResponse-parameters)

| Name   | Type                                  | Description |
| ------ | ------------------------------------- | ----------- |
| action | `EntityAction<UpdateResponseData<T>>` |             |

### mustBeUpdateResponses

```ts
mustBeUpdateResponses(  action: EntityAction<UpdateResponseData<T>[]> ): UpdateResponseData<T>[];
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-action-guard.ts#L122-L140)

#### Parameters (#mustBeUpdateResponses-parameters)

| Name   | Type                                    | Description |
| ------ | --------------------------------------- | ----------- |
| action | `EntityAction<UpdateResponseData<T>[]>` |             |
