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

## Parameters

| Name      | Type             | Description                      |
| --------- | ---------------- | -------------------------------- |
| changeSet | `ChangeSet<any>` | ChangeSet with changes to filter |
