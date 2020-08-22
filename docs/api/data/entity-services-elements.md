---
kind: ClassDeclaration
name: EntityServicesElements
module: data
---

# EntityServicesElements

```ts
class EntityServicesElements {
  readonly entityActionErrors$: Observable<EntityAction>;
  readonly entityCache$: Observable<EntityCache> | Store<EntityCache>;
  readonly reducedActions$: Observable<Action>;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/entity-services/entity-services-elements.ts#L12-L43)

## Parameters

| Name                 | Type                            | Description                                                                           |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| entityActionErrors\$ | `Observable<EntityAction<any>>` | /\*_ Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types _/ |
| entityCache\$        | `any`                           | /\*_ Observable of the entire entity cache _/                                         |
| reducedActions\$     | `Observable<any>`               | /\*\*                                                                                 |

- Actions scanned by the store after it processed them with reducers.
- A replay observable of the most recent action reduced by the store.
  \*/ |
