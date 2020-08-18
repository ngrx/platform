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
