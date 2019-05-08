# Entity Collection

The NgRx Data library maintains a _cache_ (`EntityCache`) of
_entity collections_ for each _entity type_ in the _NgRx store_.

An _entity_collection_ implements the `EntityCollection` interface for an entity type.

| Property      | Meaning                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `ids`         | Primary key values in default sort order                                                            |
| `entities`    | Map of primary key to entity data values                                                            |
| `filter`      | The user's filtering criteria                                                                       |
| `loaded`      | Whether collection was filled by QueryAll; forced false after clear                                 |
| `loading`     | Whether currently waiting for query results to arrive from the server                               |
| `changeState` | When [change-tracking](guide/data/entity-change-tracker) is enabled, the `ChangeStates` of unsaved entities |

You can extend an entity types with _additional properties_ via
[entity metadata](guide/data/entity-metadata#additionalcollectionstate).
