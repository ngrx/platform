---
kind: FunctionDeclaration
name: excludeEmptyChangeSetItems
module: data
---

# excludeEmptyChangeSetItems

## description

Return ChangeSet after filtering out null and empty ChangeSetItems.

```ts
function excludeEmptyChangeSetItems(changeSet: ChangeSet): ChangeSet;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/actions/entity-cache-change-set.ts#L107-L113)

## Parameters

| Name      | Type             | Description                      |
| --------- | ---------------- | -------------------------------- |
| changeSet | `ChangeSet<any>` | ChangeSet with changes to filter |
